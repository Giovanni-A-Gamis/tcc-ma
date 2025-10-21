import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Vibration } from "react-native";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 80) / 4;

const emojis = ["🧠", "🌟", "⚡", "🎯", "💡", "🎨"];

export default function MemoryPairs({ navigation }) {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const flipAnimations = useRef({});

    // Inicializa o jogo
    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const selectedEmojis = emojis.slice(0, 6);
        
        const duplicated = [...selectedEmojis, ...selectedEmojis]
            .sort(() => Math.random() - 0.5)
            .map((item, index) => ({ 
                id: index, 
                emoji: item,
                flipAnim: new Animated.Value(0)
            }));
        
        setCards(duplicated);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setGameStarted(false);
        setIsProcessing(false);
        
        // Inicializa as animações
        duplicated.forEach(card => {
            flipAnimations.current[card.id] = card.flipAnim;
        });

        // Mostra todas as cartas brevemente no início
        setTimeout(() => {
            const allIds = duplicated.map(card => card.id);
            setFlipped(allIds);
            
            // Anima para mostrar as cartas
            allIds.forEach(id => {
                Animated.spring(flipAnimations.current[id], {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }).start();
            });
            
            setTimeout(() => {
                // Vira as cartas de volta
                allIds.forEach(id => {
                    Animated.spring(flipAnimations.current[id], {
                        toValue: 0,
                        friction: 8,
                        tension: 40,
                        useNativeDriver: true,
                    }).start();
                });
                setTimeout(() => {
                    setFlipped([]);
                    setGameStarted(true);
                }, 500);
            }, 2000);
        }, 500);
    };

    const flipCard = async (card) => {
        if (!gameStarted || isProcessing) return;
        if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) return;

        setIsProcessing(true);

        // Animação de virar
        Animated.spring(flipAnimations.current[card.id], {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();

        const newFlipped = [...flipped, card.id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            const [first, second] = newFlipped.map(id => cards.find(c => c.id === id));

            if (first.emoji === second.emoji) {
                // Acertou - cartas ficam viradas
                setMatched(prev => [...prev, first.id, second.id]);
                Vibration.vibrate(50);
                setTimeout(() => {
                    setFlipped([]);
                    setIsProcessing(false);
                }, 500);
            } else {
                // Errou - cartas viram de volta após 1 segundo
                Vibration.vibrate(100);
                setTimeout(() => {
                    newFlipped.forEach(id => {
                        Animated.spring(flipAnimations.current[id], {
                            toValue: 0,
                            friction: 8,
                            tension: 40,
                            useNativeDriver: true,
                        }).start();
                    });
                    setTimeout(() => {
                        setFlipped([]);
                        setIsProcessing(false);
                    }, 500);
                }, 1000);
            }
        } else {
            setIsProcessing(false);
        }
    };

    const getCardStyle = (card) => {
        const rotateY = flipAnimations.current[card.id]?.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        }) || '0deg';

        return {
            transform: [{ rotateY }],
        };
    };

    const getCardContent = (card) => {
        const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
        
        return isFlipped ? card.emoji : "?";
    };

    const allMatched = matched.length === cards.length && cards.length > 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.moves}>Movimentos: {moves}</Text>
            </View>

            <View style={styles.grid}>
                {cards.map((card) => {
                    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                    
                    return (
                        <TouchableOpacity
                            key={card.id}
                            onPress={() => flipCard(card)}
                            disabled={!gameStarted || isProcessing}
                            activeOpacity={0.7}
                        >
                            <Animated.View style={[styles.cardContainer, getCardStyle(card)]}>
                                <View style={[
                                    styles.card, 
                                    isFlipped ? styles.cardFront : styles.cardBack
                                ]}>
                                    <Text style={styles.cardText}>
                                        {getCardContent(card)}
                                    </Text>
                                </View>
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {!gameStarted && (
                <View style={styles.messageContainer}>
                    <Text style={styles.message}>Memorize as cartas...</Text>
                </View>
            )}

            {allMatched && (
                <View style={styles.overlay}>
                    <View style={styles.winContainer}>
                        <Text style={styles.winText}>🎉 Parabéns!</Text>
                        <Text style={styles.winSubtitle}>Você completou em {moves} movimentos</Text>

                <View style={styles.spacer}>
                    <LottieView
                        source={require('../../../../assets/animations/dsg_memu.json')}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                </View>                        
                        
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={initializeGame}
                        >
                            <Text style={styles.primaryButtonText}>Jogar Novamente</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.secondaryButton} 
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.secondaryButtonText}>Voltar ao Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
        padding: 20,
        justifyContent: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        textAlign: "center",
        marginBottom: 8,
    },
    moves: {
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        color: "#4A6FA5",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 12,
    },
    cardContainer: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 12,
    },
    card: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        borderWidth: 3,
        shadowColor: "#17285D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        backfaceVisibility: 'hidden',
    },
    cardFront: {
        backgroundColor: "#4A6FA5",
        borderColor: "#17285D",
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cardBack: {
        backgroundColor: "#E8EEF4",
        borderColor: "#D8E2EC",
    },
    cardText: {
        fontSize: CARD_SIZE * 0.4,
        color: "#FFFFFF",
    },
    messageContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    message: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
        color: "#4A6FA5",
        textAlign: "center",
    },
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
    animation: {
        width: 230,
        height: 600,
        marginTop: -200,
        marginBottom: -150,
    },
    spacer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});