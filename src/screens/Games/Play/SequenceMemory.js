import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Vibration } from "react-native";

const { width } = Dimensions.get("window");
const BUTTON_SIZE = (width - 100) / 2;

const colorSchemes = {
    classic: [
        { normal: "#FF6B6B", vivid: "#FF5252", sound: "C" }, // Vermelho
        { normal: "#4ECDC4", vivid: "#26A69A", sound: "D" }, // Verde água
        { normal: "#45B7D1", vivid: "#2A93D5", sound: "E" }, // Azul
        { normal: "#FFD166", vivid: "#FFC048", sound: "F" }, // Amarelo
    ]
};

export default function SimonGame({ navigation, route }) {
    const difficulty = route.params?.difficulty || "medium";
    const [colorScheme, setColorScheme] = useState("classic");
    const [sequence, setSequence] = useState([]);
    const [playerInput, setPlayerInput] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [message, setMessage] = useState("Observe a sequência atentamente");
    const [level, setLevel] = useState(1);
    const [activeButton, setActiveButton] = useState(null);
    const [animations] = useState(colorSchemes.classic.map(() => new Animated.Value(1)));
    const [started, setStarted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const difficultySettings = {
        easy: { speed: 800, sequenceLength: 3 },
        medium: { speed: 600, sequenceLength: 4 },
        hard: { speed: 400, sequenceLength: 5 }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (!started) {
            setStarted(true);
            setMessage("Observe o padrão...");
            addToSequence([]);
        }
    }, [countdown, started]);

    const restartGame = () => {
        setSequence([]);
        setPlayerInput([]);
        setIsPlaying(false);
        setLevel(1);
        setScore(0);
        setActiveButton(null);
        setStarted(false);
        setCountdown(3);
        setGameOver(false);
        setMessage("Prepare-se!");
    };

    const addToSequence = (currentSeq) => {
        const newSequence = [...currentSeq, Math.floor(Math.random() * 4)];
        setSequence(newSequence);
        playSequence(newSequence);
    };

    const playSequence = async (seq) => {
        setIsPlaying(true);
        setMessage("Memorize o padrão...");
        
        const speed = Math.max(200, difficultySettings[difficulty].speed - (level * 20));
        
        for (let i = 0; i < seq.length; i++) {
            const index = seq[i];
            setActiveButton(index);
            animatePress(index);
            await new Promise((r) => setTimeout(r, speed));
            setActiveButton(null);
            await new Promise((r) => setTimeout(r, speed * 0.3));
        }
        setIsPlaying(false);
        setMessage("Sua vez! Repita o padrão");
        setPlayerInput([]);
    };

    const animatePress = (index) => {
        Vibration.vibrate(50);
        Animated.sequence([
            Animated.timing(animations[index], { 
                toValue: 1.3, 
                duration: 150, 
                useNativeDriver: true 
            }),
            Animated.timing(animations[index], { 
                toValue: 1, 
                duration: 150, 
                useNativeDriver: true 
            }),
        ]).start();
    };

    const handlePress = (index) => {
        if (isPlaying || gameOver || !started) return;

        animatePress(index);
        const newInput = [...playerInput, index];
        setPlayerInput(newInput);

        const correct = newInput.every((v, i) => v === sequence[i]);

        if (!correct) {
            setMessage("Sequência incorreta! 😢");
            Vibration.vibrate(200);
            setGameOver(true);
            return;
        }

        if (newInput.length === sequence.length) {
            setMessage("✓ Padrão correto! +25 pontos");
            setScore(prev => prev + 25);
            setLevel((prev) => prev + 1);
            setTimeout(() => {
                addToSequence(sequence);
            }, 1000);
        }
    };

    const colors = colorSchemes[colorScheme];

    return (
        <View style={styles.container}>
            {!started && countdown > 0 && (
                <View style={styles.countdownContainer}>
                    <Animated.Text style={[styles.countdown, { transform: [{ scale: pulseAnim }] }]}>
                        {countdown}
                    </Animated.Text>
                    <Text style={styles.countdownText}>Preparando sua memória...</Text>
                </View>
            )}

            {started && (
                <>
                    <View style={styles.header}>
                        <Text style={styles.title}>PRESTE ATENÇÃO!</Text>
                        <View style={styles.stats}>
                            <Text style={styles.stat}>Nível: {level}</Text>
                            <Text style={styles.stat}>Pontos: {score}</Text>
                            <Text style={styles.stat}>Sequência: {sequence.length}</Text>
                        </View>
                    </View>
                    <View style={styles.grid}>
                        {colors.map((c, index) => {
                            const isActive = activeButton === index;
                            const scale = animations[index];
                            return (
                                <Animated.View 
                                    key={index} 
                                    style={[
                                        styles.buttonContainer,
                                        { transform: [{ scale }] }
                                    ]}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => handlePress(index)}
                                        style={[
                                            styles.button,
                                            {
                                                backgroundColor: isActive ? c.vivid : c.normal,
                                                shadowColor: isActive ? c.vivid : "#17285D",
                                            },
                                        ]}
                                    />
                                </Animated.View>
                            );
                        })}
                    </View>

                    <Text style={styles.info}>{message}</Text>

                    {gameOver && (
                        <View style={styles.overlay}>
                            <Text style={styles.winText}>Fim do Jogo!</Text>
                            <Text style={styles.resultText}>
                                Nível {level} • {score} pontos
                            </Text>

                            <TouchableOpacity style={styles.primaryButton} onPress={restartGame}>
                                <Text style={styles.primaryButtonText}>Jogar Novamente</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                                <Text style={styles.secondaryButtonText}>Voltar ao Menu</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F0F4F8",
        padding: 20,
    },
    countdownContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    countdown: {
        fontSize: 80,
        color: "#17285D",
        fontFamily: "Poppins_700Bold",
        marginBottom: 20,
    },
    countdownText: {
        fontSize: 18,
        color: "#4A6FA5",
        fontFamily: "Poppins_400Regular",
    },
    header: {
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    stat: {
        fontSize: 17,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
    },
    title: {
        fontSize: 32,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "#4A6FA5",
        marginBottom: 40,
        textAlign: "center",
    },
    grid: {
        width: width - 60,
        height: width - 60,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContainer: {
        margin: 10,
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 3,
        borderColor: "#FFFFFF",
    },
    info: {
        marginTop: 40,
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
        textAlign: "center",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(23,40,93,0.95)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    winText: {
        color: "#FFFFFF",
        fontFamily: "Poppins_700Bold",
        fontSize: 32,
        marginBottom: 16,
        textAlign: "center",
    },
    resultText: {
        color: "#E8EEF4",
        fontFamily: "Poppins_400Regular",
        fontSize: 18,
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: "#4A6FA5",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginVertical: 8,
        width: "100%",
        alignItems: "center",
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    secondaryButton: {
        backgroundColor: "transparent",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginVertical: 8,
        width: "100%",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#4A6FA5",
    },
    primaryButtonText: {
        fontSize: 18,
        fontFamily: "Poppins_700Bold",
        color: "#FFFFFF",
    },
    secondaryButtonText: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#4A6FA5",
    },
});