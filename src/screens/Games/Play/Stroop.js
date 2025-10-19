import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Vibration } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = [
    { name: "VERMELHO", color: "#E74C3C", textColor: "#FFFFFF" },
    { name: "AZUL", color: "#4A6FA5", textColor: "#FFFFFF" },
    { name: "VERDE", color: "#27AE60", textColor: "#FFFFFF" },
    { name: "AMARELO", color: "#F39C12", textColor: "#FFFFFF" },
    { name: "ROXO", color: "#8E44AD", textColor: "#FFFFFF" },
    { name: "LARANJA", color: "#E67E22", textColor: "#FFFFFF" },
];

const BACKGROUND_COLORS = [
    "#E8EEF4", "#D8E2EC", "#C8D6E5", "#F0F4F8", "#FFFFFF"
];

export default function StroopAdaptado({ navigation, route }) {
    const difficulty = route.params?.difficulty || "medium";
    const [currentWord, setCurrentWord] = useState(null);
    const [correctColor, setCorrectColor] = useState(null);
    const [message, setMessage] = useState("Toque na COR ESCRITA da palavra");
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [backgroundColor, setBackgroundColor] = useState("#F0F4F8");
    const [options, setOptions] = useState([]);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null);

    const difficultySettings = {
        easy: { timeLimit: 5000, confusionLevel: 0 },
        medium: { timeLimit: 4000, confusionLevel: 1 },
        hard: { timeLimit: 3000, confusionLevel: 2 }
    };

    const generateConfusingOptions = (correctColorName) => {
        const settings = difficultySettings[difficulty];
        let optionList = [];
        
        // Seleciona 4 cores de fundo diferentes
        const availableBgColors = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 4);
        
        // Cria a opção correta (com o TEXTO igual ao nome da cor correta)
        const correctColorObj = COLORS.find(c => c.name === correctColorName);
        
        // Para a opção correta, escolhe uma cor de fundo aleatória das disponíveis
        const correctBgColor = availableBgColors[Math.floor(Math.random() * availableBgColors.length)];
        
        optionList.push({
            text: correctColorObj.name, // TEXTO correto
            backgroundColor: correctBgColor.color, // Fundo aleatório
            isCorrect: true
        });

        // Remove a cor de fundo usada da lista disponível
        const remainingBgColors = availableBgColors.filter(color => color.color !== correctBgColor.color);
        
        // Seleciona textos para as opções erradas (diferentes da cor correta)
        const availableTexts = COLORS.filter(color => color.name !== correctColorName)
                                   .sort(() => Math.random() - 0.5)
                                   .slice(0, 3);

        // Cria as opções erradas
        for (let i = 0; i < 3; i++) {
            optionList.push({
                text: availableTexts[i].name,
                backgroundColor: remainingBgColors[i].color,
                isCorrect: false
            });
        }

        // Em níveis mais difíceis, aumenta a confusão
        if (settings.confusionLevel >= 1 && level >= 5) {
            // Às vezes troca os textos entre opções para aumentar a confusão
            if (Math.random() > 0.5) {
                const shuffledTexts = [...optionList.map(opt => opt.text)].sort(() => Math.random() - 0.5);
                optionList.forEach((opt, index) => {
                    opt.text = shuffledTexts[index];
                });
                // Marca novamente qual é a opção correta
                optionList.forEach(opt => {
                    opt.isCorrect = (opt.text === correctColorName);
                });
            }
        }

        return optionList.sort(() => Math.random() - 0.5);
    };

    const generateRound = (lvl) => {
        const settings = difficultySettings[difficulty];
        
        const colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];
        let textColorObj;
        do {
            textColorObj = COLORS[Math.floor(Math.random() * COLORS.length)];
        } while (textColorObj.name === colorObj.name && Math.random() > 0.3);

        if (lvl >= 3 && settings.confusionLevel >= 1) {
            const bgColor = BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)];
            setBackgroundColor(bgColor);
        }

        setCurrentWord({ 
            text: colorObj.name, 
            color: textColorObj.color, // Esta é a cor em que a palavra está escrita
            textColor: textColorObj.textColor 
        });
        setCorrectColor(textColorObj.name); // O jogador deve tocar no botão com este TEXTO
        
        // Gera opções confusas
        const confusingOptions = generateConfusingOptions(textColorObj.name);
        setOptions(confusingOptions);
        
        setMessage("Toque na COR ESCRITA da palavra");
        setHidden(false);
        fadeAnim.setValue(0);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        const totalTime = Math.max(1500, settings.timeLimit - (lvl * 50));
        setTimeLeft(totalTime);

        progressAnim.setValue(1);
        Animated.timing(progressAnim, {
            toValue: 0,
            duration: totalTime,
            useNativeDriver: false,
        }).start();

        clearTimeout(timeoutRef.current);
        clearInterval(intervalRef.current);

        let remaining = totalTime;
        intervalRef.current = setInterval(() => {
            remaining -= 100;
            setTimeLeft(remaining);
        }, 100);

        timeoutRef.current = setTimeout(() => handleTimeout(), totalTime);

        if (lvl >= 10 && settings.confusionLevel >= 2 && Math.random() > 0.7) {
            setTimeout(() => setHidden(true), totalTime * 0.8);
        }
    };

    const handleTimeout = () => {
        clearInterval(intervalRef.current);
        setMessage("⏰ Tempo esgotado!");
        setCombo(0);
        setGameOver(true);
    };

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleChoice = (isCorrect) => {
        if (gameOver) return;
        clearTimeout(timeoutRef.current);
        clearInterval(intervalRef.current);

        if (isCorrect) {
            setMessage("✓ Correto! +" + (10 + combo * 3));
            setScore(prev => prev + 10 + combo * 3);
            setCombo(prev => prev + 1);
            Vibration.vibrate(50);
            setTimeout(() => setLevel((prev) => prev + 1), 800);
        } else {
            setMessage("✗ Incorreto! Combo perdido");
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
        setBackgroundColor("#F0F4F8");
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
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <View style={styles.stats}>
                    <Text style={styles.stat}>Nível: {level}</Text>
                    <Text style={styles.stat}>Pontos: {score}</Text>
                    <Text style={styles.stat}>Combo: {combo}x</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>Ignore a COR, foque no TEXTO</Text>

            {!gameOver ? (
                <>
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

                    <Animated.View style={[
                        styles.wordContainer, 
                        { 
                            opacity: fadeAnim,
                            transform: [{ translateX: shakeAnim }]
                        }
                    ]}>
                        {!hidden ? (
                            <Text
                                style={[
                                    styles.word,
                                    { 
                                        color: currentWord?.color || "#17285D",
                                        textShadowColor: 'rgba(23,40,93,0.1)',
                                        textShadowOffset: { width: 1, height: 1 },
                                        textShadowRadius: 2,
                                    },
                                ]}
                            >
                                {currentWord?.text || ""}
                            </Text>
                        ) : (
                            <Text style={[styles.word, { color: "#4A6FA5" }]}>❓</Text>
                        )}
                    </Animated.View>

                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.options}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.colorButton, { backgroundColor: option.backgroundColor }]}
                                onPress={() => handleChoice(option.isCorrect)}
                            >
                                <Text style={styles.colorButtonText}>
                                    {option.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {combo > 1 && (
                        <View style={styles.comboDisplay}>
                            <Text style={styles.comboText}>Combo {combo}x!</Text>
                        </View>
                    )}
                </>
            ) : (
                <View style={styles.overlay}>
                    <Text style={styles.winText}>
                        {timeLeft === 0 ? "⏰ Tempo Esgotado!" : "Fim de Jogo!"}
                    </Text>
                    <Text style={styles.resultText}>
                        Nível {level} • {score} pontos
                    </Text>
                    {combo > 0 && (
                        <Text style={styles.comboRecord}>Combo máximo: {combo}x</Text>
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
    wordContainer: {
        backgroundColor: "#FFFFFF",
        padding: 40,
        borderRadius: 20,
        marginBottom: 30,
        borderWidth: 3,
        borderColor: "#D8E2EC",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    word: {
        fontSize: 36,
        fontFamily: "Poppins_700Bold",
        textAlign: "center",
    },
    message: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
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
    colorButton: {
        width: (width - 50) / 3,
        height: 80,
        borderRadius: 16,
        margin: 6,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    colorButtonText: {
        fontSize: 16,
        fontFamily: "Poppins_700Bold",
        color: "#FFFFFF",
        textAlign: "center",
    },
    timerContainer: {
        width: "100%",
        height: 8,
        backgroundColor: "#D8E2EC",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 8,
    },
    timerBar: {
        height: "100%",
        backgroundColor: "#4A6FA5",
        borderRadius: 4,
    },
    timerText: {
        color: "#17285D",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        marginBottom: 30,
        textAlign: "center",
    },
    comboDisplay: {
        backgroundColor: "rgba(39, 174, 96, 0.2)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#27AE60",
    },
    comboText: {
        fontSize: 16,
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