import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

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
                Textos que direcionam para o guia
            </Text>
        </View>

        </ScrollView>
    </SafeAreaView>
    );
}
