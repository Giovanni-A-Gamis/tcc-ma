import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { getGames } from "../../services/gameService";

export default function GameScreen({ navigation }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGames() {
        const data = await getGames();
        setGames(data || []);
        setLoading(false);
        }
        fetchGames();
    }, []);

    if (loading) {
        return (
        <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
            <ActivityIndicator size="large" color="#17285D" />
            <Text style={{ marginTop: 10 }}>Carregando jogos...</Text>
        </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
        <Text style={styles.title}>Vamos treinar essa cuca!</Text>

        {games.map((game) => (
            <TouchableOpacity
            key={game.id}
            style={styles.card}
            onPress={() => navigation.navigate("GameIntro", { jogo: game })}
            >
            <ImageBackground
                source={{ uri: game.img_url }}
                style={styles.cardImage}
                imageStyle={{ borderRadius: 12 }}
            >
                <View style={styles.overlay}>
                <Text style={styles.cardTitle}>{game.nome}</Text>
                <Text style={styles.cardSubtitle}>{game.categoria}</Text>
                </View>
            </ImageBackground>
            </TouchableOpacity>
        ))}
        </ScrollView>
    );
}
