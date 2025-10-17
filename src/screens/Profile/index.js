import React, { useEffect, useMemo, useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Image, 
    ScrollView, 
    Modal,
    Animated 
} from "react-native";
import { styles } from "./styles";
import {
    getSessionUser,
    getUserProfile,
    updateUserPhoto,
    resolveAvatarUrl,
} from "../../services/userService";
import { handleLogout } from "../../hooks/HandleLogout";
import { useNavigation } from "@react-navigation/native";
import { getOfensiva } from "../../services/ofensivaService";
import PasswordManager from "../../components/PasswordManager";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
    const navigation = useNavigation();

    const [authUser, setAuthUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [ofensiva, setOfensiva] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        memoria: true,
        ofensiva: false,
        informacoes: false
    });

    const fadeAnim = useMemo(() => new Animated.Value(0), []);
    const scaleAnim = useMemo(() => new Animated.Value(0.9), []);

    const AVATAR_OPTIONS = [
        "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/1.png",
        "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/2.png",
        "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/3.png",
        "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/4.png",
    ];

    const avatarChoices = useMemo(
        () => AVATAR_OPTIONS.map((url) => ({
            path: url,   
            url,         
        })),
        []
    );

    useEffect(() => {
        (async () => {
            try {
                const user = await getSessionUser();
                setAuthUser(user);

                if (user?.id) {
                    const p = await getUserProfile(user.id);
                    setProfile(p || null);
                    
                    const ofensivaData = await getOfensiva(user.id);
                    setOfensiva(ofensivaData);
                }
            } catch (e) {
                console.error("Erro ao carregar perfil:", e);
            } finally {
                setLoading(false);
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
            }
        })();
    }, []);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const avatarUrl = useMemo(() => {
        const foto = profile?.foto || AVATAR_OPTIONS[0];
        return resolveAvatarUrl(foto);
    }, [profile]);

    const handleChooseAvatar = async (choice) => {
        if (!authUser?.id) return;
        try {
            const updated = await updateUserPhoto(authUser.id, choice.path);
            setProfile(updated);
            setAvatarModalVisible(false);
        } catch (e) {
            console.error("Erro ao atualizar avatar:", e);
        }
    };

    const nivel_memoria = profile?.nivel_memoria ?? 0;
    const genero = profile?.genero ?? "—";
    const deficit = profile?.deficit ?? "—";
    const criado_em = profile?.criado_em
        ? new Date(profile.criado_em).toLocaleDateString("pt-BR")
        : "—";
    const telefone = profile?.telefone ?? "—";
    const data_nascimento = profile?.data_nascimento
        ? new Date(profile.data_nascimento).toLocaleDateString("pt-BR")
        : "—";

    const getNivel = (valorNivelMemoria) => {
        if (valorNivelMemoria < 300) return "Iniciante 🌱";
        if (valorNivelMemoria < 800) return "Intermediário 🚀";
        if (valorNivelMemoria < 1200) return "Avançado 💪";
        return "Mestre da Memória 🧠";
    };

    const getNivelProgress = () => {
        if (nivel_memoria < 300) return (nivel_memoria / 300) * 100;
        if (nivel_memoria < 800) return ((nivel_memoria - 300) / 500) * 100;
        if (nivel_memoria < 1200) return ((nivel_memoria - 800) / 400) * 100;
        return 100;
    };

    const getNextLevelXP = () => {
        if (nivel_memoria < 300) return 300;
        if (nivel_memoria < 800) return 800;
        if (nivel_memoria < 1200) return 1200;
        return "Máximo";
    };

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <Animated.ScrollView 
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            {/* Header com Avatar */}
            <View style={styles.header}>
                <View style={styles.avatarWrapper}>
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    <TouchableOpacity 
                        style={styles.editAvatarButton}
                        onPress={() => setAvatarModalVisible(true)}
                    >
                        <Ionicons name="pencil" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.nome}>{profile?.nome || authUser?.user_metadata?.name || "Usuário"}</Text>
                <Text style={styles.email}>{authUser?.email}</Text>
                <View style={styles.memberSince}>
                    <Ionicons name="calendar" size={14} color="#666" />
                    <Text style={styles.memberSinceText}>Membro desde {criado_em}</Text>
                </View>
            </View>
            
            {/* Status de Memória - Destaque */}
            <TouchableOpacity 
                style={[styles.section, styles.memorySection]}
                onPress={() => toggleSection('memoria')}
                activeOpacity={0.9}
            >
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="analytics" size={20} color="#17285D" />
                        <Text style={styles.sectionTitle}>Status da Memória</Text>
                    </View>
                    <Ionicons 
                        name={expandedSections.memoria ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#666" 
                    />
                </View>

                {expandedSections.memoria && (
                    <View style={styles.memoryContent}>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>{getNivel(nivel_memoria)}</Text>
                        </View>
                        
                        <View style={styles.xpContainer}>
                            <Text style={styles.xpText}>{nivel_memoria} XP</Text>
                            <Text style={styles.nextLevelText}>
                                Próximo nível: {getNextLevelXP()} XP
                            </Text>
                        </View>

                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill,
                                    { width: `${getNivelProgress()}%` }
                                ]} 
                            />
                        </View>
                    </View>
                )}
            </TouchableOpacity>

            {/* Ofensiva de Jogos - Interativa */}
            <TouchableOpacity 
                style={[styles.section, styles.streakSection]}
                onPress={() => toggleSection('ofensiva')}
                activeOpacity={0.9}
            >
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="flame" size={20} color="#FF6B6B" />
                        <Text style={[styles.sectionTitle, styles.streakTitle]}>Ofensiva de Jogos</Text>
                    </View>
                    <Ionicons 
                        name={expandedSections.ofensiva ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#666" 
                    />
                </View>

                <View style={styles.streakPreview}>
                    <Text style={styles.streakCount}>
                        {ofensiva?.dias_consecutivos || 0} dias 🔥
                    </Text>
                    <Text style={styles.streakSubtitle}>Sequência atual</Text>
                </View>

                {expandedSections.ofensiva && ofensiva && (
                    <View style={styles.streakDetails}>
                        <View style={styles.streakDetailItem}>
                            <Ionicons name="calendar-outline" size={16} color="#666" />
                            <Text style={styles.streakDetailText}>
                                Última atividade: {new Date(ofensiva.ultimo_registro).toLocaleDateString('pt-BR')}
                            </Text>
                        </View>
                        <View style={styles.streakDetailItem}>
                            <Ionicons name="trophy-outline" size={16} color="#666" />
                            <Text style={styles.streakDetailText}>
                                Recorde: {ofensiva.dias_consecutivos} dias
                            </Text>
                        </View>
                        <View style={styles.motivationText}>
                            <Text style={styles.motivation}>
                                {ofensiva.dias_consecutivos >= 7 ? 
                                    "Incrível! Você está no caminho certo! 🎉" :
                                    "Continue assim! Cada dia fortalece sua mente! 💪"
                                }
                            </Text>
                        </View>
                    </View>
                )}

                {expandedSections.ofensiva && !ofensiva && (
                    <View style={styles.streakDetails}>
                        <Text style={styles.placeholder}>
                            Inicie sua jornada hoje! Cada dia de exercícios fortalece sua memória. 🎯
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Minha Identidade - Informações Pessoais */}
            <TouchableOpacity 
                style={[styles.section, styles.identitySection]}
                onPress={() => toggleSection('informacoes')}
                activeOpacity={0.9}
            >
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="person-circle" size={20} color="#17285D" />
                        <Text style={styles.sectionTitle}>Minha Identidade</Text>
                    </View>
                    <Ionicons 
                        name={expandedSections.informacoes ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#666" 
                    />
                </View>

                {expandedSections.informacoes && (
                    <View style={styles.identityContent}>
                        <View style={styles.identityRow}>
                            <View style={styles.identityItem}>
                                <Ionicons name="male-female" size={16} color="#666" />
                                <Text style={styles.identityLabel}>Gênero</Text>
                                <Text style={styles.identityValue}>{genero}</Text>
                            </View>
                            <View style={styles.identityItem}>
                                <Ionicons name="calendar" size={16} color="#666" />
                                <Text style={styles.identityLabel}>Nascimento</Text>
                                <Text style={styles.identityValue}>{data_nascimento}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.identityRow}>
                            <View style={styles.identityItem}>
                                <Ionicons name="call" size={16} color="#666" />
                                <Text style={styles.identityLabel}>Telefone</Text>
                                <Text style={styles.identityValue}>{telefone}</Text>
                            </View>
                            <View style={styles.identityItem}>
                                <Ionicons name="medical" size={16} color="#666" />
                                <Text style={styles.identityLabel}>Déficit</Text>
                                <Text style={styles.identityValue}>{deficit}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </TouchableOpacity>

            {/* SenhaAtiva */}
            <View style={[styles.section, styles.passwordSection]}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="lock-closed" size={20} color="#17285D" />
                        <Text style={styles.sectionTitle}>SenhaAtiva</Text>
                    </View>
                    <Text style={styles.securityBadge}>🔒 Local</Text>
                </View>
                <PasswordManager />
            </View>

            {/* Ações */}
            <View style={styles.actions}>
                <TouchableOpacity 
                    style={[styles.button, styles.logoutButton]}
                    onPress={() => handleLogout(navigation)}
                >
                    <Ionicons name="log-out" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Sair da Conta</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de seleção de avatar */}
            <Modal visible={avatarModalVisible} animationType="fade" transparent>
                <View style={styles.avatarsModalOverlay}>
                    <View style={styles.avatarsModal}>
                        <Text style={styles.modalTitle}>Escolha seu avatar</Text>
                        <Text style={styles.modalSubtitle}>Como você quer ser visto?</Text>
                        
                        <View style={styles.avatarsGrid}>
                            {avatarChoices.map((opt) => (
                                <TouchableOpacity
                                    key={opt.path}
                                    style={styles.avatarOption}
                                    onPress={() => handleChooseAvatar(opt)}
                                >
                                    <Image
                                        source={{ uri: opt.url }}
                                        style={styles.avatarOptionImage}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={() => setAvatarModalVisible(false)}
                            style={styles.closeModalButton}
                        >
                            <Text style={styles.closeModalText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Animated.ScrollView>
    );
}