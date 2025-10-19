import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Vibration } from "react-native";

const { width } = Dimensions.get("window");

const wordThemes = {
    cognitive: [
        "MEMÓRIA", "FOCO", "ATENÇÃO", "CÉREBRO", "CONCENTRAÇÃO", "RACIOCÍNIO", "LÓGICA", "PERCEPÇÃO",
        "INTELIGÊNCIA", "NEURÔNIO", "APRENDIZADO", "COGNIÇÃO", "PENSAMENTO", "ANÁLISE", "SOLUÇÃO", "HIPÓTESE",
        "DEDUÇÃO", "SABEDORIA", "ENTENDIMENTO", "COMPREENSÃO", "INTERPRETAÇÃO", "OBSERVAÇÃO", "REFLETIR", "CONHECIMENTO"
    ],
    nature: [
        "FLORESTA", "OCEANO", "MONTANHA", "RIO", "CACHOEIRA", "ARVORE", "ANIMAL", "PLANTA",
        "LUA", "SOL", "ESTRELA", "VENTO", "CHUVA", "TERRA", "MAR", "LAGO",
        "PRAIA", "DESERTO", "VULCÃO", "NEVE", "NUVEM", "TEMPESTADE", "ARARA", "BALEIA",
        "ELEFANTE", "GIRASSOL", "ORQUÍDEA", "CACTUS", "BAMBU", "TRIGO", "CACHORRO", "GATO"
    ],
    abstract: [
        "INFINITO", "UNIVERSO", "TEMPO", "ESPAÇO", "ENERGIA", "MATÉRIA", "FORÇA", "MOVIMENTO",
        "EXISTÊNCIA", "CONSCIÊNCIA", "REALIDADE", "IMAGINAÇÃO", "CRIATIVIDADE", "INSPIRAÇÃO", "POSSIBILIDADE", "POTENCIAL",
        "TRANSFORMAÇÃO", "EVOLUÇÃO", "REVOLUÇÃO", "HARMONIA", "EQUILÍBRIO", "LIBERDADE", "JUSTIÇA", "VERDADE",
        "BELEZA", "ARTE", "MÚSICA", "POESIA", "FILOSOFIA", "CIÊNCIA", "TECNOLOGIA", "FUTURO"
    ]
};

