import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function GamePlaceholder({ navigation, route }) {
    const { nome } = route.params;

    return (
        <View style={styles.container}>
        <Text style={styles.title}>{nome}</Text>
        <Text style={styles.subtitle}>Aqui será o conteúdo do jogo {nome}</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Voltar ao menu</Text>
        </TouchableOpacity>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f9fb",
        padding: 20,
    },
    title: {
        fontSize: 26,
        color: "#17285D",
        fontFamily: "Poppins_700Bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        fontFamily: "Poppins_400Regular",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#8ec0c7",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    buttonText: {
        color: "#17285D",
        fontFamily: "Poppins_700Bold",
        fontSize: 16,
    },
});
