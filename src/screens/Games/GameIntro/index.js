import React, { useRef, useEffect } from "react";
import { 
    View, 
    Text, 
    ImageBackground, 
    TouchableOpacity, 
    ScrollView, 
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function GameIntro({ navigation, route }) {
    const { jogo } = route.params;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const getDifficultyColor = (dificuldade) => {
        switch (dificuldade?.toLowerCase()) {
            case 'facil': return '#27AE60';
            case 'medio': return '#F39C12';
            case 'dificil': return '#E74C3C';
            default: return '#4A6FA5';
        }
    };

    const getDifficultyIcon = (dificuldade) => {
        switch (dificuldade?.toLowerCase()) {
            case 'facil': return '🌱';
            case 'medio': return '🚀';
            case 'dificil': return '💪';
            default: return '🎮';
        }
    };

    const handleStartGame = () => {
        const gameRoutes = {
            "Jogo da memória": "MemoryPairs",
            "Sequência Atencional": "SequenceMemory",
            "Quebra-Código": "QuebraCodigo",
            "Palavras Fugitivas": "PalavrasFugidias",
            "Efeito Stroop": "Stroop",
            "Quiz do Diário": "DiaryQuiz"
        };

        const routeName = gameRoutes[jogo.nome] || "GamePlaceholder";
        navigation.navigate(routeName);
    };

    // =========================================================================
    // PERSONALIZAÇÃO INDIVIDUAL PARA CADA JOGO
    // =========================================================================

    const getGameSpecificContent = () => {
        switch (jogo.nome) {
            case "Jogo da memória":
                return {
                    duration: "3-5 minutos",
                    objective: "Memória visual e concentração",
                    tip: "Tente encontrar os pares o mais rápido possível para melhorar seu tempo de reação.",
                    customSection: null
                };
            
            case "Sequência Atencional":
                return {
                    duration: "4-6 minutos", 
                    objective: "Foco e memória sequencial",
                    tip: "Preste atenção na ordem exata dos elementos apresentados.",
                    customSection: null
                };
            
            case "Quebra-Código":
                return {
                    duration: "5-7 minutos",
                    objective: "Raciocínio lógico e padrões",
                    tip: "Identifique o padrão por trás da sequência para decifrar o código.",
                    customSection: null
                };
            
            case "Palavras Fugitivas":
                return {
                    duration: "2-4 minutos",
                    objective: "Memória verbal e atenção",
                    tip: "Foque nas palavras que aparecem rapidamente na tela.",
                    customSection: null
                };
            
            case "Efeito Stroop":
                return {
                    duration: "3-5 minutos",
                    objective: "Controle inibitório e atenção",
                    tip: "Ignore a palavra e foque apenas na cor da fonte.",
                    customSection: null
                };
            
            case "Quiz do Diário":
                return {
                    duration: "5-8 minutos",
                    objective: "Memória episódica e reflexão",
                    tip: "Revise suas anotações do diário antes de começar.",
                    customSection: null
                };
            
            default:
                return {
                    duration: "2-5 minutos",
                    objective: "Melhorar habilidades cognitivas", 
                    tip: "Mantenha o foco e tente melhorar seu desempenho a cada tentativa.",
                    customSection: null
                };
        }
    };

    const getGameBenefits = () => {
        const benefits = {
            "Jogo da memória": ["Memória visual", "Concentração", "Raciocínio espacial"],
            "Sequência Atencional": ["Foco sustentado", "Memória de trabalho", "Velocidade de processamento"],
            "Quebra-Código": ["Pensamento lógico", "Padrões mentais", "Raciocínio abstrato"],
            "Palavras Fugitivas": ["Memória verbal", "Atenção seletiva", "Processamento rápido"],
            "Efeito Stroop": ["Controle inibitório", "Flexibilidade cognitiva", "Atenção dividida"],
            "Quiz do Diário": ["Memória episódica", "Recordação pessoal", "Reflexão consciente"]
        };
        return benefits[jogo.nome] || ["Memória", "Foco", "Raciocínio"];
    };

    const gameContent = getGameSpecificContent();

    // =========================================================================
    // FIM DA PERSONALIZAÇÃO
    // =========================================================================

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            
            {/* Header com imagem */}
            <Animated.View 
                style={[
                    styles.header,
                    { 
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }] 
                    }
                ]}
            >
                <ImageBackground
                    source={{ uri: jogo.img_url }}
                    style={styles.headerImage}
                    resizeMode="cover"
                >
                    {/* Overlay escuro em vez de gradiente */}
                    <View style={styles.darkOverlay} />
                    <View style={styles.headerContent}>
                        <View style={styles.difficultyContainer}>
                            <View style={[
                                styles.difficultyBadge,
                                { backgroundColor: getDifficultyColor(jogo.nivel_dificuldade) }
                            ]}>
                                <Text style={styles.difficultyIcon}>
                                    {getDifficultyIcon(jogo.nivel_dificuldade)}
                                </Text>
                                <Text style={styles.difficultyText}>
                                    {jogo.nivel_dificuldade || 'Normal'}
                                </Text>
                            </View>
                        </View>
                        
                        <Text style={styles.gameTitle}>{jogo.nome}</Text>
                        <Text style={styles.gameCategory}>{jogo.categoria}</Text>
                    </View>
                </ImageBackground>
            </Animated.View>

            {/* Conteúdo principal com ScrollView */}
            <View style={styles.contentWrapper}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View 
                        style={[
                            styles.contentInner,
                            { 
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }] 
                            }
                        ]}
                    >
                        {/* Descrição */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="information-circle" size={24} color="#17285D" />
                                <Text style={styles.sectionTitle}>SOBRE O DESAFIO</Text>
                            </View>
                            <Text style={styles.description}>
                                {jogo.descricao || "Desafie suas habilidades cognitivas e fortaleça sua mente neste exercício mental."}
                            </Text>
                        </View>

                        {/* Dica Específica do Jogo */}
                        <View style={styles.tipCard}>
                            <Ionicons name="bulb-outline" size={24} color="#F39C12" />
                            <View style={styles.tipContent}>
                                <Text style={styles.tipTitle}>DICA PARA ESTE JOGO</Text>
                                <Text style={styles.tipText}>{gameContent.tip}</Text>
                            </View>
                        </View>

                        {/* Benefícios */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="flash" size={24} color="#17285D" />
                                <Text style={styles.sectionTitle}>HABILIDADES TRABALHADAS</Text>
                            </View>
                            <View style={styles.benefitsGrid}>
                                {getGameBenefits().map((benefit, index) => (
                                    <View key={index} style={styles.benefitItem}>
                                        <Ionicons name="checkmark-circle" size={16} color="#27AE60" />
                                        <Text style={styles.benefitText}>{benefit}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* ========================================================================= */}
                        {/* SEÇÃO PARA CONTEÚDO PERSONALIZADO ADICIONAL */}
                        {/* ========================================================================= */}
                        {gameContent.customSection && (
                            <View style={styles.section}>
                                {gameContent.customSection}
                            </View>
                        )}
                        {/* ========================================================================= */}

                        {/* Informações */}
                        <View style={styles.infoCard}>
                            <View style={styles.infoItem}>
                                <Ionicons name="time-outline" size={20} color="#4A6FA5" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Duração</Text>
                                    <Text style={styles.infoValue}>{gameContent.duration}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.infoSeparator} />
                            
                            <View style={styles.infoItem}>
                                <Ionicons name="analytics-outline" size={20} color="#4A6FA5" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Intensidade</Text>
                                    <Text style={styles.infoValue}>{jogo.nivel_dificuldade}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.infoSeparator} />
                            
                            <View style={styles.infoItem}>
                                <Ionicons name="trophy-outline" size={20} color="#4A6FA5" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Objetivo</Text>
                                    <Text style={styles.infoValue}>{gameContent.objective}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Espaço extra no final para garantir que o conteúdo não fique escondido */}
                        <View style={styles.bottomSpacer} />
                    </Animated.View>
                </ScrollView>
            </View>

            {/* Footer com botões - AGORA DENTRO DO CONTAINER PRINCIPAL */}
            <Animated.View 
                style={[
                    styles.footer,
                    { 
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }] 
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleStartGame}
                    activeOpacity={0.8}
                >
                    <View style={styles.buttonContent}>
                        <Ionicons name="play" size={20} color="#FFFFFF" />
                        <Text style={styles.primaryButtonText}>Iniciar Treino Mental</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <View style={styles.buttonContent}>
                        <Ionicons name="arrow-back" size={20} color="#4A6FA5" />
                        <Text style={styles.secondaryButtonText}>Voltar aos Jogos</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
    },
    header: {
        height: height * 0.4,
    },
    headerImage: {
        flex: 1,
        width: '100%',
    },
    darkOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(23,40,93,0.7)",
    },
    headerContent: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 24,
    },
    difficultyContainer: {
        marginBottom: 16,
    },
    difficultyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#27AE60',
        alignSelf: 'flex-start',
    },
    difficultyIcon: {
        fontSize: 12,
        marginRight: 6,
    },
    difficultyText: {
        fontSize: 12,
        fontFamily: "Poppins_700Bold",
        color: "#FFFFFF",
        textTransform: 'uppercase',
    },
    gameTitle: {
        fontSize: 32,
        fontFamily: "Poppins_700Bold",
        color: "#FFFFFF",
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    gameCategory: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "rgba(255,255,255,0.9)",
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // CORREÇÃO DO SCROLLVIEW
    contentWrapper: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    contentInner: {
        padding: 24,
        paddingBottom: 20,
    },
    bottomSpacer: {
        height: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginLeft: 8,
        letterSpacing: 1,
    },
    description: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "#4A6FA5",
        lineHeight: 24,
        textAlign: 'justify',
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: "rgba(243, 156, 18, 0.1)",
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#F39C12",
        marginBottom: 24,
    },
    tipContent: {
        flex: 1,
        marginLeft: 12,
    },
    tipTitle: {
        fontSize: 14,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tipText: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "#4A6FA5",
        lineHeight: 20,
    },
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#E8EEF4",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        margin: 6,
        borderWidth: 1,
        borderColor: "#D8E2EC",
    },
    benefitText: {
        fontSize: 14,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
        marginLeft: 6,
    },
    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#E8EEF4",
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoContent: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontFamily: "Poppins_600SemiBold",
        color: "#4A6FA5",
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoValue: {
        fontSize: 16,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginTop: 2,
    },
    infoSeparator: {
        height: 1,
        backgroundColor: "#E8EEF4",
        marginVertical: 8,
    },
    footer: {
        backgroundColor: "#F0F4F8",
        padding: 24,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: "#E8EEF4",
    },
    primaryButton: {
        backgroundColor: "#4A6FA5",
        borderRadius: 25,
        marginBottom: 12,
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
    },
    primaryButtonText: {
        fontSize: 18,
        fontFamily: "Poppins_700Bold",
        color: "#FFFFFF",
        marginLeft: 8,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "transparent",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "#4A6FA5",
    },
    secondaryButtonText: {
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        color: "#4A6FA5",
        marginLeft: 8,
    },
});