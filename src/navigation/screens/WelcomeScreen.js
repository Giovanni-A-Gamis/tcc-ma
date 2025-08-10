import React, { useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    TouchableOpacity, 
    ImageBackground,
    Animated
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Opacidade
    const slideAnim = useRef(new Animated.Value(50)).current; // Posição Y

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <ImageBackground 
            source={require('../../../assets/bg.jpg')}
            style={styles.background}
        >
            <View style={styles.overlay} />

            <Animated.View 
                style={[styles.content, { 
                    opacity: fadeAnim, 
                    transform: [{ translateY: slideAnim }]
                }]}
            >
                <Image 
                    source={require('../../../assets/logocnome.png')} 
                    style={styles.logo} 
                />

                <TouchableOpacity 
                    style={styles.buttonPrimary}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonTextPrimary}>Fazer Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonSecondary}
                    onPress={() => navigation.navigate('Questionario')}
                >
                    <Text style={styles.buttonTextSecondary}>
                        Primeira vez? Clique aqui
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)', // Escurece a imagem
    },
    content: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
    },
    logo: {
        width: 325,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    buttonPrimary: {
        backgroundColor: '#FFF',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 5,
        elevation: 2,
    },
    buttonTextPrimary: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonSecondary: {
        paddingVertical: 14,
        paddingHorizontal: 40,
    },
    buttonTextSecondary: {
        color: '#000',
        fontSize: 16,
    }
});
