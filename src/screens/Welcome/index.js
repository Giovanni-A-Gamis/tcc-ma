import React, { useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image,  
    TouchableOpacity, 
    ImageBackground,
    Animated
} from 'react-native';
import { useFonts } from '@expo-google-fonts/poppins';
import { styles } from './styles';

export default function WelcomeScreen({ navigation }) {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular: require('../../../assets/fonts/Poppins-Regular.ttf'),
        Poppins_700Bold: require('../../../assets/fonts/Poppins-Bold.ttf'),
    });
    
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