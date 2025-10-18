import React, { useEffect, useState, useRef } from "react";
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    ImageBackground, 
    Animated,
    Dimensions,
    StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSessionUser, getUserProfile } from "../../services/userService";
import { getGames } from "../../services/gameService";
import { getGuides } from "../../services/guideService";
import { atualizarOfensiva, getOfensiva } from "../../services/ofensivaService";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [dailyGuide, setDailyGuide] = useState(null);
    const [greeting, setGreeting] = useState("");
    const [ofensiva, setOfensiva] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(30));

    useEffect(() => {
        (async () => {
            const authUser = await getSessionUser();
            const profile = authUser?.id ? await getUserProfile(authUser.id) : null;
            setUser(profile);
            setGreeting(getGreeting());

            if (authUser?.id) {
                await atualizarEBuscarOfensiva(authUser.id);
            }

            const allGames = await getGames();
            const allGuides = await getGuides();

            if (allGames.length > 0) {
                const shuffled = [...allGames].sort(() => 0.5 - Math.random());
                setGames(shuffled.slice(0, 3));
            }

            if (allGuides.length > 0) {
                setDailyGuide(allGuides[Math.floor(Math.random() * allGuides.length)]);
            }

            // Animação de entrada
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
        })();
    }, []);

    const atualizarEBuscarOfensiva = async (userId) => {
        try {
            const resultado = await atualizarOfensiva(userId);
            const ofensivaData = await getOfensiva(userId);
            setOfensiva(ofensivaData);
        } catch (error) {
            console.error('Erro na ofensiva:', error);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia ☀️";
        if (hour < 18) return "Boa tarde 🌤️";
        return "Boa noite 🌙";
    };

    // Gerar semana visual simplificada
    const gerarSemanaOfensiva = () => {
        const dias = ["S", "T", "Q", "Q", "S", "S", "D"];
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        
        return dias.map((dia, index) => {
            const diasAtras = (index >= diaSemana - 1) 
                ? index - (diaSemana - 1)
                : 7 - (diaSemana - 1) + index;
            
            const dataDia = new Date(hoje);
            dataDia.setDate(hoje.getDate() - diasAtras);
            
            const dataFormatada = dataDia.toISOString().split('T')[0];
            const isAtivo = ofensiva?.ultimo_registro && 
                new Date(ofensiva.ultimo_registro).toISOString().split('T')[0] >= dataFormatada;
            
            const isHoje = diasAtras === 0;

            return {
                dia,
                ativo: isAtivo,
                hoje: isHoje
            };
        });
    };

    const weekDays = gerarSemanaOfensiva();

    // Funções de navegação
    const goToGameIntro = (jogo) => navigation.navigate("GameIntro", { jogo });
    const goToGuideDetail = (guia) => navigation.navigate("GuideDetail", { guia });
    const goToDiary = () => navigation.navigate("Diário");
    const goToAlarm = () => navigation.navigate("Alarmes");
    const goToGames = () => navigation.navigate("Jogos");
    const goToGuides = () => navigation.navigate("Guia");

    // Cards de ação rápida
    const quickActions = [
        {
            icon: "game-controller",
            title: "Jogos",
            subtitle: "Treine sua mente",
            color: "#667eea",
            onPress: goToGames
        },
        {
            icon: "book",
            title: "Diário",
            subtitle: "Registre memórias",
            color: "#4facfe",
            onPress: goToDiary
        },
        {
            icon: "alarm",
            title: "Alarmes",
            subtitle: "Lembretes",
            color: "#43e97b",
            onPress: goToAlarm
        },
        {
            icon: "school",
            title: "Guias",
            subtitle: "Aprenda mais",
            color: "#fa709a",
            onPress: goToGuides
        }
    ];

    return (
        <Animated.ScrollView 
            style={[styles.container, { opacity: fadeAnim }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Imersivo */}
            <View style={styles.header}>
                
                
                <View style={styles.userGreeting}>
                    <Text style={styles.greeting}>{greeting}</Text>
                    <Text style={styles.username}>{user?.nome || "Usuário"}!</Text>
                </View>

                {/* Status de Ofensiva */}
            </View>

            {/* Progresso Semanal Simplificado */}
            <Animated.View 
                style={[
                    styles.weekSection,
                    { transform: [{ translateY: slideAnim }] }
                ]}
            >
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>📅 Sua Semana</Text>
                    <Text style={styles.sectionSubtitle}>Mantenha o ritmo!</Text>
                </View>
                
                <View style={styles.weekProgress}>
                    {weekDays.map((day, i) => (
                        <View key={i} style={styles.dayContainer}>
                            <View style={[
                                styles.dayCircle,
                                day.ativo && styles.activeDayCircle,
                                day.hoje && styles.todayCircle
                            ]}>
                                <Text style={[
                                    styles.dayText,
                                    day.ativo && styles.activeDayText
                                ]}>
                                    {day.dia}
                                </Text>
                            </View>
                            {day.hoje && <View style={styles.todayIndicator} />}
                        </View>
                    ))}
                </View>
            </Animated.View>

            {/* Ações Rápidas */}
            <View style={styles.quickActionsSection}>
                <Text style={styles.sectionTitle}>⚡ Ações Rápidas</Text>
                <View style={styles.quickActionsGrid}>
                    {quickActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.quickActionCard}
                            onPress={action.onPress}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                                <Ionicons name={action.icon} size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionTitle}>{action.title}</Text>
                            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Jogos Recomendados */}
            {games.length > 0 && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🎮 Recomendados para Você</Text>
                        <TouchableOpacity onPress={goToGames}>
                            <Text style={styles.seeMore}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.gamesScroll}
                    >
                        {games.map((game) => (
                            <TouchableOpacity 
                                key={game.id} 
                                style={styles.gameCard}
                                onPress={() => goToGameIntro(game)}
                                activeOpacity={0.9}
                            >
                                <ImageBackground
                                    source={{ uri: game.img_url }}
                                    style={styles.gameImage}
                                    imageStyle={styles.gameImageStyle}
                                >
                                    <View style={styles.gameOverlay} />
                                    <View style={styles.gameContent}>
                                        <View style={styles.gameBadge}>
                                            <Text style={styles.gameBadgeText}>
                                                {game.nivel_dificuldade || 'Normal'}
                                            </Text>
                                        </View>
                                        <Text style={styles.gameName} numberOfLines={2}>
                                            {game.nome}
                                        </Text>
                                        <View style={styles.playButton}>
                                            <Ionicons name="play" size={16} color="#fff" />
                                            <Text style={styles.playText}>Jogar</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Guia do Dia */}
            {dailyGuide && (
                <TouchableOpacity 
                    style={styles.guideCard}
                    onPress={() => goToGuideDetail(dailyGuide)}
                    activeOpacity={0.9}
                >
                    <ImageBackground
                        source={{ uri: dailyGuide.img_url }}
                        style={styles.guideImage}
                        imageStyle={styles.guideImageStyle}
                    >
                        <View style={styles.guideOverlay} />
                        <View style={styles.guideContent}>
                            <View style={styles.guideBadge}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.guideBadgeText}>Guia do Dia</Text>
                            </View>
                            <Text style={styles.guideCategory}>{dailyGuide.categoria}</Text>
                            <Text style={styles.guideTitle} numberOfLines={2}>
                                {dailyGuide.titulo}
                            </Text>
                            <View style={styles.guideFooter}>
                                <View style={styles.guideAuthor}>
                                    <Ionicons name="person" size={14} color="rgba(255,255,255,0.8)" />
                                    <Text style={styles.guideAuthorText}>{dailyGuide.autor}</Text>
                                </View>
                                <Text style={styles.readTime}>5 min</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            )}

            {/* Diário do Dia */}
            <TouchableOpacity 
                style={styles.diaryCard}
                onPress={goToDiary}
                activeOpacity={0.8}
            >
                <View style={styles.diaryContent}>
                    <View style={styles.diaryIcon}>
                        <Ionicons name="book" size={28} color="#17285D" />
                    </View>
                    <View style={styles.diaryText}>
                        <Text style={styles.diaryTitle}>Diário de Memórias</Text>
                        <Text style={styles.diarySubtitle}>
                            Registre suas experiências e fortaleça sua memória
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#17285D" />
                </View>
            </TouchableOpacity>

            {/* Dica do Dia */}
            <View style={styles.tipCard}>
                <Ionicons name="bulb" size={24} color="#FFD700" />
                <Text style={styles.tipText}>
                    "Pratique 15 minutos de exercícios mentais por dia para manter sua memória afiada!"
                </Text>
            </View>
        </Animated.ScrollView>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        alignItems: "center",
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        textAlign: "center",
        marginBottom: 8,
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    headerSubtitle: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "#17285D",
        textAlign: "center",
    },
    userGreeting: {
        alignItems: "center",
        marginBottom: 20,
    },
    greeting: {
        fontSize: 18,
        fontFamily: "Poppins_400Regular",
        color: "#17285D",
        marginBottom: 4,
    },
    username: {
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#17285D",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 3,
        marginBottom: -15,
    },
    statText: {
        fontSize: 14,
        fontFamily: "Poppins_700Bold",
        color: "#fff",
        marginLeft: 6,
    },
    weekSection: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginTop: 30,
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginTop: 5,
    },
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "#666",
    },
    weekProgress: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dayContainer: {
        alignItems: "center",
    },
    dayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
    },
    activeDayCircle: {
        backgroundColor: "#17285D",
    },
    todayCircle: {
        borderWidth: 2,
        borderColor: "#FF6B6B",
    },
    dayText: {
        fontSize: 12,
        fontFamily: "Poppins_700Bold",
        color: "#666",
    },
    activeDayText: {
        color: "#fff",
    },
    todayIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#FF6B6B",
    },
    quickActionsSection: {
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 20,
    },
    quickActionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 12,
    },
    quickActionCard: {
        width: "48%",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    actionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 16,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 4,
        textAlign: "center",
    },
    actionSubtitle: {
        fontSize: 12,
        fontFamily: "Poppins_400Regular",
        color: "#666",
        textAlign: "center",
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    seeMore: {
        fontSize: 14,
        fontFamily: "Poppins_600SemiBold",
        color: "#667eea",
    },
    gamesScroll: {
        paddingRight: 20,
    },
    gameCard: {
        width: 160,
        height: 140,
        borderRadius: 16,
        overflow: "hidden",
        marginRight: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    gameImage: {
        flex: 1,
        justifyContent: "space-between",
    },
    gameImageStyle: {
        borderRadius: 16,
    },
    gameOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
        borderRadius: 16,
    },
    gameContent: {
        flex: 1,
        padding: 12,
        justifyContent: "space-between",
    },
    gameBadge: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    gameBadgeText: {
        fontSize: 10,
        fontFamily: "Poppins_700Bold",
        color: "#fff",
        textTransform: "uppercase",
    },
    gameName: {
        fontSize: 14,
        fontFamily: "Poppins_700Bold",
        color: "#fff",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    playButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    playText: {
        fontSize: 12,
        fontFamily: "Poppins_700Bold",
        color: "#fff",
        marginLeft: 4,
    },
    guideCard: {
        height: 200,
        borderRadius: 20,
        overflow: "hidden",
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    guideImage: {
        flex: 1,
        justifyContent: "space-between",
    },
    guideImageStyle: {
        borderRadius: 20,
    },
    guideOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
        borderRadius: 20,
    },
    guideContent: {
        flex: 1,
        padding: 16,
        justifyContent: "space-between",
    },
    guideBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    guideBadgeText: {
        fontSize: 12,
        fontFamily: "Poppins_600SemiBold",
        color: "#fff",
        marginLeft: 4,
    },
    guideCategory: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "rgba(255,255,255,0.9)",
        marginBottom: 4,
    },
    guideTitle: {
        fontSize: 18,
        fontFamily: "Poppins_700Bold",
        color: "#fff",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    guideFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    guideAuthor: {
        flexDirection: "row",
        alignItems: "center",
    },
    guideAuthorText: {
        fontSize: 12,
        fontFamily: "Poppins_400Regular",
        color: "rgba(255,255,255,0.8)",
        marginLeft: 4,
    },
    readTime: {
        fontSize: 12,
        fontFamily: "Poppins_400Regular",
        color: "rgba(255,255,255,0.8)",
    },
    diaryCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderLeftWidth: 4,
        borderLeftColor: "#4facfe",
    },
    diaryContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    diaryIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#F0F8FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    diaryText: {
        flex: 1,
    },
    diaryTitle: {
        fontSize: 18,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 4,
    },
    diarySubtitle: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "#666",
        lineHeight: 18,
    },
    tipCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF9E6",
        marginHorizontal: 20,
        marginBottom: 30,
        padding: 16,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#FFD700",
    },
    tipText: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "#5D4037",
        marginLeft: 8,
        flex: 1,
        fontStyle: "italic",
    },
};
