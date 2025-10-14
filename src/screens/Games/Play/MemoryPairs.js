import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const emojis = ["🧠", "🐶", "🍎", "🚗", "🎵", "🌟", "⚽", "📚"];

export default function MemoryPairs({ navigation }) {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        // Cria um baralho duplicado e embaralhado
        const duplicated = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((item, index) => ({ id: index, emoji: item }));
        setCards(duplicated);
    }, []);

    const handleFlip = (card) => {
        if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) return;

        const newFlipped = [...flipped, card.id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves((prev) => prev + 1);

            const [first, second] = newFlipped.map((id) => cards.find((c) => c.id === id));

            if (first.emoji === second.emoji) {
                setMatched((prev) => [...prev, first.id, second.id]);
            }

            setTimeout(() => setFlipped([]), 700);
        }
    };

    const resetGame = () => {
        const duplicated = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((item, index) => ({ id: index, emoji: item }));
        setCards(duplicated);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
    };

    const allMatched = matched.length === cards.length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Jogo da Memória 🧠</Text>
            <Text style={styles.subtitle}>Movimentos: {moves}</Text>

            <View style={styles.grid}>
                {cards.map((card) => {
                    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                    return (
                        <TouchableOpacity
                            key={card.id}
                            style={[styles.card, isFlipped && styles.cardFlipped]}
                            onPress={() => handleFlip(card)}
                        >
                            <Text style={styles.cardText}>
                                {isFlipped ? card.emoji : "❓"}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {allMatched && (
                <View style={styles.overlay}>
                    <Text style={styles.winText}>Você concluiu!</Text>
                    <TouchableOpacity style={styles.button} onPress={resetGame}>
                        <Text style={styles.buttonText}>Jogar novamente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={[styles.buttonText, styles.secondaryText]}>
                            Voltar ao menu
                        </Text>
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
        padding: 10,
    },
    title: {
        fontSize: 26,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "#444",
        marginBottom: 15,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
    },
    card: {
        width: 70,
        height: 70,
        backgroundColor: "#8ec0c7",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    cardFlipped: {
        backgroundColor: "#fefefe",
    },
    cardText: {
        fontSize: 32,
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
    button: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginVertical: 5,
    },
    secondaryButton: {
        backgroundColor: "#8ec0c7",
    },
    buttonText: {
        color: "#17285D",
        fontFamily: "Poppins_700Bold",
        fontSize: 16,
    },
    secondaryText: {
        color: "#fff",
    },
});
