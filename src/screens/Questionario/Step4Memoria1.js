import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { styles } from './styles';
import fundo2 from '../../../assets/fundoquest.jpg';

export default function Step4Memoria1({ navigation, route }) {
  const [selected, setSelected] = useState(null);
  const formData = route.params?.formData || {};
  const opcoes = [
    { texto: "Menos de 4 horas", pontos: 40 },
    { texto: "De 4 a 5 horas", pontos: 80 },
    { texto: "De 6 a 7 horas", pontos: 150 },
    { texto: "De 8 a 9 horas", pontos: 180 },
    { texto: "Mais de 9 horas", pontos: 100 }
  ];

  const next = () => {
    if (selected === null) return;
    
    // soma pontos ao nível de memória acumulado
    const nivelAtual = formData.nivel_memoria || 0;
    const pontos = opcoes[selected].pontos;
    const novoNivel = Math.min(nivelAtual + pontos, 1000); // limite de 1000
    
    navigation.navigate('Step5Memoria2', {
      formData: { 
        ...formData,
        nivel_memoria: novoNivel,
        perguntas: [
          ...(formData.perguntas || []),
          { pergunta_id: 1, resposta: opcoes[selected].texto }
        ]
      }
    });
  };

  // Verifica se alguma opção foi selecionada (incluindo a primeira)
  const isSelected = selected !== null;

  return (
    <ImageBackground source={fundo2} resizeMode="cover" style={styles.background}>
      <ScrollView style={styles.container2} contentContainerStyle={styles.content}>
        <Text style={styles.titulo2}>QUANTAS HORAS VOCÊ DORME POR DIA?</Text>

        <View style={styles.lista}>
          {opcoes.map((opcao, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.checkboxContainer,
                selected === index && styles.selectedOption
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
          style={[styles.button, !isSelected && { opacity: 0.5 }]} 
          disabled={!isSelected} 
          onPress={next}
        >
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}