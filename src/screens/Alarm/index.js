import React, { useEffect, useState } from "react";
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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { styles } from "./styles";
import * as Notifications from "expo-notifications";

// ========================================================
// CONFIGURAÇÕES GLOBAIS DE NOTIFICAÇÃO
// ========================================================

// Handler global — sem isso as notificações não aparecem!
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Canal Android
if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("alarm-channel", {
        name: "MemoriaAtiva",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 500, 500, 500],
        lightColor: "#FF231F7C",
    });
}

// Solicitação de permissão
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
// COMPONENTE PRINCIPAL
// ========================================================

export default function AlarmScreen() {
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

        // Monta a mensagem extra
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
            return;
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
            <ScrollView style={styles.list}>
                {alarmes.map((a) => (
                    <TouchableOpacity key={a.id} onPress={() => handleOpenModal(a)}>
                        <View style={styles.alarmCard}>
                            <View style={styles.alarmHeader}>
                                <Text style={styles.alarmTime}>{a.horario}</Text>
                                <Switch value={a.ativo} onValueChange={() => toggleAtivo(a)} />
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
