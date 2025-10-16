import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const wordPool = [
    "Memória", "Foco", "Atenção", "Cérebro", "Tempo", "Aprender", "Concentração",
    "Velocidade", "Pensar", "Raciocínio", "Lógica", "Treino", "Desafio", "Memo",
    "Lembrar", "Detalhe", "Repetir", "Olhar", "Ouvir", "Notar"
];

export default function PalavrasFugidias({ navigation }) {
    const [shownWords, setShownWords] = useState([]);
    const [options, setOptions] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [message, setMessage] = useState("Observe as palavras e memorize!");
    const [level, setLevel] = useState(1);
    const [step, setStep] = useState("showing"); // showing | asking | finished
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const [questionType, setQuestionType] = useState("was"); // "was" ou "wasnt"

    useEffect(() => {
        startLevel();
    }, [level]);

    const startLevel = () => {
        const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
        const count = Math.min(3 + level, 10);
        const selected = shuffled.slice(0, count);
        setShownWords(selected);
        setStep("showing");
        setCurrentIndex(0);
        setMessage("Observe as palavras...");
        setQuestionType(level % 2 === 0 ? "wasnt" : "was");
        setTimeout(() => showNext(selected, 0), 800);
    };

    const showNext = (list, index) => {
        if (index < list.length) {
            setMessage(list[index]);
            setCurrentIndex(index);
            // Palavra agora aparece mais tempo e com destaque
            setTimeout(() => showNext(list, index + 1), 1500 - Math.min(level * 50, 500));
        } else {
            prepareQuestion(list);
        }
    };

    const prepareQuestion = (list) => {
        let correct;
        if (questionType === "was") {
            correct = list[Math.floor(Math.random() * list.length)];
        } else {
            const notShown = wordPool.filter((w) => !list.includes(w));
            correct = notShown[Math.floor(Math.random() * notShown.length)];
        }

        let opts = [correct];
        while (opts.length < 4) {
            const rand = wordPool[Math.floor(Math.random() * wordPool.length)];
            if (!opts.includes(rand)) opts.push(rand);
        }

        setCorrectAnswer(correct);
        setOptions(opts.sort(() => Math.random() - 0.5));
        setStep("asking");

        setMessage(
            questionType === "was"
                ? "Qual dessas palavras apareceu?"
                : "Qual dessas NÃO apareceu?"
        );
    };

    const handleChoice = (choice) => {
        if (choice === correctAnswer) {
            setMessage("Correto! 🎉");
            setStep("finished");
            setTimeout(() => setLevel((prev) => prev + 1), 1000);
        } else {
            setMessage("Errou! 😢");
            setGameOver(true);
        }
    };

    const resetGame = () => {
        setLevel(1);
        setGameOver(false);
        setStep("showing");
        startLevel();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Palavras Fugidias 🧩</Text>

            {!gameOver ? (
                <>
                    <Text style={styles.subtitle}>Nível {level}</Text>
                    <Text
                        style={[
                            styles.message,
                            step === "showing" ? { fontSize: 32, color: "#5C172C" } : {}
                        ]}
                    >
                        {message}
                    </Text>

                    {step === "asking" && (
                        <View style={styles.options}>
                            {options.map((opt, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.optionButton}
                                    onPress={() => handleChoice(opt)}
                                >
                                    <Text style={styles.optionText}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
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
        marginBottom: 25,
    },
    message: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        textAlign: "center",
        marginBottom: 30,
    },
    options: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 12,
    },
    optionButton: {
        backgroundColor: "#8ec0c7",
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 14,
        margin: 5,
    },
    optionText: {
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
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
