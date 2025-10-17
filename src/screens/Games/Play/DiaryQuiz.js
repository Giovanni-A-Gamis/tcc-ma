import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { generateQuestionsFromDiary } from "../../../services/quizGenerator";
import { getDiaries } from "../../../services/diaryService";
import { supabase } from "../../../lib/supabase";

export default function DiarioQuiz({ navigation }) {
    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [correct, setCorrect] = useState(false);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [feedbackColor, setFeedbackColor] = useState("#17285D");

    // Carrega o usuário e gera as perguntas com base no último diário
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

    // Animação suave de entrada de pergunta
    const fadeIn = () => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        }).start();
    };

    // Escolha de resposta
    const handleSelect = (opt) => {
        if (selected) return; // impede duplo clique
        const question = questions[current];
        setSelected(opt);
        const isCorrect = opt === question.respostaCorreta;
        setCorrect(isCorrect);
        setFeedbackColor(isCorrect ? "#27ae60" : "#e74c3c");

        setTimeout(() => {
        if (current + 1 < questions.length) {
            setCurrent(current + 1);
            setSelected(null);
            setFeedbackColor("#17285D");
            fadeIn();
        } else {
            setFinished(true);
        }
        }, 1000);
    };

    // Reiniciar quiz
    const restart = () => {
        setCurrent(0);
        setSelected(null);
        setCorrect(false);
        setFinished(false);
        setFeedbackColor("#17285D");
        fadeIn();
    };

    // Tela de loading
    if (loading) {
        return (
        <View style={styles.container}>
            <Text style={styles.title}>Gerando quiz do seu diário...</Text>
        </View>
        );
    }

    // Caso não tenha diário
    if (!questions.length) {
        return (
        <View style={styles.container}>
            <Text style={styles.title}>Nenhum diário recente encontrado 😕</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Diary")}>
            <Text style={styles.buttonText}>Escrever no Diário</Text>
            </TouchableOpacity>
        </View>
        );
    }

    // Tela final
    if (finished) {
        return (
        <View style={styles.overlay}>
            <Text style={styles.winText}>Você completou o Quiz! 🧠</Text>

            <TouchableOpacity style={styles.buttonWhite} onPress={restart}>
            <Text style={styles.buttonTextBlue}>Jogar novamente</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.buttonWhite, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
            >
            <Text style={styles.buttonTextWhite}>Voltar ao menu</Text>
            </TouchableOpacity>
        </View>
        );
    }

    // Pergunta atual
    const question = questions[current];

    return (
        <View style={styles.container}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: "center", width: "100%" }}>
            <Text style={[styles.title, { color: feedbackColor }]}>
            {question.pergunta}
            </Text>

            <View style={styles.options}>
            {question.opcoes.map((opt, i) => (
                <TouchableOpacity
                key={i}
                style={[
                    styles.option,
                    selected === opt && {
                    backgroundColor: correct ? "#27ae60" : "#e74c3c",
                    transform: [{ scale: 1.05 }],
                    },
                ]}
                onPress={() => handleSelect(opt)}
                activeOpacity={0.8}
                >
                <Text
                    style={[
                    styles.optionText,
                    selected === opt && { color: "#fff", fontWeight: "700" },
                    ]}
                >
                    {opt}
                </Text>
                </TouchableOpacity>
            ))}
            </View>

            <Text style={styles.progressText}>
            Pergunta {current + 1} de {questions.length}
            </Text>
        </Animated.View>
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
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        textAlign: "center",
        marginBottom: 30,
    },
    options: {
        width: "100%",
        alignItems: "center",
    },
    option: {
        backgroundColor: "#8ec0c7",
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 14,
        marginVertical: 8,
        width: "90%",
        alignItems: "center",
        elevation: 2,
    },
    optionText: {
        color: "#17285D",
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
    },
    progressText: {
        marginTop: 25,
        color: "#444",
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
    },
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(23,40,93,0.9)",
        padding: 20,
    },
    winText: {
        color: "#fff",
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
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
    button: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 20,
        marginTop: 20,
    },
    buttonText: {
        color: "#17285D",
        fontFamily: "Poppins_700Bold",
        fontSize: 16,
    },
});
