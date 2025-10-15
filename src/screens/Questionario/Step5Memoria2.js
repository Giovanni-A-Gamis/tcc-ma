import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { styles } from './styles';
import fundo2 from '../../../assets/fundoquest.jpg';

export default function Step5Memoria2({ navigation, route }) {
  const [selected, setSelected] = useState(null);
  const formData = route.params?.formData || {};

  const opcoes = [
    { texto: "Sempre tenho dificuldade", pontos: 40 },
    { texto: "Frequentemente tenho dificuldade", pontos: 80 },
    { texto: "Às vezes tenho dificuldade", pontos: 120 },
    { texto: "Raramente tenho dificuldade", pontos: 160 },
    { texto: "Nunca tenho dificuldade", pontos: 200 },
  ];

  const next = () => {
    if (selected === null) return;
    
    const nivelAtual = formData.nivel_memoria || 0;
    const pontos = opcoes[selected].pontos;
    const novoNivel = Math.min(nivelAtual + pontos, 1000); // limite de 1000 pontos no início

    navigation.navigate('Step6Memoria3', {
      formData: { 
        ...formData,
        nivel_memoria: novoNivel,
        perguntas: [
          ...(formData.perguntas || []),
          { pergunta_id: 2, resposta: opcoes[selected].texto }
        ]
      }
    });
  };

  return (
    <ImageBackground source={fundo2} resizeMode="cover" style={styles.background}>
      <ScrollView style={styles.container2} contentContainerStyle={styles.content}>
        <Text style={styles.titulo2}>
          COM QUE FREQUÊNCIA VOCÊ TEM DIFICULDADE DE SE CONCENTRAR?
        </Text>

        <View style={styles.lista}>
          {opcoes.map((opcao, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.checkboxContainer,
                selected === index
              ]}
              onPress={() => setSelected(index)}
            >
              <View style={[
                styles.checkbox,
                selected === index && { backgroundColor: '#8ec0c7', borderColor: '#17285D' }
              ]} />
              <Text style={styles.texto2}>{opcao.texto}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.button, !selected && { opacity: 0.5 }]} 
          disabled={!selected} 
          onPress={next}
        >
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
