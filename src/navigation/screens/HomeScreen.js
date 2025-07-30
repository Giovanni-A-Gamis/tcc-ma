import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Sugestão de Jogos */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Jogos recomendados</Text>
            <Text style={styles.cardText}>
                Seleção de jogos
            </Text>
        </View>

        {/* Jogo de hoje */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Jogo de hoje</Text>
            <Text style={styles.cardText}>
                Ícone do jogo e o botão que vai pro jogo
            </Text>
        </View>

        {/* Você sabia? */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Você sabia?</Text>
            <Text style={styles.cardText}>
                Texto que direcionam para o guia
            </Text>
        </View>

        </ScrollView>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    scrollContent: {
        padding: 16,
    },
    memo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    card: {
        backgroundColor: '#FFF',
        padding: 16,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    cardText: {
        fontSize: 16,
        color: '#555',
    },
});
