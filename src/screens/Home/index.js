import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSessionUser, getUserProfile } from "../../services/userService";
import { getGames } from "../../services/gameService";
import { getGuides } from "../../services/guideService";
import { atualizarOfensiva, getOfensiva } from "../../services/ofensivaService";

export default function Home({ navigation }) {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [dailyGuide, setDailyGuide] = useState(null);
    const [greeting, setGreeting] = useState("");
    const [ofensiva, setOfensiva] = useState(null);

    useEffect(() => {
        (async () => {
            const authUser = await getSessionUser();
            const profile = authUser?.id ? await getUserProfile(authUser.id) : null;
            setUser(profile);
            setGreeting(getGreeting());

            // Atualizar ofensiva ao abrir o app
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
        })();
    }, []);

    const atualizarEBuscarOfensiva = async (userId) => {
        try {
            const resultado = await atualizarOfensiva(userId);
            const ofensivaData = await getOfensiva(userId);
            setOfensiva(ofensivaData);
            
            if (resultado?.novo_registro) {
                console.log(resultado.mensagem);
            }
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

    // Gerar semana visual da ofensiva
    const gerarSemanaOfensiva = () => {
        const dias = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
        const hoje = new Date();
        const diaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda...
        
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
    const goToAlarm = () => navigation.navigate("Alarme");

    return (
        <View style={styles.container}>
            {/* Registro de ofensiva */}
            <View style={styles.weekRow}>
                {weekDays.map((day, i) => (
                    <View key={i} style={[
                        styles.dayCircle,
                        day.hoje && styles.hojeCircle,
                        day.ativo && styles.activeDayCircle
                    ]}>
                        <Text style={[
                            styles.dayText,
                            day.hoje && styles.hojeText,
                            day.ativo && styles.activeDayText
                        ]}>
                            {day.dia}
                        </Text>
                    </View>
                ))}
                <TouchableOpacity style={styles.agendaButton} onPress={goToAlarm}>
                    <Ionicons name="bluetooth" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Saudação */}
            <View style={styles.header}>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text style={styles.username}>{user?.nome || "Usuário"}</Text>
            </View>

            {/* Jogos recomendados */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎮 Jogos recomendados</Text>
                <View style={styles.gameRow}>
                    {games.map((g) => (
                        <TouchableOpacity key={g.id} style={styles.gameCard} onPress={() => goToGameIntro(g)}>
                            <ImageBackground
                                source={{ uri: g.img_url }}
                                style={styles.gameImage}
                                imageStyle={{ borderRadius: 12 }}
                            >
                                <View style={styles.overlay}>
                                    <Text style={styles.gameName}>{g.nome}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Guia do dia */}
            {dailyGuide && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💡 Guia do dia</Text>
                    <TouchableOpacity
                        style={styles.guideCard}
                        onPress={() => goToGuideDetail(dailyGuide)}
                    >
                        <ImageBackground
                            source={{ uri: dailyGuide.img_url }}
                            style={styles.guideImage}
                            imageStyle={{ borderRadius: 15 }}
                        >
                            <View style={styles.guideOverlay}>
                                <View>
                                    <Text style={styles.guideCategory}>{dailyGuide.categoria}</Text>
                                    <Text style={styles.guideTitle}>{dailyGuide.titulo}</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            )}

            {/* Diário do dia */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📔 Diário de hoje</Text>
                <TouchableOpacity style={styles.diaryCard} onPress={goToDiary}>
                    <Ionicons name="book-outline" size={26} color="#17285D" />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.diaryTitle}>Registrar suas memórias</Text>
                        <Text style={styles.diarySubtitle}>Escreva sobre seu dia</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Adicione estes novos estilos aos styles existentes
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f9fc",
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    weekRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    dayCircle: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: "#e1e5ef",
        alignItems: "center",
        justifyContent: "center",
    },
    dayText: {
        color: "#17285D",
        fontFamily: "Poppins_700Bold",
        fontSize: 10,
    },
    agendaButton: {
        backgroundColor: "#17285D",
        width: 35,
        height: 35,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        marginBottom: 15,
    },
    greeting: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginTop: 5,
    },
    username: {
        fontSize: 18,
        fontFamily: "Poppins_400Regular",
        color: "#4b4b4b",
        marginTop: 3,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 8,
    },
    gameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    gameCard: {
        width: "30%",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 3,
        backgroundColor: "#fff",
    },
    gameImage: {
        width: "100%",
        height: 90,
        justifyContent: "flex-end",
    },
    overlay: {
        backgroundColor: "rgba(23,40,93,0.7)",
        paddingVertical: 6,
        alignItems: "center",
    },
    gameName: {
        fontSize: 12,
        fontFamily: "Poppins_700Bold",
        color: "#fff",
        textAlign: "center",
    },
    guideCard: {
        height: 130,
        borderRadius: 15,
        overflow: "hidden",
    },
    guideImage: {
        flex: 1,
        justifyContent: "flex-end",
    },
    guideOverlay: {
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 12,
    },
    guideCategory: {
        fontSize: 13,
        fontFamily: "Poppins_400Regular",
        color: "#f0f0f0",
    },
    guideTitle: {
        fontSize: 17,
        fontFamily: "Poppins_700Bold",
        color: "#fff",
    },
    diaryCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
    },
    diaryTitle: {
        fontSize: 15,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
    },
    diarySubtitle: {
        fontSize: 13,
        fontFamily: "Poppins_400Regular",
        color: "#555",
    },
    ofensivaContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    ofensivaText: {
        fontSize: 16,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
    },
    activeDayCircle: {
        backgroundColor: "#17285D",
    },
    activeDayText: {
        color: "#fff",
    },
    hojeCircle: {
        borderWidth: 2,
        borderColor: "#FF6B6B",
    },
    hojeText: {
        fontFamily: "Poppins_700Bold",
    },
});