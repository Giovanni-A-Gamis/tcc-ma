// QuebraCodigo.js - Ajustado
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Vibration } from "react-native";

const { width } = Dimensions.get("window");

export default function QuebraCodigo({ navigation, route }) {
    const difficulty = route.params?.difficulty || "medium";
    const [sequence, setSequence] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [options, setOptions] = useState([]);
    const [level, setLevel] = useState(1);
    const [message, setMessage] = useState("Analise o padrão...");
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [feedbackColor, setFeedbackColor] = useState("#17285D");
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const difficultySettings = {
        easy: { patterns: ["aritmetica", "alfabetica"], complexity: 1 },
        medium: { patterns: ["aritmetica", "geometrica", "alfabetica"], complexity: 2 },
        hard: { patterns: ["aritmetica", "geometrica", "alfabetica", "fibonacci"], complexity: 3 }
    };

    const generateSequence = (lvl) => {
        const settings = difficultySettings[difficulty];
        const patternTypes = settings.patterns;
        const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        
        let seq = [];
        let step = Math.floor(Math.random() * 3) + 1;
        let correct = null;

        const complexity = settings.complexity + Math.floor(lvl / 3);

        if (patternType === "aritmetica") {
            const start = Math.floor(Math.random() * 10) + 1;
            const seqLength = 3 + Math.floor(complexity / 2);
            for (let i = 0; i < seqLength; i++) {
                seq.push(start + i * step);
            }
            correct = start + seq.length * step;
        } else if (patternType === "geometrica") {
            const start = Math.floor(Math.random() * 4) + 2;
            step = Math.floor(Math.random() * 2) + 2;
            const seqLength = 3 + Math.floor(complexity / 2);
            for (let i = 0; i < seqLength; i++) {
                seq.push(start * Math.pow(step, i));
            }
            correct = start * Math.pow(step, seq.length);
        } else if (patternType === "alfabetica") {
            const base = 65 + Math.floor(Math.random() * 10);
            const seqLength = 4 + Math.floor(complexity / 2);
            for (let i = 0; i < seqLength; i++) {
                seq.push(String.fromCharCode(base + i * step));
            }
            correct = String.fromCharCode(seq[seq.length - 1].charCodeAt(0) + step);
        } else if (patternType === "fibonacci") {
            let a = Math.floor(Math.random() * 5) + 1;
            let b = a + Math.floor(Math.random() * 3) + 1;
            const seqLength = 4 + Math.floor(complexity / 2);
            for (let i = 0; i < seqLength; i++) {
                seq.push(a);
                [a, b] = [b, a + b];
            }
            correct = a;
        }

        setSequence(seq);
        setCorrectAnswer(correct);

        let opts = [correct];
        while (opts.length < 4) {
            let variation;
            const variationType = Math.random();

            if (typeof correct === "number") {
                if (variationType < 0.3) {
                    variation = correct + (Math.floor(Math.random() * 5) - 2);
                } else if (variationType < 0.6) {
                    variation = correct + step * (Math.random() < 0.5 ? 1 : -1);
                } else {
                    variation = correct + (Math.floor(Math.random() * 10) - 5);
                }
                if (variation < 0) variation = Math.abs(variation);
            } else {
                const charCode = correct.charCodeAt(0);
                const diff = Math.floor(Math.random() * 6) - 3;
                variation = String.fromCharCode(charCode + diff);
                if (variation < "A" || variation > "Z") {
                    variation = String.fromCharCode(charCode - diff);
                }
            }

            if (!opts.includes(variation) && variation !== correct) {
                opts.push(variation);
            }
        }

        setOptions(opts.sort(() => Math.random() - 0.5));
        setMessage("Qual é o próximo elemento?");
        setFeedbackColor("#17285D");
        animateFeedback();
    };

    const animateFeedback = () => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    };

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    useEffect(() => {
        generateSequence(level);
    }, [level]);

    const handleChoice = (choice) => {
        if (choice === correctAnswer) {
            setFeedbackColor("#27AE60");
            setMessage("✓ Padrão correto! +" + (10 + combo * 2));
            setScore(prev => prev + 10 + combo * 2);
            setCombo(prev => prev + 1);
            setMaxCombo(prev => Math.max(prev, combo + 1));
            Vibration.vibrate(50);
            setTimeout(() => setLevel((prev) => prev + 1), 800);
        } else {
            setFeedbackColor("#E74C3C");
            setMessage("✗ Padrão incorreto");
            setCombo(0);
            shake();
            Vibration.vibrate(200);
            setGameOver(true);
        }
    };

    const resetGame = () => {
        setLevel(1);
        setScore(0);
        setCombo(0);
        setGameOver(false);
        generateSequence(1);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.stats}>
                    <Text style={styles.stat}>Nível: {level}</Text>
                    <Text style={styles.stat}>Pontos: {score}</Text>
                    <Text style={styles.stat}>Combo: {combo}x</Text>
                </View>
            </View>

            <Text style={styles.title}>Quebra-Código Mental 🔢</Text>
            <Text style={styles.subtitle}>Descubra o padrão oculto</Text>

            {!gameOver ? (
                <Animated.View style={[styles.gameContent, { opacity: fadeAnim }]}>
                    <Text style={styles.level}>Padrão Nível {level}</Text>

                    <Animated.View style={[styles.sequenceContainer, { transform: [{ translateX: shakeAnim }] }]}>
                        <Text style={[styles.sequence, { color: feedbackColor }]}>
                            {sequence.join(" • ")} • ?
                        </Text>
                    </Animated.View>

                    <Text style={[styles.message, { color: feedbackColor }]}>{message}</Text>

                    <View style={styles.options}>
                        {options.map((opt, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.optionButton, { borderColor: feedbackColor }]}
                                onPress={() => handleChoice(opt)}
                            >
                                <Text style={[styles.optionText, { color: feedbackColor }]}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {combo > 1 && (
                        <View style={styles.comboDisplay}>
                            <Text style={styles.comboText}>Combo {combo}x!</Text>
                        </View>
                    )}
                </Animated.View>
            ) : (
                <View style={styles.overlay}>
                    <Text style={styles.winText}>Padrão Quebrado!</Text>
                    <Text style={styles.resultText}>
                        Nível {level} • {score} pontos
                    </Text>
                    {maxCombo > 1 && (
                        <Text style={styles.comboRecord}>Combo máximo: {maxCombo}x</Text>
                    )}

                    <TouchableOpacity style={styles.primaryButton} onPress={resetGame}>
                        <Text style={styles.primaryButtonText}>Tentar Novamente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.secondaryButtonText}>Voltar ao Menu</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
        padding: 24,
    },
    header: {
        marginBottom: 30,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    stat: {
        fontSize: 14,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
    },
    title: {
        fontSize: 32,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "#4A6FA5",
        textAlign: "center",
        marginBottom: 40,
    },
    gameContent: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    level: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#4A6FA5",
        marginBottom: 20,
    },
    sequenceContainer: {
        backgroundColor: "#E8EEF4",
        padding: 30,
        borderRadius: 20,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: "#D8E2EC",
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    sequence: {
        fontSize: 28,
        fontFamily: "Poppins_700Bold",
        textAlign: "center",
    },
    message: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        marginBottom: 30,
        textAlign: "center",
    },
    options: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 12,
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: "#E8EEF4",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        margin: 6,
        borderWidth: 2,
        minWidth: 80,
        alignItems: "center",
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    optionText: {
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
    },
    comboDisplay: {
        backgroundColor: "rgba(39, 174, 96, 0.2)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#27AE60",
    },
    comboText: {
        fontSize: 14,
        fontFamily: "Poppins_700Bold",
        color: "#27AE60",
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
        marginBottom: 8,
    },
    comboRecord: {
        color: "#27AE60",
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
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