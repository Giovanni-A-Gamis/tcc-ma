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
    Image,
    Animated
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { styles } from "./styles";
import * as Notifications from "expo-notifications";
import { BleManager } from "react-native-ble-plx";
import { encode as btoa } from "base-64";

// Configurações BLE (mantidas do código anterior)
export const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
export const CHARACTERISTIC_UUID_CMD = "87654321-4321-4321-4321-ba0987654321"; 
export const CHARACTERISTIC_UUID_NOTIFY = "BA987654-3210-FEDC-BA98-76543210FEDC"; 
export const ESP32_ID = "68:25:DD:20:A9:E2";

const manager = new BleManager();

// Hook BLE (mantido do código anterior)
function useBleService(onAlarmReceived) {
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const scanTimeout = useRef(null);

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
            console.log("❌ BLE: Falha na conexão.", err.message);
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

        if (scanTimeout.current) clearTimeout(scanTimeout.current);
        scanTimeout.current = setTimeout(() => {
            manager.stopDeviceScan();
            if (!isConnected) console.log("BLE: Scan automático parado.");
        }, 10000); 
    };

    const sendCommand = async (command) => {
        if (!connectedDevice) {
            console.log("❌ BLE: Não conectado. Impossível enviar comando.");
            return;
        }
        try {
            await connectedDevice.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID_CMD,
                btoa(command)
            );
            console.log("➡️ BLE: Comando enviado:", command);
        } catch (err) {
            console.error("❌ BLE: Erro ao enviar comando:", err);
        }
    };
    
    useEffect(() => {
        scanForDevicesAndConnect();
        return () => {
            if (scanTimeout.current) clearTimeout(scanTimeout.current);
        };
    }, []);

    return {
        isConnected,
        sendCommand,
    };
}

// Configurações de Notificação (mantidas)
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

