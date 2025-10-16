import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function QuebraCodigo({ navigation }) {
    const [sequence, setSequence] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [options, setOptions] = useState([]);
    const [level, setLevel] = useState(1);
    const [message, setMessage] = useState("Descubra o próximo elemento da sequência!");
    const [gameOver, setGameOver] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [feedbackColor, setFeedbackColor] = useState("#17285D");

    const generateSequence = (lvl) => {
        const patternType = Math.random() < 0.33 ? "aritmetica" : Math.random() < 0.5 ? "geometrica" : "alfabetica";
        let seq = [];
        let step = Math.floor(Math.random() * 3) + 1;
        let correct = null;

        if (patternType === "aritmetica") {
            const start = Math.floor(Math.random() * 5) + 1;
            for (let i = 0; i < Math.min(3 + Math.floor(lvl / 2), 7); i++) {
                seq.push(start + i * step);
            }
            correct = start + seq.length * step;
        } else if (patternType === "geometrica") {
            const start = Math.floor(Math.random() * 4) + 2;
            step = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < Math.min(3 + Math.floor(lvl / 2), 6); i++) {
                seq.push(start * Math.pow(step, i));
            }
            correct = start * Math.pow(step, seq.length);
        } else {
            const base = 65 + Math.floor(Math.random() * 5); // letra inicial A–E
            for (let i = 0; i < Math.min(3 + Math.floor(lvl / 2), 8); i++) {
                seq.push(String.fromCharCode(base + i * step));
            }
            correct = String.fromCharCode(seq[seq.length - 1].charCodeAt(0) + step);
        }

        setSequence(seq);
        setCorrectAnswer(correct);

        // Geração segura de opções
        let opts = [correct];
        while (opts.length < 4) {
            let variation;

            if (typeof correct === "number") {
                variation = correct + (Math.floor(Math.random() * 8) - 4);
                if (variation < 0) continue; // evita números negativos
            } else if (typeof correct === "string" && correct.length === 1) {
                const charCode = correct.charCodeAt(0);
                const diff = Math.floor(Math.random() * 6) - 3;
                variation = String.fromCharCode(charCode + diff);
                // garante que é letra
                if (variation < "A" || variation > "Z") continue;
            } else {
                continue;
            }

            if (!opts.includes(variation)) {
                opts.push(variation);
            }
        }

        setOptions(opts.sort(() => Math.random() - 0.5));
        setMessage("Descubra o próximo elemento da sequência!");
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

    useEffect(() => {
        generateSequence(level);
    }, [level]);

    const handleChoice = (choice) => {
        if (choice === correctAnswer) {
            setFeedbackColor("#27ae60");
            setMessage("Correto! 🎉 Prepare-se para o próximo...");
            setTimeout(() => setLevel((prev) => prev + 1), 1000);
        } else {
            setFeedbackColor("#e74c3c");
            setMessage("Errou! 😢");
            setGameOver(true);
        }
    };

    const resetGame = () => {
        setLevel(1);
        setGameOver(false);
        generateSequence(1);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quebra-Código 🔢</Text>

            {!gameOver ? (
                <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
                    <Text style={styles.subtitle}>Nível {level}</Text>

                    <Text style={[styles.sequence, { color: feedbackColor }]}>
                        {sequence.join(", ")} , ?
                    </Text>

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
                </Animated.View>
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
        marginBottom: 20,
    },
    sequence: {
        fontSize: 34,
        fontFamily: "Poppins_700Bold",
        marginBottom: 25,
    },
    message: {
        fontSize: 18,
        fontFamily: "Poppins_500Medium",
        marginBottom: 20,
        textAlign: "center",
    },
    options: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 12,
    },
    optionButton: {
        backgroundColor: "#f9f9f9",
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 14,
        margin: 5,
        borderWidth: 2,
    },
    optionText: {
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
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
