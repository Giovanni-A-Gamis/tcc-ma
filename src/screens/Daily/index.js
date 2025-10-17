import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Modal, 
    TextInput,
    Animated,
    ImageBackground
} from "react-native";
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
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.9));

    function toggleExpand(id) {
        setExpandedDiaries(prev => ({
            ...prev,
            [id]: !prev[id], 
        }));
    }

    useEffect(() => {
        fetchUser();
        
        // Animação de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    useEffect(() => {
        if (user) {
            loadDiaries(user.id);
        }
    }, [user]);

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
            await loadDiaries(user.id);
        } catch (error) {
            console.error("Erro ao salvar diário:", error);
        }
    }

    // Função para verificar se um diário é de hoje
    const isTodayDiary = (diary) => {
        if (!diary || !todayDiary) return false;
        return diary.id === todayDiary.id;
    };

    // Função para obter o humor baseado no conteúdo (simulação)
    const getDiaryMood = (content) => {
        if (!content) return "😊";
        
        const positiveWords = ['feliz', 'bom', 'ótimo', 'incrível', 'maravilhoso', 'alegre', 'gratidão'];
        const negativeWords = ['triste', 'ruim', 'péssimo', 'difícil', 'cansado', 'estressado'];
        
        const lowerContent = content.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
        
        if (positiveCount > negativeCount) return "😊";
        if (negativeCount > positiveCount) return "😔";
        return "😐";
    };

    // Função para obter cor baseada no humor
    const getMoodColor = (mood) => {
        switch (mood) {
            case "😊": return "#4CAF50";
            case "😔": return "#F44336";
            default: return "#FF9800";
        }
    };

    // Função para formatar a data de forma mais amigável
    const formatDiaryDate = (dateString) => {
        const today = new Date();
        const diaryDate = new Date(dateString);
        const diffTime = Math.abs(today - diaryDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "Hoje";
        if (diffDays === 2) return "Ontem";
        if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
        
        return diaryDate.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            {/* Header Imersivo */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Diário de Memórias</Text>
                    <Text style={styles.headerSubtitle}>
                        Preserve seus momentos e fortaleça sua memória
                    </Text>
                </View>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Ionicons name="book" size={20} color="#fff" />
                        <Text style={styles.statText}>{diaries.length} registros</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="calendar" size={20} color="#fff" />
                        <Text style={styles.statText}>
                            {todayDiary ? "Hoje registrado" : "Registre hoje"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Card de Hoje em Destaque */}
            {todayDiary && (
                <TouchableOpacity 
                    style={styles.todayHighlightCard}
                    onPress={handleEditTodayDiary}
                    activeOpacity={0.9}
                >
                    <View style={styles.todayCardHeader}>
                        <View style={styles.todayBadge}>
                            <Ionicons name="sparkles" size={16} color="#FFD700" />
                            <Text style={styles.todayBadgeText}>HOJE</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.editTodayButton}
                            onPress={handleEditTodayDiary}
                        >
                            <Ionicons name="pencil" size={20} color="#17285D" />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.todayPreview} numberOfLines={3}>
                        {todayDiary.conteudo}
                    </Text>
                    
                    <View style={styles.todayFooter}>
                        <View style={styles.moodContainer}>
                            <Text style={styles.moodEmoji}>
                                {getDiaryMood(todayDiary.conteudo)}
                            </Text>
                            <Text style={styles.moodText}>Seu humor</Text>
                        </View>
                        <Text style={styles.todayTime}>
                            {new Date(todayDiary.data_registro).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Lista de Diários Anteriores */}
            <ScrollView 
                style={styles.diaryList} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={diaries.length === 0 ? styles.emptyContainer : null}
            >
                {diaries.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="book-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyTitle}>Nenhum registro ainda</Text>
                        <Text style={styles.emptyText}>
                            Comece escrevendo sobre seu dia para fortalecer sua memória
                        </Text>
                    </View>
                ) : (
                    diaries.filter(d => !isTodayDiary(d)).map((d) => {
                        const isExpanded = expandedDiaries[d.id];
                        const mood = getDiaryMood(d.conteudo);
                        const moodColor = getMoodColor(mood);
                        
                        return (
                            <TouchableOpacity 
                                key={d.id} 
                                style={styles.diaryCard}
                                onPress={() => toggleExpand(d.id)}
                                activeOpacity={0.9}
                            >
                                <View style={styles.diaryCardHeader}>
                                    <View style={styles.dateContainer}>
                                        <Text style={styles.diaryDate}>
                                            {formatDiaryDate(d.data_registro)}
                                        </Text>
                                        <View style={[styles.moodIndicator, { backgroundColor: moodColor }]} />
                                    </View>
                                    <Text style={styles.moodEmojiCard}>{mood}</Text>
                                </View>
                                
                                <Text
                                    style={styles.diaryContent}
                                    numberOfLines={isExpanded ? undefined : 3}
                                >
                                    {d.conteudo}
                                </Text>
                                
                                {!isExpanded && d.conteudo.length > 150 && (
                                    <Text style={styles.readMore}>Toque para ler mais...</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>

            {/* FAB Moderno - só aparece se NÃO houver diário de hoje */}
            {!todayDiary && (
                <TouchableOpacity 
                    style={styles.fab} 
                    onPress={handleOpenModal}
                    activeOpacity={0.8}
                >
                    <Ionicons name="pencil" size={24} color="#FFF" />
                </TouchableOpacity>
            )}

            {/* Modal Modernizado */}
            <Modal 
                visible={modalVisible} 
                animationType="slide" 
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {todayDiary ? "Refletindo sobre hoje" : "Como foi seu dia?"}
                            </Text>
                            <TouchableOpacity 
                                style={styles.modalClose}
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.modalSubtitle}>
                            {todayDiary 
                                ? "Atualize suas memórias e sentimentos do dia"
                                : "Escreva sobre suas experiências, sentimentos e memórias do dia"
                            }
                        </Text>

                        <TextInput
                            style={styles.textArea}
                            multiline
                            placeholder="Descreva seu dia, sentimentos, conquistas, desafios... Cada detalhe ajuda a fortalecer sua memória."
                            placeholderTextColor="#999"
                            value={conteudo}
                            onChangeText={setConteudo}
                            autoFocus={true}
                            textAlignVertical="top"
                        />
                        
                        <View style={styles.charCount}>
                            <Text style={styles.charCountText}>
                                {conteudo.length} caracteres
                            </Text>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.saveButton,
                                    conteudo.length === 0 && styles.saveButtonDisabled
                                ]} 
                                onPress={saveTodayDiary}
                                disabled={conteudo.length === 0}
                            >
                                <Ionicons name="checkmark" size={20} color="#FFF" />
                                <Text style={styles.saveButtonText}>
                                    {todayDiary ? "Atualizar" : "Salvar Memória"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Animated.View>
    );
}