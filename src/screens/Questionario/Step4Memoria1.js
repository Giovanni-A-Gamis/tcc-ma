import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import { styles } from './styles';
import fundo2 from '../../../assets/fundoquest.jpg';

export default function Step4Memoria1({ navigation}) {
  
    const [selected, setSelected] = useState([]);

    const opcoes = [
        "Insônia ou agitação noturna",
        "Desorientação do tempo e espaço",
        "Dificuldade em reconhecer pessoas",
        "Alterações comportamentais",
        "Dificuldade em manter a atenção",
        "Perco objetos facilmente"
    ];

    const toggleOpcao = (item) => {
        if (selected.includes(item)) {
        setSelected(selected.filter(op => op !== item));
        } else {
        setSelected([...selected, item]);
        }
    };

    const next = () => {
    navigation.navigate('Step5Memoria2');
  };
  
  return (
    <ImageBackground source={fundo2} resizeMode="cover" style={styles.background}>
        <ScrollView 
        style={styles.container2}
        contentContainerStyle={styles.content}
        >
      <Text style={styles.titulo2}>
        MARQUE QUAIS DELAS VOCÊ MAIS SENTE
      </Text>

    <View style={styles.lista}>
        {opcoes.map((opcao, index) => (
            <TouchableOpacity 
            key={index} 
            style={styles.checkboxContainer} 
            onPress={() => toggleOpcao(opcao)}
            >
            <View style={[styles.checkbox, selected.includes(opcao) && styles.checkboxMarcado]} />
            <Text style={styles.texto2}>{opcao}</Text>
            </TouchableOpacity>
        ))}
    </View>

            <TouchableOpacity style={styles.button} onPress={next}>
                <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
        </ScrollView>
    </ImageBackground>

  );
}