export default function PalavrasFugidias({ navigation, route }) {
    const difficulty = route.params?.difficulty || "medium";
    const [theme, setTheme] = useState("cognitive");
    const [shownWords, setShownWords] = useState([]);
    const [options, setOptions] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [instruction, setInstruction] = useState("Prepare sua atenção...");
    const [currentWord, setCurrentWord] = useState("");
    const [level, setLevel] = useState(1);
    const [step, setStep] = useState("showing");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [questionType, setQuestionType] = useState("was");
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const difficultySettings = {
        easy: { displayTime: 2000, speedMultiplier: 1.2 },
        medium: { displayTime: 1500, speedMultiplier: 1.0 },
        hard: { displayTime: 1000, speedMultiplier: 0.8 }
    };

    // Função para determinar quantas palavras mostrar baseado no nível
    const getWordCountByLevel = (currentLevel) => {
        if (currentLevel <= 3) return 3;
        if (currentLevel <= 12) return 4;
        if (currentLevel <= 19) return 5;
        if (currentLevel <= 29) return 7;
        return 8; // Nível 30+
    };

    useEffect(() => {
        startLevel();
    }, [level]);

    // Muda o tema a cada 5 níveis para variar
    useEffect(() => {
        const themes = Object.keys(wordThemes);
        const newTheme = themes[Math.floor((level - 1) / 5) % themes.length];
        setTheme(newTheme);
    }, [level]);

    const startLevel = () => {
        const settings = difficultySettings[difficulty];
        const wordPool = wordThemes[theme];
        
        // Usa a função dinâmica para determinar quantas palavras mostrar
        const wordCount = getWordCountByLevel(level);
        
        const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, wordCount);
        
        setShownWords(selected);
        setStep("showing");
        setCurrentIndex(0);
        setInstruction(`Observe atentamente... (${wordCount} palavras)`);
        setCurrentWord("");
        setQuestionType(Math.random() < 0.5 ? "was" : "wasnt");
        
        Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();

        setTimeout(() => showNext(selected, 0, settings), 1000);
    };

    const showNext = (list, index, settings) => {
        if (index < list.length) {
            setCurrentWord(list[index]);
            setCurrentIndex(index);
            
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Tempo de exibição diminui conforme o nível aumenta, mas com limite mínimo
            const baseTime = settings.displayTime * settings.speedMultiplier;
            const levelPenalty = Math.max(0.4, 1 - (level * 0.03)); // Mínimo de 40% do tempo
            const displayTime = Math.max(800, baseTime * levelPenalty); // Mínimo de 800ms

            setTimeout(() => {
                fadeAnim.setValue(1);
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    // Chama a próxima palavra após o fade out
                    showNext(list, index + 1, settings);
                });
            }, displayTime);
        } else {
            // Todas as palavras foram mostradas, prepara a pergunta
            setTimeout(() => {
                prepareQuestion(list);
            }, 500);
        }
    };

    const prepareQuestion = (list) => {
        let correct;
        const wordPool = wordThemes[theme];

        if (questionType === "was") {
            // Pergunta: Qual palavra APARECEU?
            correct = list[Math.floor(Math.random() * list.length)];
            
            let opts = [correct];
            // Adiciona palavras que NÃO apareceram como opções erradas
            const notShown = wordPool.filter((w) => !list.includes(w));
            
            while (opts.length < 4 && notShown.length > 0) {
                const rand = notShown[Math.floor(Math.random() * notShown.length)];
                if (!opts.includes(rand)) {
                    opts.push(rand);
                    // Remove a palavra usada para evitar duplicatas
                    notShown.splice(notShown.indexOf(rand), 1);
                }
            }
            
            setCorrectAnswer(correct);
            setOptions(opts.sort(() => Math.random() - 0.5));
        } else {
            // Pergunta: Qual palavra NÃO APARECEU?
            const notShown = wordPool.filter((w) => !list.includes(w));
            
            // Garante que há palavras não mostradas suficientes
            if (notShown.length > 0) {
                correct = notShown[Math.floor(Math.random() * notShown.length)];
                
                let opts = [correct];
                // Adiciona palavras que APARECERAM como opções erradas
                while (opts.length < 4 && list.length > 0) {
                    const rand = list[Math.floor(Math.random() * list.length)];
                    if (!opts.includes(rand)) {
                        opts.push(rand);
                    }
                }
                
                // Se não há palavras suficientes, completa com palavras não mostradas
                while (opts.length < 4 && notShown.length > 0) {
                    const rand = notShown[Math.floor(Math.random() * notShown.length)];
                    if (!opts.includes(rand)) {
                        opts.push(rand);
                        notShown.splice(notShown.indexOf(rand), 1);
                    }
                }
                
                setCorrectAnswer(correct);
                setOptions(opts.sort(() => Math.random() - 0.5));
            } else {
                // Fallback: se não há palavras não mostradas, muda para pergunta "was"
                setQuestionType("was");
                prepareQuestion(list);
                return;
            }
        }

        setStep("asking");
        setCurrentWord("");

        setInstruction(
            questionType === "was"
                ? "Qual palavra APARECEU na sequência?"
                : "Qual palavra NÃO APARECEU na sequência?"
        );
    };

    const handleChoice = (choice) => {
        if (choice === correctAnswer) {
            const pointsEarned = 10 + Math.floor(level / 3); // Pontuação aumenta com o nível
            setInstruction(`✓ Correto! +${pointsEarned} pontos`);
            setScore(prev => prev + pointsEarned);
            Vibration.vibrate(50);
            setStep("finished");
            setTimeout(() => setLevel((prev) => prev + 1), 1000);
        } else {
            setInstruction("✗ Errado! -1 vida");
            setLives(prev => prev - 1);
            Vibration.vibrate(200);
            if (lives <= 1) {
                setGameOver(true);
            } else {
                setStep("finished");
                setTimeout(() => setLevel((prev) => prev + 1), 1000);
            }
        }
    };

    const resetGame = () => {
        setLevel(1);
        setScore(0);
        setLives(3);
        setGameOver(false);
        setStep("showing");
        startLevel();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.stats}>
                    <Text style={styles.stat}>Nível: {level}</Text>
                    <Text style={styles.stat}>Pontos: {score}</Text>
                    <Text style={styles.stat}>Vidas: {"❤️".repeat(lives)}</Text>
                </View>
            </View>
            <Text style={styles.subtitle}>Presta atenção nas palavras</Text>

            {!gameOver ? (
                <>
                    <Animated.View style={[styles.wordDisplay, { transform: [{ scale: pulseAnim }] }]}>
                        <Animated.Text style={[styles.word, { opacity: fadeAnim }]}>
                            {currentWord || "?"}
                        </Animated.Text>
                    </Animated.View>

                    <Text style={styles.instruction}>{instruction}</Text>

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

                    {step === "showing" && (
                        <View style={styles.progress}>
                            <Text style={styles.progressText}>
                                Palavra {currentIndex + 1} de {shownWords.length}
                            </Text>
                            <View style={styles.levelInfo}>
                                <Text style={styles.levelInfoText}>
                                    Nível {level}: {getWordCountByLevel(level)} palavras
                                </Text>
                            </View>
                        </View>
                    )}
                </>
            ) : (
                <View style={styles.overlay}>
                    <Text style={styles.winText}>Fim do Jogo!</Text>
                    <Text style={styles.resultText}>
                        Nível {level} • {score} pontos
                    </Text>
                    <Text style={styles.themeRecord}>
                        Tema final: {theme.toUpperCase()}
                    </Text>

                    <TouchableOpacity style={styles.primaryButton} onPress={resetGame}>
                        <Text style={styles.primaryButtonText}>Jogar Novamente</Text>
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
        marginBottom: 20,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    stat: {
        fontSize: 14,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
    },
    themeText: {
        fontSize: 12,
        fontFamily: "Poppins_500Medium",
        color: "#4A6FA5",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: 1,
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
    wordDisplay: {
        backgroundColor: "#E8EEF4",
        padding: 40,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#D8E2EC",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        minHeight: 120,
        marginTop: -20,
    },
    word: {
        fontSize: 28,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        textAlign: "center",
    },
    instruction: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
        textAlign: "center",
        marginBottom: 30,
    },
    progress: {
        alignItems: "center",
        marginTop: 20,
    },
    progressText: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "#4A6FA5",
        marginBottom: 8,
    },
    levelInfo: {
        backgroundColor: "rgba(74, 111, 165, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    levelInfoText: {
        fontSize: 12,
        fontFamily: "Poppins_600SemiBold",
        color: "#4A6FA5",
    },
    options: {
        width: "100%",
        marginTop: -20,
    },
    optionButton: {
        backgroundColor: "#E8EEF4",
        padding: 20,
        borderRadius: 16,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: "#D8E2EC",
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    optionText: {
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
        marginBottom: 8,
    },
    themeRecord: {
        color: "#4A6FA5",
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        marginBottom: 40,
        textTransform: "uppercase",
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