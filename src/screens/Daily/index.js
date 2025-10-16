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

    useEffect(() => {
        if (user) {
            loadDiaries(user.id);
        }
    }, [user]); // Adicione user como dependência

    async function fetchUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Erro ao pegar usuário:", error);
            return;
        }
        setUser(data.user);
    }

    async function loadDiaries(user_id) {
        try {
            const data = await getDiaries(user_id);
            setDiaries(data);

            // Encontra o diário de hoje
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            
            const todayEntry = data.find(d => {
                const diaryDate = new Date(d.data_registro);
                const diaryDateStr = diaryDate.toISOString().split('T')[0];
                return diaryDateStr === todayStr;
            });

            setTodayDiary(todayEntry || null);
        } catch (error) {
            console.error("Erro ao carregar diários:", error);
        }
    }

    function handleOpenModal() {
        setConteudo(todayDiary ? todayDiary.conteudo : "");
        setModalVisible(true);
    }

    const handleEditTodayDiary = () => {
        if (todayDiary) {
            setConteudo(todayDiary.conteudo);
            setModalVisible(true);
        }
    }

    async function saveTodayDiary() {
        if (!user) return;

        try {
            if (todayDiary) {
                await updateDiary(todayDiary.id, conteudo);
                console.log("Diário atualizado com sucesso");
            } else {
                const today = new Date().toISOString().split('T')[0];
                await createDiary({ 
                    user_id: user.id, 
                    titulo: "Dia Atual", 
                    conteudo,
                    data_registro: today,
                });
                console.log("Diário criado com sucesso");
            }
            setModalVisible(false);
            await loadDiaries(user.id); // Recarrega os diários
        } catch (error) {
            console.error("Erro ao salvar diário:", error);
        }
    }

    // Função para verificar se um diário é de hoje
    const isTodayDiary = (diary) => {
        if (!diary || !todayDiary) return false;
        return diary.id === todayDiary.id;
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.diaryList}>
                <Text style={{
                    fontSize: 22,
                    fontFamily: "Poppins_700Bold",
                    color: "#17285D",
                    marginBottom: 20,
                    textAlign: "center",
                }}>
                    Escreva sobre o seu dia
                </Text>
                
                {diaries.map((d) => {
                    const isExpanded = expandedDiaries[d.id];
                    const isTodayEntry = isTodayDiary(d);
                    
                    return (
                        <View key={d.id} style={[
                            styles.diaryItem,
                            isTodayEntry && styles.todayDiaryItem
                        ]}>
                            <View style={styles.diaryHeader}>
                                <Text style={styles.diaryDate}>
                                    {new Date(d.data_registro).toLocaleDateString('pt-BR')}
                                    {isTodayEntry && " • Hoje"}
                                </Text>
                                {isTodayEntry && (
                                    <TouchableOpacity 
                                        style={styles.editButton}
                                        onPress={handleEditTodayDiary} // Corrigido aqui
                                    >
                                        <Ionicons name="pencil" size={18} color="#17285D" />
                                        <Text style={styles.editButtonText}>Editar</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            
                            <TouchableOpacity onPress={() => toggleExpand(d.id)}>
                                <Text
                                    style={styles.diaryContent}
                                    numberOfLines={isExpanded ? undefined : 3}
                                >
                                    {d.conteudo}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>

            {/* FAB só aparece se NÃO houver diário de hoje */}
            {!todayDiary && (
                <TouchableOpacity style={styles.fab} onPress={handleOpenModal}>
                    <Ionicons name="pencil" size={30} color="#FFF" />
                </TouchableOpacity>
            )}

            {/* Modal */}
            <Modal 
                visible={modalVisible} 
                animationType="slide" 
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {todayDiary ? "Editar registro de hoje" : "Diga o que consegue lembrar"}
                        </Text>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            placeholder="Escreva sobre seu dia, suas memórias, sentimentos..."
                            placeholderTextColor="#999"
                            value={conteudo}
                            onChangeText={setConteudo}
                            autoFocus={true}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={styles.saveButton} 
                                onPress={saveTodayDiary}
                            >
                                <Text style={styles.saveButtonText}>
                                    {todayDiary ? "Atualizar" : "Salvar"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}