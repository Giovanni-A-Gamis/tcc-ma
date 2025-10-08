import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Switch,
    Platform,
    Alert,
    PermissionsAndroid,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { styles } from "./styles"; // Certifique-se de que o caminho para 'styles' está correto
import * as Notifications from "expo-notifications";
import { BleManager } from "react-native-ble-plx";
import { encode as btoa } from "base-64";

// ========================================================
// CONFIGURAÇÕES E SERVIÇOS BLE (INTEGRADOS NO ARQUIVO)
// ========================================================

// Definições de UUIDs e ID do ESP32
export const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
export const CHARACTERISTIC_UUID_CMD = "87654321-4321-4321-4321-ba0987654321"; 
export const CHARACTERISTIC_UUID_NOTIFY = "BA987654-3210-FEDC-BA98-76543210FEDC"; 
export const ESP32_ID = "68:25:DD:20:A9:E2"; // Mantenha o ID real do seu ESP32 aqui

const manager = new BleManager();

// Função para decodificar base64 (adaptada para React Native)
function atob(b64) {
    // É necessário que o Buffer esteja disponível no ambiente (ou que você use uma alternativa)
    // Para muitos ambientes RN, Buffer é injetado, mas pode exigir polyfills
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(b64, 'base64').toString('utf8');
    }
    // Caso o Buffer não esteja disponível, pode ser necessário um método de decodificação diferente
    // Depende da sua configuração específica de polyfill no React Native
    return b64; 
}

/**
 * Hook para gerenciar a conexão BLE com o ESP32.
 * @param {function(string): void} onAlarmReceived - Callback para quando o ESP32 notificar.
 */
function useBleService(onAlarmReceived) {
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const scanTimeout = useRef(null);
    const alarmSubscription = useRef(null);
    // Não precisamos de 'status' e 'isScanning' se o scan for automático

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);
            return Object.values(granted).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
        }
        return true;
    };

    const connectToDevice = async (deviceId) => {
        manager.stopDeviceScan();

        try {
            const device = await manager.connectToDevice(deviceId, { timeout: 5000 });
            await device.requestMTU(517);
            await device.discoverAllServicesAndCharacteristics();
            
            setConnectedDevice(device);
            setIsConnected(true);
            console.log("✅ BLE: Conectado a:", device.id);

        } catch (err) {
            console.log("❌ BLE: Falha na conexão ou na escuta.", err.message);
            setIsConnected(false);
            setConnectedDevice(null);
        }
    };

    const scanForDevicesAndConnect = async () => {
        const ok = await requestPermissions();
        if (!ok) {
            console.log("BLE: Permissão Bluetooth não concedida.");
            return;
        }

        manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
            if (error) {
                console.error("Erro no scan BLE:", error.message);
                manager.stopDeviceScan();
                return;
            }

            if (device && device.id === ESP32_ID) {
                manager.stopDeviceScan(); 
                connectToDevice(device.id);
            }
        });

        // Timeout para parar o scan, mesmo que não encontre
        if (scanTimeout.current) clearTimeout(scanTimeout.current);
        scanTimeout.current = setTimeout(() => {
            manager.stopDeviceScan();
            if (!isConnected) console.log("BLE: Scan automático parado.");
        }, 10000); 
    };

    /**
     * Envia um comando em string para a característica BLE.
     * Exportamos APENAS esta função para fora do hook.
     */
    const sendCommand = async (command) => {
        if (!connectedDevice) {
            console.log("❌ BLE: Não conectado. Impossível enviar comando.");
            return;
        }
        try {
            await connectedDevice.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID_CMD, // Característica de Comando
                btoa(command) // Envia o comando codificado em Base64
            );
            console.log("➡️ BLE: Comando enviado:", command);
        } catch (err) {
            console.error("❌ BLE: Erro ao enviar comando:", err);
        }
    };
    
    // Inicia o scan automaticamente quando o componente é montado
    useEffect(() => {
        scanForDevicesAndConnect();
        return () => {
            if (alarmSubscription.current) alarmSubscription.current.remove();
            if (scanTimeout.current) clearTimeout(scanTimeout.current);
        };
    }, []); 

    // O hook retorna apenas as funções e status que o componente precisa
    return {
        isConnected,
        sendCommand,
    };
}


