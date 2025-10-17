import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

const COLORS = [
    { name: "VERMELHO", color: "#e74c3c" },
    { name: "AZUL", color: "#3498db" },
    { name: "VERDE", color: "#27ae60" },
    { name: "AMARELO", color: "#f1c40f" },
    { name: "ROXO", color: "#8e44ad" },
    { name: "LARANJA", color: "#e67e22" },
];

export default function StroopAdaptado({ navigation }) {
    const [currentWord, setCurrentWord] = useState(null);
    const [correctColor, setCorrectColor] = useState(null);
    const [message, setMessage] = useState("Toque na cor da palavra!");
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(1)).current;
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null);

    const generateRound = (lvl) => {
        const colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];
        let textColor;
        do {
        textColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        } while (textColor.color === colorObj.color);

        setCurrentWord({ text: colorObj.name, color: textColor.color });
        setCorrectColor(textColor.name);
        setMessage("Toque na cor da palavra!");
        setHidden(false);
        fadeAnim.setValue(0);

        Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        }).start();

        // Tempo base (em milissegundos)
        const totalTime = Math.max(1200, 3500 - lvl * 120);
        setTimeLeft(totalTime);

        // Reinicia animação da barra
        progressAnim.setValue(1);
        Animated.timing(progressAnim, {
        toValue: 0,
        duration: totalTime,
        useNativeDriver: false,
        }).start();

        clearTimeout(timeoutRef.current);
        clearInterval(intervalRef.current);

        // Atualiza contador numérico
        let remaining = totalTime;
        intervalRef.current = setInterval(() => {
        remaining -= 100;
        setTimeLeft(remaining);
        }, 100);

        timeoutRef.current = setTimeout(() => handleTimeout(), totalTime);

        if (lvl >= 6) {
        setTimeout(() => setHidden(true), 1000);
        }
    };

    const handleTimeout = () => {
        clearInterval(intervalRef.current);
        setMessage("Tempo esgotado! 😢");
        setGameOver(true);
    };

    const handleChoice = (choice) => {
        if (gameOver) return;
        clearTimeout(timeoutRef.current);
        clearInterval(intervalRef.current);

        if (choice === correctColor) {
        setMessage("Correto! 🎉");
        setTimeout(() => setLevel((prev) => prev + 1), 800);
        } else {
        setMessage("Errou! 😢");
        setGameOver(true);
        }
    };

    const resetGame = () => {
        setLevel(1);
        setGameOver(false);
        generateRound(1);
    };

    useEffect(() => {
        generateRound(level);
        return () => {
        clearTimeout(timeoutRef.current);
        clearInterval(intervalRef.current);
        };
    }, [level]);

    const seconds = Math.max(0, (timeLeft / 1000).toFixed(1));

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Efeito Stroop 🎨</Text>

        {!gameOver ? (
            <>
            <Text style={styles.subtitle}>Nível {level}</Text>

            {/* Barra de tempo */}
            <View style={styles.timerContainer}>
                <Animated.View
                style={[
                    styles.timerBar,
                    {
                    width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                    }),
                    },
                ]}
                />
            </View>
            <Text style={styles.timerText}>{seconds}s</Text>

            <Animated.View style={{ opacity: fadeAnim }}>
                {!hidden ? (
                <Text
                    style={[
                    styles.word,
                    { color: currentWord?.color || "#17285D" },
                    ]}
                >
                    {currentWord?.text || ""}
                </Text>
                ) : (
                <Text style={[styles.word, { color: "#999" }]}>?</Text>
                )}
            </Animated.View>

            <Text style={styles.message}>{message}</Text>

            <View style={styles.options}>
                {COLORS.map((c) => (
                <TouchableOpacity
                    key={c.name}
                    style={[styles.colorButton, { backgroundColor: c.color }]}
                    onPress={() => handleChoice(c.name)}
                />
                ))}
            </View>
            </>
        ) : (
            <View style={styles.overlay}>
            <Text style={styles.winText}>Você chegou até o nível {level}!</Text>

            <TouchableOpacity style={styles.buttonWhite} onPress={resetGame}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f4f8",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: "Poppins_500Medium",
        color: "#555",
        marginBottom: 15,
    },
    word: {
        fontSize: 44,
        fontFamily: "Poppins_700Bold",
        marginBottom: 25,
    },
    message: {
        fontSize: 18,
        fontFamily: "Poppins_500Medium",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    options: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 12,
        marginTop: 10,
    },
    colorButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        margin: 10,
        elevation: 5,
    },
    timerContainer: {
        width: "80%",
        height: 10,
        backgroundColor: "#ddd",
        borderRadius: 5,
        overflow: "hidden",
        marginBottom: 5,
    },
    timerBar: {
        height: "100%",
        backgroundColor: "#8ec0c7",
    },
    timerText: {
        color: "#17285D",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        marginBottom: 15,
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
        textAlign: "center",
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
