import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground, Alert } from 'react-native';
import { styles } from './styles';
import fundo2 from '../../../assets/fundoquest.jpg';

export default function Laudo({ navigation, route }) {
    const [selected, setSelected] = useState(null);
    const [detalhes, setDetalhes] = useState('');

    const formData = route.params?.formData || {};

    const opcoes = [
        { texto: "Não", pontos: 200 },
        { texto: "Sim, leve", pontos: 160 },
        { texto: "Sim, moderado", pontos: 120 },
        { texto: "Sim, grave", pontos: 80 },
    ];

    const next = () => {
        if (selected === null) return;

        const nivelAtual = formData.nivel_memoria || 0;
        const pontos = opcoes[selected].pontos;
        const novoNivel = Math.min(nivelAtual + pontos, 1000);

        // Se escolher "Sim", validar se há detalhes
        if (selected !== 0 && detalhes.trim() === '') {
            Alert.alert('Atenção', 'Por favor descreva os detalhes do seu déficit cognitivo.');
            return;
        }

        const novoFormData = { 
            ...formData,
            nivel_memoria: novoNivel,
            perguntas: [
                ...(formData.perguntas || []),
                { pergunta_id: 6, resposta: opcoes[selected].texto }
            ],
            deficit: selected === 0 ? 'Não' : opcoes[selected].texto,
            deficit_details: selected === 0 ? null : detalhes
        };

        console.log('📋 Dados do Laudo para Step9BemVindo:', {
            deficit: novoFormData.deficit,
            deficit_details: novoFormData.deficit_details,
            nivel_memoria: novoFormData.nivel_memoria
        });

        // Navegar para Step9BemVindo com TODOS os dados
        navigation.navigate('Step9BemVindo', { formData: novoFormData });
    };

    return (
        <ImageBackground source={fundo2} resizeMode="cover" style={styles.background}>
            <ScrollView style={styles.container2} contentContainerStyle={styles.content}>
                <Text style={styles.titulo2}>
                    VOCÊ POSSUI ALGUM LAUDO OU DIAGNÓSTICO DE DÉFICIT COGNITIVO?
                </Text>

                {selected !== null && selected !== 0 && (
                    <TextInput
                        style={{ 
                            backgroundColor: 'white', 
                            height: 70, 
                            marginBottom: 20, 
                            marginTop: -20, 
                            padding: 10, 
                            borderRadius: 10, 
                            fontFamily: 'Poppins_400Regular',
                            textAlignVertical: 'top'
                        }}
                        placeholder="Descreva os detalhes do seu déficit"
                        multiline
                        value={detalhes}
                        onChangeText={setDetalhes}
                    />
                )}

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
                    disabled={selected === null || (selected !== 0 && detalhes.trim() === '')} 
                    onPress={next}
                >
                    <Text style={styles.buttonText}>Próximo</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}