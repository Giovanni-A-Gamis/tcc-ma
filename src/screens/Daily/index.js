import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { styles } from "./styles";
import { getDiaries, createDiary, updateDiary } from "../../services/diaryService";
import { supabase } from "../../lib/supabase";

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

        const today = new Date(); // horário local
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const todayEntry = data.find((d) => {
            const localDate = new Date(d.data_registro); // transforma UTC em local
            const dStr = `${localDate.getFullYear()}-${String(localDate.getMonth()+1).padStart(2,'0')}-${String(localDate.getDate()).padStart(2,'0')}`;
            return dStr === todayStr;
        });

        setTodayDiary(todayEntry || null);
        setConteudo(todayEntry ? todayEntry.conteudo : "");
    }


    async function saveTodayDiary() {
        if (!user) return;

        if (todayDiary) {
        await updateDiary(todayDiary.id, conteudo);
        } else {
        await createDiary({ user_id: user.id, titulo: "Dia Atual", conteudo });
        }
        setModalVisible(false);
        loadDiaries(user.id);
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
                                {new Date(d.data_registro).toLocaleDateString("pt-BR")}
                            </Text>
                            <Text
                                style={styles.diaryContent}
                                numberOfLines={isExpanded ? undefined : 3} // mostra 3 linhas ou tudo
                            >
                                {d.conteudo}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>


        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
            <Text style={styles.fabText}>+</Text>
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
