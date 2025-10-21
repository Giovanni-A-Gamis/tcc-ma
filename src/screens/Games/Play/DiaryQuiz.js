// DiarioQuiz.js - com tela de vitória estilo MemoryPairs
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
    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        try {
            const res = await supabase.auth.getUser();
            const u = res?.data?.user ?? res?.user ?? null;
            if (!u) {
                setLoading(false);
                return;
            }
            setUser(u);
            await loadDiary(u.id);
        } catch (err) {
            console.error("Erro ao obter usuário:", err);
            setLoading(false);
        }
    }

    async function loadDiary(userId) {
        try {
            const data = await getDiaries(userId);
            if (!Array.isArray(data) || data.length === 0) {
                setLoading(false);
                return;
            }
            const latest = data[0].conteudo ?? "";
            const q = generateQuestionsFromDiary(latest) ?? [];
            const normalized = q.map(item => ({
                pergunta: item.pergunta ?? "",
                opcoes: Array.isArray(item.opcoes) ? item.opcoes : [],
                respostaCorreta: ("respostaCorreta" in item) ? item.respostaCorreta : null,
            }));
            setQuestions(normalized);
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

    const optionToString = (opt) => {
        if (opt === null || opt === undefined) return "";
        if (typeof opt === "string") return opt;
        if (typeof opt === "number") return String(opt);
        if (typeof opt === "object") {
            return opt.text ?? opt.label ?? JSON.stringify(opt);
        }
        return String(opt);
    };

    const getCorrectAnswerString = (question) => {
        const rc = question?.respostaCorreta;
        if (rc === null || rc === undefined) return null;
        if (typeof rc === "number") return optionToString(question.opcoes?.[rc]);
        if (typeof rc === "string") return rc;
        if (typeof rc === "object") return optionToString(rc);
        return String(rc);
    };

    const handleSelect = (opt) => {
        if (selected !== null) return;

        const question = questions[current];
        if (!question) return;

        const chosen = optionToString(opt);
        const correctAnswer = getCorrectAnswerString(question);

        setSelected(opt);
        const isCorrect = correctAnswer !== null ? chosen === correctAnswer : false;
        setCorrect(isCorrect);
        setFeedbackColor(isCorrect ? "#27AE60" : "#E74C3C");

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            if (current + 1 < questions.length) {
                setCurrent(prev => prev + 1);
                setSelected(null);
                setCorrect(false);
                setFeedbackColor("#4A6FA5");
                fadeIn();
            } else {
                setFinished(true);
            }
        }, 1200);
    };

    const restart = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setCurrent(0);
        setSelected(null);
        setCorrect(false);
        setFinished(false);
        setFeedbackColor("#4A6FA5");
        fadeIn();
    };

    const goBack = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        navigation.goBack();
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

    if (!questions || questions.length === 0) {
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

    // NOVA TELA DE VITÓRIA ESTILO MEMORYPAIRS
    if (finished) {
        return (
            <View style={styles.overlay}>
                <View style={styles.winContainer}>
                    <Text style={styles.winText}>🎉 Parabéns!</Text>
                    <Text style={styles.winSubtitle}>Você completou o quiz!</Text>

                    <TouchableOpacity 
                        style={styles.primaryButton} 
                        onPress={restart}
                    >
                        <Text style={styles.primaryButtonText}>Jogar Novamente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.secondaryButton} 
                        onPress={goBack}
                    >
                        <Text style={styles.secondaryButtonText}>Voltar ao Menu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const question = questions[current];
    if (!question) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>❓</Text>
                <Text style={styles.emptyTitle}>Pergunta não encontrada</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={restart}>
                    <Text style={styles.primaryButtonText}>Recomeçar</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                    {question.opcoes && question.opcoes.map((opt, i) => {
                        const optText = optionToString(opt);
                        const isSelected = selected !== null && optionToString(selected) === optText;
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.option,
                                    isSelected && {
                                        backgroundColor: correct ? "#27AE60" : "#E74C3C",
                                        transform: [{ scale: isSelected ? 1.05 : 1 }],
                                    },
                                ]}
                                onPress={() => handleSelect(opt)}
                                disabled={selected !== null}
                            >
                                <Text style={[
                                    styles.optionText,
                                    isSelected && styles.optionTextSelected
                                ]}>
                                    {optText}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
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

    // 🎉 Estilos da tela de vitória (do MemoryPairs)
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
    winContainer: {
        backgroundColor: "#FFFFFF",
        padding: 30,
        borderRadius: 20,
        alignItems: "center",
        width: "100%",
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    winText: {
        fontSize: 32,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 8,
        textAlign: "center",
    },
    winSubtitle: {
        fontSize: 18,
        fontFamily: "Poppins_400Regular",
        color: "#4A6FA5",
        marginBottom: 30,
        textAlign: "center",
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
