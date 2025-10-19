// DiarioQuiz.js - Ajustado
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { generateQuestionsFromDiary } from "../../../services/quizGenerator";
import { getDiaries } from "../../../services/diaryService";
import { supabase } from "../../../lib/supabase";

const { width, height } = Dimensions.get("window");

export default function DiarioQuiz({ navigation }) {
    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [correct, setCorrect] = useState(false);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [feedbackColor, setFeedbackColor] = useState("#4A6FA5");

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) return console.error(error);
        setUser(data.user);
        loadDiary(data.user.id);
    }

    async function loadDiary(userId) {
        try {
            const data = await getDiaries(userId);
            if (!data || data.length === 0) {
                setLoading(false);
                return;
            }
            const latest = data[0].conteudo;
            const q = generateQuestionsFromDiary(latest);
            setQuestions(q);
            setLoading(false);
            fadeIn();
        } catch (err) {
            console.error("Erro ao carregar diário:", err);
            setLoading(false);
        }
    }

    const fadeIn = () => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    };

    const handleSelect = (opt) => {
        if (selected) return;
        const question = questions[current];
        setSelected(opt);
        const isCorrect = opt === question.respostaCorreta;
        setCorrect(isCorrect);
        setFeedbackColor(isCorrect ? "#27AE60" : "#E74C3C");

        setTimeout(() => {
            if (current + 1 < questions.length) {
                setCurrent(current + 1);
                setSelected(null);
                setFeedbackColor("#4A6FA5");
                fadeIn();
            } else {
                setFinished(true);
            }
        }, 1200);
    };

    const restart = () => {
        setCurrent(0);
        setSelected(null);
        setCorrect(false);
        setFinished(false);
        setFeedbackColor("#4A6FA5");
        fadeIn();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Animated.View style={styles.loadingAnimation}>
                    <Text style={styles.loadingText}>🧠</Text>
                </Animated.View>
                <Text style={styles.loadingTitle}>Analisando seu diário...</Text>
            </View>
        );
    }

    if (!questions.length) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>📝</Text>
                <Text style={styles.emptyTitle}>Nenhum diário encontrado</Text>
                <Text style={styles.emptySubtitle}>Escreva no diário para gerar perguntas personalizadas</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Diary")}>
                    <Text style={styles.primaryButtonText}>Escrever no Diário</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (finished) {
        return (
            <View style={styles.completionContainer}>
                <Animated.View style={styles.completionAnimation}>
                    <Text style={styles.completionEmoji}>🎉</Text>
                </Animated.View>
                <Text style={styles.completionTitle}>Quiz Concluído!</Text>
                <Text style={styles.completionSubtitle}>Você exercitou sua memória com sucesso</Text>
                
                <TouchableOpacity style={styles.primaryButton} onPress={restart}>
                    <Text style={styles.primaryButtonText}>Refazer Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.secondaryButtonText}>Voltar ao Menu</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const question = questions[current];

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View 
                        style={[
                            styles.progressFill,
                            { width: `${((current + 1) / questions.length) * 100}%` }
                        ]} 
                    />
                </View>
                <Text style={styles.progressText}>
                    {current + 1}/{questions.length}
                </Text>
            </View>

            <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
                <Text style={styles.category}>SEU DIÁRIO</Text>
                <Text style={[styles.question, { color: feedbackColor }]}>
                    {question.pergunta}
                </Text>

                <View style={styles.optionsContainer}>
                    {question.opcoes.map((opt, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.option,
                                selected === opt && {
                                    backgroundColor: correct ? "#27AE60" : "#E74C3C",
                                    transform: [{ scale: selected === opt ? 1.05 : 1 }],
                                },
                            ]}
                            onPress={() => handleSelect(opt)}
                            disabled={selected}
                        >
                            <Text style={[
                                styles.optionText,
                                selected === opt && styles.optionTextSelected
                            ]}>
                                {opt}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
        padding: 24,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#F0F4F8",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingAnimation: {
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 64,
        color: "#17285D",
    },
    loadingTitle: {
        fontSize: 20,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
        textAlign: "center",
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: "#F0F4F8",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    emptyEmoji: {
        fontSize: 64,
        color: "#17285D",
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtitle: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "#4A6FA5",
        textAlign: "center",
        marginBottom: 32,
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: "#D8E2EC",
        borderRadius: 3,
        marginRight: 12,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#4A6FA5",
        borderRadius: 3,
    },
    progressText: {
        fontSize: 14,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
    },
    questionContainer: {
        flex: 1,
        justifyContent: "center",
    },
    category: {
        fontSize: 14,
        fontFamily: "Poppins_700Bold",
        color: "#4A6FA5",
        textAlign: "center",
        marginBottom: 8,
        letterSpacing: 2,
    },
    question: {
        fontSize: 28,
        fontFamily: "Poppins_700Bold",
        textAlign: "center",
        marginBottom: 48,
        lineHeight: 36,
        color: "#17285D",
    },
    optionsContainer: {
        width: "100%",
    },
    option: {
        backgroundColor: "#E8EEF4",
        padding: 20,
        borderRadius: 16,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: "#D8E2EC",
    },
    optionText: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#17285D",
        textAlign: "center",
    },
    optionTextSelected: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    completionContainer: {
        flex: 1,
        backgroundColor: "#F0F4F8",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    completionAnimation: {
        marginBottom: 24,
    },
    completionEmoji: {
        fontSize: 80,
        color: "#17285D",
    },
    completionTitle: {
        fontSize: 32,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 8,
        textAlign: "center",
    },
    completionSubtitle: {
        fontSize: 18,
        fontFamily: "Poppins_400Regular",
        color: "#4A6FA5",
        textAlign: "center",
        marginBottom: 48,
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