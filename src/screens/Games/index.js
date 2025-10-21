import React, { useEffect, useState, useRef } from "react";
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    ImageBackground, 
    ActivityIndicator,
    Animated,
    Dimensions 
} from "react-native";
import { styles } from "./styles";
import { getGames } from "../../services/gameService";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const { width } = Dimensions.get('window');

export default function GameScreen({ navigation }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fadeAnim] = useState(new Animated.Value(0));
    const animationRef = useRef(null);

    // ADICIONE ESTE HOOK AQUI
    useFocusEffect(
        useCallback(() => {
            // Resetar e rodar a animação quando a tela ganhar foco
            if (animationRef.current) {
                setTimeout(() => {
                    animationRef.current.reset();
                    animationRef.current.play();
                }, 100);
            }

            return () => {
                // Limpeza opcional quando a tela perder foco
            };
        }, [])
    );

    useEffect(() => {
        async function fetchGames() {
            const data = await getGames();
            setGames(data || []);
            setLoading(false);
            
            // Animação de entrada
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }
        fetchGames();
    }, []);

    const getDifficultyColor = (dificuldade) => {
        switch (dificuldade?.toLowerCase()) {
            case 'facil': return '#4CAF50';
            case 'medio': return '#FF9800';
            case 'dificil': return '#F44336';
            default: return '#666';
        }
    };

    const getDifficultyIcon = (dificuldade) => {
        switch (dificuldade?.toLowerCase()) {
            case 'facil': return '🌱';
            case 'medio': return '🚀';
            case 'dificil': return '💪';
            default: return '🎮';
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
                <ActivityIndicator size="large" color="#17285D" />
                <Text style={styles.loadingText}>Carregando jogos...</Text>
            </View>
        );
    }

    return (
        <Animated.ScrollView 
            style={[styles.container, { opacity: fadeAnim }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Vamos Treinar sua Mente! 🧠</Text>
                    <Text style={styles.subtitle}>
                        Escolha um jogo e fortaleça sua memória
                    </Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Ionicons name="game-controller" size={20} color="#17285D" />
                        <Text style={styles.statText}>{games.length} jogos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="trending-up" size={20} color="#27ae60" />
                        <Text style={styles.statText}>Progresso diário</Text>
                    </View>
                </View>
            </View>

            <View style={styles.spacer}>
                <LottieView
                    ref={animationRef}
                    source={require('../../../assets/animations/hide_memu.json')}
                    autoPlay
                    loop={false}
                    style={styles.animation}
                    onAnimationFinish={() => {
                        console.log('Animação finalizada - mantendo último frame');
                    }}
                />
            </View>

            {/* Games Grid */}
            <View style={styles.gamesGrid}>
                {games.map((game, index) => (
                    <TouchableOpacity
                        key={game.id}
                        style={styles.gameCard}
                        onPress={() => navigation.navigate("GameIntro", { jogo: game })}
                        activeOpacity={0.9}
                    >
                        <ImageBackground
                            source={{ uri: game.img_url }}
                            style={styles.gameCardImage}
                            imageStyle={styles.gameCardImageStyle}
                        >
                            {/* Overlay Gradiente */}
                            <View style={styles.gradientOverlay} />
                            
                            {/* Conteúdo do Card */}
                            <View style={styles.gameCardContent}>
                                {/* Dificuldade */}
                                <View style={[
                                    styles.difficultyBadge,
                                    { backgroundColor: getDifficultyColor(game.nivel_dificuldade) }
                                ]}>
                                    <Text style={styles.difficultyIcon}>
                                        {getDifficultyIcon(game.nivel_dificuldade)}
                                    </Text>
                                    <Text style={styles.difficultyText}>
                                        {game.nivel_dificuldade || 'Normal'}
                                    </Text>
                                </View>

                                {/* Informações do Jogo */}
                                <View style={styles.gameInfo}>
                                    <Text style={styles.gameName}>{game.nome}</Text>
                                    <Text style={styles.gameCategory}>{game.categoria}</Text>
                                    
                                    {game.descricao && (
                                        <Text style={styles.gameDescription} numberOfLines={2}>
                                            {game.descricao}
                                        </Text>
                                    )}
                                </View>

                                {/* Botão de Ação */}
                                <View style={styles.playButton}>
                                    <Ionicons name="play-circle" size={24} color="#fff" />
                                    <Text style={styles.playButtonText}>Jogar</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Footer Motivacional */}
            <View style={styles.footer}>
                <Ionicons name="bulb" size={24} color="#FFD700" />
                <Text style={styles.footerText}>
                    Pratique pelo menos 15 minutos ao dia para manter sua mente ativa!
                </Text>
            </View>           
        </Animated.ScrollView>
    );
}