// Componente Principal Atualizado
export default function AlarmScreen() {
    const { sendCommand, isConnected: isBleConnected } = useBleService();
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
    const [alarmeTocandoId, setAlarmeTocandoId] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    const diasSemana = [
        { id: 1, nome: "Dom", completo: "Domingo" },
        { id: 2, nome: "Seg", completo: "Segunda" },
        { id: 3, nome: "Ter", completo: "Terça" },
        { id: 4, nome: "Qua", completo: "Quarta" },
        { id: 5, nome: "Qui", completo: "Quinta" },
        { id: 6, nome: "Sex", completo: "Sexta" },
        { id: 7, nome: "Sáb", completo: "Sábado" },
    ];

    useEffect(() => {
        (async () => {
            const ok = await registerForLocalNotifications();
            if (ok) fetchUser();
            
            // Animação de entrada
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        })();
    }, []);

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener((notification) => {
            const titulo = notification.request.content.title;
            const alarme = alarmes.find(a => titulo.includes(a.titulo));
            if (alarme) setAlarmeTocandoId(alarme.id);

            if (isBleConnected) {
                sendCommand("ON");
            }
        });
        return () => subscription.remove();
    }, [alarmes, isBleConnected, sendCommand]);

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
            } else {
                const { data, error } = await supabase
                    .from("alarmes")
                    .insert([{ titulo, horario, ativo, user_id: user.id }])
                    .select("id");
                if (error) throw error;
                alarmeId = data[0]?.id;
            }

            if (alarmeId && diasSelecionados.length > 0) {
                const inserts = diasSelecionados.map((diaId) => ({
                    alarme_id: alarmeId,
                    dia_semana_id: diaId,
                }));
                await supabase.from("alarme_dias").insert(inserts);
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
        
        if (isBleConnected) {
            const comando = novoAtivo ? "ON" : "OFF";
            await sendCommand(comando);
        }
    }

    async function agendarAlarme(alarme) {
        try {
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

                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `⏰ ${alarme.titulo || "Alarme"}`,
                        body: mensagem,
                        sound: "default",
                    },
                    trigger: { type: "date", date: proximaData },
                });
            }

            for (const diaId of dias) {
                await Notifications.scheduleNotificationAsync({
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
            }
            
            if (isBleConnected) {
                await sendCommand("ALARM_SCHEDULED");
            }
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

    const getDiasTexto = (dias) => {
        if (dias.length === 0) return "Uma vez";
        if (dias.length === 7) return "Todos os dias";
        
        const diasSelecionados = diasSemana.filter(d => dias.includes(d.id));
        return diasSelecionados.map(d => d.nome).join(", ");
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Header Moderno */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Alarmes Inteligentes</Text>
                    <Text style={styles.headerSubtitle}>
                        Programe seus treinos de memória
                    </Text>
                </View>
                
                {/* Status de Conexão */}
                <View style={styles.connectionStatus}>
                    <View style={[
                        styles.connectionDot, 
                        { backgroundColor: isBleConnected ? '#4CAF50' : '#F44336' }
                    ]} />
                    <Text style={styles.connectionText}>
                        {isBleConnected ? 'Dispositivo Conectado' : 'Procurando Dispositivo...'}
                    </Text>
                </View>
            </View>

            {/* Visual do Dispositivo */}
            <View style={styles.deviceVisual}>
                <View style={styles.deviceImages}>
                    <Image source={require('../../../assets/bracogpt.png')} style={styles.deviceImage} />
                    <Image source={require('../../../assets/seta.png')} style={styles.arrowImage} />
                    <Image source={require('../../../assets/blueazul.png')} style={styles.deviceImage} />
                </View>
                <Text style={styles.deviceDescription}>
                    Seus alarmes sincronizam com o dispositivo wearable
                </Text>
            </View>

            {/* Lista de Alarmes */}
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {alarmes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="alarm-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyTitle}>Nenhum alarme programado</Text>
                        <Text style={styles.emptyText}>
                            Toque no + para criar seu primeiro alarme
                        </Text>
                    </View>
                ) : (
                    alarmes.map((alarme) => (
                        <TouchableOpacity 
                            key={alarme.id} 
                            onPress={() => handleOpenModal(alarme)}
                            activeOpacity={0.9}
                        >
                            <View style={[
                                styles.alarmCard,
                                !alarme.ativo && styles.alarmCardInativo,
                                alarmeTocandoId === alarme.id && styles.alarmCardAtivo
                            ]}>
                                {/* Header do Card */}
                                <View style={styles.alarmHeader}>
                                    <View style={styles.alarmTimeContainer}>
                                        <Text style={[
                                            styles.alarmTime,
                                            !alarme.ativo && styles.textInativo
                                        ]}>
                                            {alarme.horario}
                                        </Text>
                                        <Text style={styles.alarmRepetition}>
                                            {getDiasTexto(alarme.dias)}
                                        </Text>
                                    </View>
                                    
                                    {alarmeTocandoId === alarme.id ? (
                                        <TouchableOpacity
                                            style={styles.stopButton}
                                            onPress={async () => {
                                                if (isBleConnected) await sendCommand("OFF");
                                                await toggleAtivo(alarme);
                                                setAlarmeTocandoId(null);
                                            }}
                                        >
                                            <Ionicons name="stop-circle" size={32} color="#F44336" />
                                        </TouchableOpacity>
                                    ) : (
                                        <Switch 
                                            value={alarme.ativo} 
                                            onValueChange={() => toggleAtivo(alarme)}
                                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                                            thumbColor={alarme.ativo ? "#17285D" : "#f4f3f4"}
                                        />
                                    )}
                                </View>
                                
                                {/* Título e Dias */}
                                <Text style={[
                                    styles.alarmTitle,
                                    !alarme.ativo && styles.textInativo
                                ]}>
                                    {alarme.titulo}
                                </Text>
                                
                                {/* Dias da Semana */}
                                <View style={styles.diasContainer}>
                                    {diasSemana.map((dia) => (
                                        <View
                                            key={dia.id}
                                            style={[
                                                styles.diaPill,
                                                alarme.dias.includes(dia.id) 
                                                    ? styles.diaPillAtivo 
                                                    : styles.diaPillInativo,
                                                !alarme.ativo && styles.diaPillDisabled
                                            ]}
                                        >
                                            <Text style={[
                                                styles.diaText,
                                                alarme.dias.includes(dia.id) 
                                                    ? styles.diaTextAtivo 
                                                    : styles.diaTextInativo
                                            ]}>
                                                {dia.nome}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* FAB Moderno */}
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => handleOpenModal()}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color="#FFF" />
            </TouchableOpacity>

            {/* Modal Modernizado */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingAlarme ? "Editar Alarme" : "Novo Alarme"}
                            </Text>
                            <TouchableOpacity 
                                style={styles.modalClose}
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Título do Alarme</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Treino Matinal"
                                placeholderTextColor="#999"
                                value={titulo}
                                onChangeText={setTitulo}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Horário</Text>
                            <TouchableOpacity 
                                style={styles.timePickerButton} 
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Ionicons name="time-outline" size={20} color="#666" />
                                <Text style={styles.timePickerText}>{horario}</Text>
                            </TouchableOpacity>
                        </View>

                        {showTimePicker && (
                            <DateTimePicker
                                value={date}
                                mode="time"
                                is24Hour
                                display="clock"
                                onChange={onChangeTime}
                            />
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Repetir</Text>
                            <View style={styles.diasContainerModal}>
                                {diasSemana.map((dia) => (
                                    <TouchableOpacity
                                        key={dia.id}
                                        style={[
                                            styles.diaSelecionavel,
                                            diasSelecionados.includes(dia.id) && styles.diaSelecionado,
                                        ]}
                                        onPress={() => toggleDia(dia.id)}
                                    >
                                        <Text style={[
                                            styles.diaTexto,
                                            diasSelecionados.includes(dia.id) && styles.diaTextoSelecionado
                                        ]}>
                                            {dia.nome}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            {editingAlarme && (
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.deleteButton]}
                                    onPress={excluirAlarme}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FFF" />
                                    <Text style={styles.deleteButtonText}>Excluir</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]} 
                                onPress={salvarAlarme}
                            >
                                <Ionicons name="save-outline" size={20} color="#FFF" />
                                <Text style={styles.saveButtonText}>
                                    {editingAlarme ? "Atualizar" : "Criar Alarme"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Animated.View>
    );
}