// ========================================================
// FUNÇÃO DE NOTIFICAÇÃO POR BLE (Para Notificações Recebidas)
// ========================================================
async function triggerBleNotification(data) {
    console.log("📢 Disparando Notificação Local pelo BLE:", data);
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🚨 ALARME ACIONADO PELO DISPOSITIVO",
            body: `Seu ESP32 enviou o sinal de alarme! Mensagem: ${data}`,
            sound: "default",
            priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null,
    });
}

// ========================================================
// CONFIGURAÇÕES GLOBAIS DE NOTIFICAÇÃO
// ========================================================

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("alarm-channel", {
        name: "MemoriaAtiva",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 500, 500, 500],
        lightColor: "#FF231F7C",
    });
}

async function registerForLocalNotifications() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        Alert.alert("Permissão necessária", "Sem permissão para notificações!");
        return false;
    }
    return true;
}

// ========================================================
// COMPONENTE PRINCIPAL (AlarmScreen)
// ========================================================

export default function AlarmScreen() {
    // ⚠️ CHAMA O HOOK BLE AGORA DEFINIDO INTERNAMENTE
    const { 
        sendCommand, 
        isConnected: isBleConnected 
    } = useBleService(triggerBleNotification);

    const [alarmes, setAlarmes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [horario, setHorario] = useState("08:00");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [diasSelecionados, setDiasSelecionados] = useState([]);
    const [ativo, setAtivo] = useState(true);
    const [user, setUser] = useState(null);
    const [editingAlarme, setEditingAlarme] = useState(null);

    const diasSemana = [
        { id: 1, nome: "Dom" },
        { id: 2, nome: "Seg" },
        { id: 3, nome: "Ter" },
        { id: 4, nome: "Qua" },
        { id: 5, nome: "Qui" },
        { id: 6, nome: "Sex" },
        { id: 7, nome: "Sáb" },
    ];

    useEffect(() => {
        (async () => {
            const ok = await registerForLocalNotifications();
            if (ok) fetchUser();
        })();
    }, []);

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener((notification) => {
            // Só envie se for uma notificação de alarme
            if (
                notification.request.content.title?.includes("Alarme") ||
                notification.request.content.title?.includes("⏰")
            ) {
                if (isBleConnected) {
                    sendCommand("ON");
                    console.log("Comando BLE enviado automaticamente: ON");
                }
            }
        });
        return () => subscription.remove();
    }, [isBleConnected, sendCommand]);

    async function fetchUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Erro ao pegar usuário:", error);
            return;
        }
        setUser(data.user);
        fetchAlarmes();
    }

    async function fetchAlarmes() {
        const { data, error } = await supabase
            .from("alarmes")
            .select("id, titulo, horario, ativo, alarme_dias(dias_da_semana(id, nome_dia))");

        if (error) {
            console.error(error);
            return;
        }

        const formatado = data.map((a) => ({
            id: a.id,
            titulo: a.titulo,
            horario: a.horario.slice(0, 5),
            ativo: a.ativo,
            dias: a.alarme_dias?.map((d) => d.dias_da_semana.id) || [],
        }));

        setAlarmes(formatado);
    }

    function toggleDia(id) {
        setDiasSelecionados((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
        );
    }

    function handleOpenModal(alarme = null) {
        if (alarme) {
            setEditingAlarme(alarme);
            setTitulo(alarme.titulo);
            setHorario(alarme.horario);
            setDiasSelecionados(alarme.dias);
            setAtivo(alarme.ativo);
        } else {
            setEditingAlarme(null);
            setTitulo("");
            setHorario("08:00");
            setDiasSelecionados([]);
            setAtivo(true);
        }
        setModalVisible(true);
    }

    async function salvarAlarme() {
        if (!user) return;

        let alarmeId;

        try {
            if (editingAlarme) {
                const { error } = await supabase
                    .from("alarmes")
                    .update({ titulo, horario, ativo })
                    .eq("id", editingAlarme.id);
                if (error) throw error;

                alarmeId = editingAlarme.id;

                await supabase.from("alarme_dias").delete().eq("alarme_id", alarmeId);
                const inserts = diasSelecionados.map((diaId) => ({
                    alarme_id: alarmeId,
                    dia_semana_id: diaId,
                }));
                await supabase.from("alarme_dias").insert(inserts);
            } else {
                const { data, error } = await supabase
                    .from("alarmes")
                    .insert([{ titulo, horario, ativo, user_id: user.id }])
                    .select("id");
                if (error) throw error;

                alarmeId = data[0]?.id;

                if (alarmeId && diasSelecionados.length > 0) {
                    const inserts = diasSelecionados.map((diaId) => ({
                        alarme_id: alarmeId,
                        dia_semana_id: diaId,
                    }));
                    await supabase.from("alarme_dias").insert(inserts);
                }
            }

            setModalVisible(false);
            fetchAlarmes();

            await agendarAlarme({
                id: alarmeId,
                titulo,
                horario,
                dias: diasSelecionados,
                ativo,
            });
        } catch (err) {
            console.error("Erro em salvarAlarme:", err);
        }
    }

    async function excluirAlarme() {
        if (!editingAlarme) return;

        Alert.alert("Excluir Alarme", "Tem certeza que deseja excluir este alarme?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    await supabase.from("alarme_dias").delete().eq("alarme_id", editingAlarme.id);
                    await supabase.from("alarmes").delete().eq("id", editingAlarme.id);
                    setModalVisible(false);
                    fetchAlarmes();
                },
            },
        ]);
    }

    async function toggleAtivo(alarme) {
        const novoAtivo = !alarme.ativo;
        const { error } = await supabase
            .from("alarmes")
            .update({ ativo: novoAtivo })
            .eq("id", alarme.id);
        if (error) console.error("Erro ao atualizar ativo:", error);

        fetchAlarmes();

        if (novoAtivo) await agendarAlarme(alarme);
        
        // ENVIO DE COMANDO BLE AO ATIVAR/DESATIVAR
        if (isBleConnected) {
            const comando = novoAtivo ? "ON" : "OFF";
            await sendCommand(comando);
            console.log(`Comando BLE enviado ao toggle: ${comando}`);
        }
    }

    async function agendarAlarme(alarme) {
        try {
            console.log("🔔 Agendando alarme:", alarme);

            if (!alarme.ativo) return;

            const [hora, minuto] = alarme.horario.split(":").map(Number);
            const dias = alarme.dias?.length > 0 ? alarme.dias : [];
            
            const existing = await Notifications.getAllScheduledNotificationsAsync();
            for (const notif of existing) {
                if (notif.content?.title === "⏰ Alarme" && notif.content?.body.includes(alarme.titulo)) {
                    await Notifications.cancelScheduledNotificationAsync(notif.identifier);
                }
            }

            const diasNomes = dias.map(d => diasSemana.find(ds => ds.id === d)?.nome).join(", ");
            const mensagem = dias.length > 0
                ? `Horário: ${alarme.horario}\nDias: ${diasNomes}\nNão se esqueça de treinar sua memória! 🧠`
                : `Horário: ${alarme.horario}\nHora do alarme!\n`;

            if (dias.length === 0) {
                const agora = new Date();
                const proximaData = new Date();
                proximaData.setHours(hora, minuto, 0, 0);
                if (proximaData <= agora) proximaData.setDate(proximaData.getDate() + 1);

                const id = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `⏰ ${alarme.titulo || "Alarme"}`,
                        body: mensagem,
                        sound: "default",
                    },
                    trigger: { type: "date", date: proximaData },
                });

                console.log("✅ Alarme único agendado:", id, proximaData.toISOString());
            }

            for (const diaId of dias) {
                const id = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `⏰ ${alarme.titulo || "Alarme"}`,
                        body: mensagem,
                        sound: "default",
                    },
                    trigger: {
                        weekday: diaId,
                        hour: hora,
                        minute: minuto,
                        repeats: true,
                    },
                });
                console.log(`🔁 Alarme recorrente (${diaId}) agendado:`, id);
            }
            
            // ENVIO DE COMANDO BLE APÓS AGENDAMENTO
            if (isBleConnected) {
                await sendCommand("ALARM_SCHEDULED"); 
                console.log("Comando BLE enviado: ALARM_SCHEDULED");
            }
            
            console.log("✅ Alarmes recorrentes agendados:", dias);
        } catch (err) {
            console.error("🚨 Erro em agendarAlarme:", err);
        }
    }


        const onChangeTime = (event, selectedDate) => {
            if (event.type === "dismissed") return setShowTimePicker(false);
            const currentDate = selectedDate || date;
            setShowTimePicker(false);
            setDate(currentDate);
            const hours = String(currentDate.getHours()).padStart(2, "0");
            const minutes = String(currentDate.getMinutes()).padStart(2, "0");
            setHorario(`${hours}:${minutes}`);
        };

        return (
            <View style={styles.container}>
                {/* Mostra status de conexão */}
                <View style={{ padding: 5, backgroundColor: isBleConnected ? '#d1e7dd' : '#f8d7da', borderBottomWidth: 1, borderColor: '#ccc' }}>
                    <Text style={{ fontSize: 14, textAlign: 'center', fontWeight: 'bold' }}>
                        Status BLE: {isBleConnected ? 'Conectado' : 'Procurando/Desconectado'}
                    </Text>
                </View>

                <ScrollView style={styles.list}>
                    {alarmes.map((a) => (
                        <TouchableOpacity key={a.id} onPress={() => handleOpenModal(a)}>
                            <View style={styles.alarmCard}>
                                <View style={styles.alarmHeader}>
                                    <Text style={styles.alarmTime}>{a.horario}</Text>
                                    <Switch 
                                        value={a.ativo} 
                                        onValueChange={() => toggleAtivo(a)} 
                                    />
                                </View>
                                <Text style={styles.alarmTitle}>{a.titulo}</Text>
                                <View style={styles.diasContainer}>
                                    {diasSemana.map((d) => (
                                        <Text
                                            key={d.id}
                                            style={[styles.dia, a.dias.includes(d.id) && styles.diaAtivo]}
                                        >
                                            {d.nome}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.fab} onPress={() => handleOpenModal()}>
                    <Ionicons name="add" size={30} color="#FFF" />
                </TouchableOpacity>

                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {editingAlarme ? "Editar Alarme" : "Novo Alarme"}
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Título"
                                value={titulo}
                                onChangeText={setTitulo}
                            />

                            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                                <Text>{horario}</Text>
                            </TouchableOpacity>

                            {showTimePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="time"
                                    is24Hour
                                    display="clock"
                                    onChange={onChangeTime}
                                />
                            )}

                            <Text style={styles.sectionTitle}>Dias da Semana</Text>
                            <View style={styles.diasContainer}>
                                {diasSemana.map((d) => (
                                    <TouchableOpacity
                                        key={d.id}
                                        style={[
                                            styles.diaSelecionavel,
                                            diasSelecionados.includes(d.id) && styles.diaSelecionado,
                                        ]}
                                        onPress={() => toggleDia(d.id)}
                                    >
                                        <Text style={styles.diaTexto}>{d.nome}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={salvarAlarme}>
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>

                            {editingAlarme && (
                                <TouchableOpacity
                                    style={[styles.cancelButton, { backgroundColor: "#F87171" }]}
                                    onPress={excluirAlarme}
                                >
                                    <Text style={[styles.cancelButtonText, { color: "#FFF" }]}>Excluir</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }