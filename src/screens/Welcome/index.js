import React, { useRef, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Image,
    TouchableOpacity, 
    ImageBackground,
    Animated
} from 'react-native';
import { useFonts } from 'expo-font';
import LottieView from 'lottie-react-native';
import { styles } from './styles';

export default function WelcomeScreen({ navigation }) {
    const [showWelcome, setShowWelcome] = useState(false);
    const [animationError, setAnimationError] = useState(false);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const [fontsLoaded] = useFonts({
        'Poppins_400Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins_500Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins_600SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
        'Poppins_700Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
    });

    useEffect(() => {
        const startTimer = setTimeout(() => {
            setShowWelcome(true);
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ]).start();
        }, 5000);

        return () => clearTimeout(startTimer);
    }, []);

    if (!showWelcome || !fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <LottieView
                    source={require('../../../assets/animations/start_screenAnim.json')}
                    autoPlay
                    loop
                    style={styles.loadingAnimation}
                />
            </View>
        );
    }

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
                {/* Substitua a animação problemática pela imagem estática */}
                <Image 
                    source={require('../../../assets/logocnome.png')} 
                    style={styles.logoAnimation} 
                />

                <TouchableOpacity 
                    style={styles.buttonPrimary}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonTextPrimary}>Fazer Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonSecondary}
                    onPress={() => navigation.navigate('Step1Login')}
                >
                    <Text style={styles.buttonTextSecondary}>
                        Primeira vez? Clique aqui
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </ImageBackground>
    );
}