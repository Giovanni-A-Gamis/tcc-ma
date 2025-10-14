import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

const colors = [
    { normal: "#e67e7e", vivid: "#e74c3c" },
    { normal: "#7ddf9b", vivid: "#27ae60" },
    { normal: "#f7e28b", vivid: "#f1c40f" },
    { normal: "#7db9f0", vivid: "#3498db" },
];

export default function SimonGame({ navigation }) {
    const [sequence, setSequence] = useState([]);
    const [playerInput, setPlayerInput] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [message, setMessage] = useState("Observe a sequência!");
    const [level, setLevel] = useState(1);
    const [activeButton, setActiveButton] = useState(null);
    const [animations] = useState(colors.map(() => new Animated.Value(1)));
    const [started, setStarted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [gameOver, setGameOver] = useState(false);

    // Contagem regressiva automática
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (!started) {
            setStarted(true);
            setMessage("Observe a sequência!");
            addToSequence([]);
        }
    }, [countdown]);

    const restartGame = () => {
        setSequence([]);
        setPlayerInput([]);
        setIsPlaying(false);
        setLevel(1);
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
        for (let i = 0; i < seq.length; i++) {
            const index = seq[i];
            setActiveButton(index);
            animatePress(index);
            await new Promise((r) => setTimeout(r, 700));
            setActiveButton(null);
            await new Promise((r) => setTimeout(r, 250));
        }
        setIsPlaying(false);
        setMessage("Sua vez!");
        setPlayerInput([]);
    };

    const animatePress = (index) => {
        Animated.sequence([
            Animated.timing(animations[index], { toValue: 1.3, duration: 120, useNativeDriver: true }),
            Animated.timing(animations[index], { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();
    };

    const handlePress = (index) => {
        if (isPlaying || gameOver || !started) return;

        animatePress(index);
        const newInput = [...playerInput, index];
        setPlayerInput(newInput);

        const correct = newInput.every((v, i) => v === sequence[i]);

        if (!correct) {
            setMessage("Errou! 😢");
            setGameOver(true);
            return;
        }

        if (newInput.length === sequence.length) {
            setMessage("Perfeito! Indo para o próximo nível...");
            setTimeout(() => {
                setLevel((prev) => prev + 1);
                addToSequence(sequence);
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            {!started && countdown > 0 && (
                <Text style={styles.countdown}>{countdown}</Text>
            )}

            {started && (
                <>
                    <View style={styles.grid}>
                        {colors.map((c, index) => {
                            const isActive = activeButton === index;
                            const scale = animations[index];
                            return (
                                <Animated.View key={index} style={{ transform: [{ scale }] }}>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => handlePress(index)}
                                        style={[
                                            styles.button,
                                            {
                                                backgroundColor: isActive
                                                    ? c.vivid
                                                    : c.normal,
                                                opacity: isActive ? 1 : 0.8,
                                            },
                                        ]}
                                    />
                                </Animated.View>
                            );
                        })}
                    </View>

                    <Text style={styles.info}>{message}</Text>
                    <Text style={styles.level}>Nível {level}</Text>

                    {gameOver && (
                        <View style={styles.overlay}>
                            <Text style={styles.winText}>Você chegou até o nível {level}!</Text>
                            <TouchableOpacity style={styles.buttonWhite} onPress={restartGame}>
                                <Text style={styles.buttonTextBlue}>Jogar novamente</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.buttonWhite, styles.secondaryButton]}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.buttonTextWhite}>Voltar ao menu</Text>
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
        backgroundColor: "#f5f9ff",
    },
    countdown: {
        fontSize: 60,
        color: "#17285D",
        fontFamily: "Poppins_700Bold",
        marginBottom: 20,
    },
    grid: {
        width: 260,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    button: {
        width: 110,
        height: 110,
        margin: 10,
        borderRadius: 20,
        elevation: 6,
    },
    info: {
        marginTop: 20,
        fontSize: 18,
        fontFamily: "Poppins_500Medium",
        color: "#17285D",
    },
    level: {
        marginTop: 5,
        fontSize: 16,
        color: "#4b628c",
        fontFamily: "Poppins_400Regular",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(23,40,93,0.9)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    winText: {
        color: "#fff",
        fontFamily: "Poppins_700Bold",
        fontSize: 24,
        marginBottom: 20,
    },
    buttonWhite: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 5,
    },
    secondaryButton: {
        backgroundColor: "#8ec0c7",
    },
    buttonTextBlue: {
        color: "#17285D",
        fontFamily: "Poppins_700Bold",
        fontSize: 16,
    },
    buttonTextWhite: {
        color: "#fff",
        fontFamily: "Poppins_700Bold",
        fontSize: 16,
    },
});
