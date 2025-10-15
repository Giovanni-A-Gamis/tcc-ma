import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { styles } from './styles';
import fundo2 from '../../../assets/fundoquest.jpg';

export default function Step7Memoria4({ navigation, route }) {
  const [selected, setSelected] = useState(null);
  const formData = route.params?.formData || {};

  const opcoes = [
    { texto: "Quase nunca me sinto sobrecarregado", pontos: 40 },
    { texto: "Às vezes me sinto sobrecarregado", pontos: 80 },
    { texto: "Frequentemente me sinto sobrecarregado", pontos: 120 },
    { texto: "Sempre me sinto sobrecarregado", pontos: 160 },
  ];

  const next = () => {
    if (selected === null) return;
    
    const nivelAtual = formData.nivel_memoria || 0;
    const pontos = opcoes[selected].pontos;
    const novoNivel = Math.min(nivelAtual + pontos, 1000);

    navigation.navigate('Step8Memoria5', {
      formData: { 
        ...formData,
        nivel_memoria: novoNivel,
        perguntas: [
          ...(formData.perguntas || []),
          { pergunta_id: 4, resposta: opcoes[selected].texto }
        ]
      }
    });
  };

  return (
    <ImageBackground source={fundo2} resizeMode="cover" style={styles.background}>
      <ScrollView style={styles.container2} contentContainerStyle={styles.content}>
        <Text style={styles.titulo2}>
          COM QUE FREQUÊNCIA VOCÊ SE SENTE SOBRECARREGADO OU ESTRESSADO?
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
          style={[styles.button, selected === null && { opacity: 0.5 }]} 
          disabled={selected === null} 
          onPress={next}
        >
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
