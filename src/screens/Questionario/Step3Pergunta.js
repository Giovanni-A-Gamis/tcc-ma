import { View, Text, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import { styles } from './styles';
import memoduvida from '../../../assets/memoduvida.png';
import fundo2 from '../../../assets/fundoquest.jpg';

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

            <Image
                source={memoduvida}
                style={styles.image}
                resizeMode="contain"
            />
                <TouchableOpacity style={styles.button} onPress={next}>
                    <Text style={styles.buttonText}>Próximo</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>

    );
}
