import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { styles } from "./styles";
import { getDiaries, createDiary, updateDiary } from "../../services/diaryService";
import { supabase } from "../../lib/supabase";
import { Ionicons } from '@expo/vector-icons';

export default function Diary() {
    const [user, setUser] = useState(null);
    const [diaries, setDiaries] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [conteudo, setConteudo] = useState("");
    const [todayDiary, setTodayDiary] = useState(null);
    const [expandedDiaries, setExpandedDiaries] = useState({});

    function toggleExpand(id) {
        setExpandedDiaries(prev => ({
            ...prev,
            [id]: !prev[id], 
        }));
    }

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Erro ao pegar usuário:", error);
            return;
        }
        setUser(data.user);
        if (data.user) loadDiaries(data.user.id);
    }

    async function loadDiaries(user_id) {
        const data = await getDiaries(user_id);
        setDiaries(data);

        // Normaliza a data de hoje
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const todayStr = `${yyyy}-${mm}-${dd}`;

        // Normaliza cada entrada
        const todayEntry = data.find((d) => {
            const localDate = new Date(d.data_registro);
            const entryStr = localDate.toISOString().split("T")[0]; // só yyyy-mm-dd
            return entryStr === todayStr;
        });

        setTodayDiary(todayEntry || null);
    }


    function handleOpenModal() {
        setConteudo(todayDiary ? todayDiary.conteudo : "");
        setModalVisible(true);
    }

    async function saveTodayDiary() {
        if (!user) return;

        if (todayDiary) {
            await updateDiary(todayDiary.id, conteudo);
        } else {
            const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
            await createDiary({ 
                user_id: user.id, 
                titulo: "Dia Atual", 
                conteudo,
                data_registro: today, // força a mesma chave de comparação
            });
        }
        setModalVisible(false);
        await loadDiaries(user.id);
    }


    return (
        <View style={styles.container}>
            <ScrollView style={styles.diaryList}>
                {diaries.map((d) => {
                    const isExpanded = expandedDiaries[d.id];
                    return (
                        <TouchableOpacity key={d.id} onPress={() => toggleExpand(d.id)}>
                            <View style={styles.diaryItem}>
                                <Text style={styles.diaryDate}>
                                    {new Date(d.data_registro).toLocaleDateString()}
                                </Text>
                                <Text
                                    style={styles.diaryContent}
                                    numberOfLines={isExpanded ? undefined : 3}
                                >
                                    {d.conteudo}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={handleOpenModal}>
                <Ionicons name="pencil" size={30} color="#FFF" />
            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Escreva seu dia</Text>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            value={conteudo}
                            onChangeText={setConteudo}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={saveTodayDiary}>
                            <Text style={styles.saveButtonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
