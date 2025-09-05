import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import { styles } from './styles';
import memooi from '../../../assets/memooi.png';
import fundo2 from '../../../assets/fundoquest.jpg';

export default function Step9BemVindo({ navigation}) {
  
    const next = () => {
    navigation.navigate('MainContainer');
  };
  return (
    <ImageBackground source={fundo2} resizeMode="cover" style={styles.background}>
        <View style={styles.container1}>
        {/* Balão de fala */}
        <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Agora sim, seja bem vindo ao nosso aplicativo!!</Text>
        </View>

        <Image
            source={memooi}
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
