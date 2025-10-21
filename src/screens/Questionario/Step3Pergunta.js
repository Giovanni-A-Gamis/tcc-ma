import { View, Text, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { styles } from './styles';
import fundo2 from '../../../assets/fundoquest.jpg';
import LottieView from 'lottie-react-native';

export default function Step3Pergunta({ navigation, route }) { 
    const next = () => {
        navigation.navigate('Step4Memoria1', { formData: route.params?.formData });
    };
    
    return (
        <ImageBackground source={fundo2} resizeMode="cover" style={styles.background}>
            <View style={styles.container1}>
            {/* Balão de fala */}
            <View style={styles.speechBubble}>
                <Text style={styles.speechText}>É hora de responder umas perguntinhas ...</Text>
            </View>

            <LottieView
                source={require('../../../assets/animations/reading_memu.json')}
                autoPlay
                loop
                style={styles.animation}
            />

                <TouchableOpacity style={styles.button} onPress={next}>
                    <Text style={styles.buttonText}>Próximo</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}