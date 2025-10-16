import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "./styles";

export default function GameIntro({ navigation, route }) {
    const { jogo } = route.params;

    return (
        <ScrollView style={styles.container}>
            <ImageBackground
                source={{ uri: jogo.img_url }}
                style={styles.image}
                imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
            >
                <View style={styles.overlay}>
                    <Text style={styles.gameTitle}>{jogo.nome}</Text>
                </View>
            </ImageBackground>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Descrição</Text>
                <Text style={styles.description}>{jogo.descricao || "Sem descrição disponível."}</Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Dificuldade:</Text> {jogo.nivel_dificuldade}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Categoria:</Text> {jogo.categoria}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        if (jogo.nome === "Jogo da memória") {
                            navigation.navigate("MemoryPairs");
                        } else if (jogo.nome === "Sequência Atencional") {
                            navigation.navigate("SequenceMemory");
                        } else if (jogo.nome === "Quebra-Código") {
                            navigation.navigate("QuebraCodigo");
                        } else if (jogo.nome === "Palavras Fugitivas") {
                            navigation.navigate("PalavrasFugidias");
                        }
                        else {
                            navigation.navigate("GamePlaceholder", { nome: jogo.nome });
                        }

                    }}

                >
                    <Text style={styles.buttonText}>Iniciar Jogo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.buttonText, styles.secondaryText]}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}


