import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, ImageBackground, Alert } from "react-native";
import { supabase } from "../../lib/supabase"; // ajuste o caminho
import { styles } from "./styles";
import fundo2 from '../../../assets/fundoquest.jpg'; // background

export default function StepBase({ navigation, route }) {
    const formData = route.params?.formData || {};
    const userId = formData.id; // id do usuário
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({}); // { pergunta_id: resposta }

    // Buscar perguntas ativas
    useEffect(() => {
        async function fetchPerguntas() {
        const { data, error } = await supabase
            .from('questionario_perguntas')
            .select('*')
            .eq('ativa', true)
            .order('ordem', { ascending: true });

        if (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível carregar as perguntas.');
        } else {
            setPerguntas(data);
        }
        }
        fetchPerguntas();
    }, []);

    // Toggle checkbox para perguntas com opções
    const toggleOpcao = (perguntaId, opcao) => {
        const current = respostas[perguntaId] || [];
        if (current.includes(opcao)) {
        setRespostas({ ...respostas, [perguntaId]: current.filter(o => o !== opcao) });
        } else {
        setRespostas({ ...respostas, [perguntaId]: [...current, opcao] });
        }
    };

    // Atualizar resposta de texto
    const handleTextChange = (perguntaId, text) => {
        setRespostas({ ...respostas, [perguntaId]: text });
    };

    // Salvar respostas e avançar
    const next = async () => {
        const respostasArray = perguntas.map(p => ({
        user_id: userId,
        pergunta_id: p.id,
        resposta: Array.isArray(respostas[p.id]) ? respostas[p.id].join(', ') : respostas[p.id] || ''
        }));

        const { error } = await supabase
        .from('questionario_respostas')
        .insert(respostasArray);

        if (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível salvar suas respostas.');
        return;
        }

        // Avança para próximo step
        navigation.navigate('StepProximoMemoria', { formData });
    };

    return (
        <ImageBackground source={fundo2} resizeMode="cover" style={styles.background}>
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.titulo2}>
            SELECIONE OU RESPONDA AS PERGUNTAS ABAIXO
            </Text>

            {perguntas.map((p) => (
            <View key={p.id} style={{ marginBottom: 20 }}>
                <Text style={styles.texto2}>{p.pergunta}</Text>

                {p.tipo === 'texto' ? (
                <TextInput
                    style={[styles.input, { marginTop: 5 }]}
                    placeholder="Digite sua resposta"
                    value={respostas[p.id] || ''}
                    onChangeText={(t) => handleTextChange(p.id, t)}
                />
                ) : p.tipo === 'opcoes' && p.opcoes ? (
                JSON.parse(p.opcoes).map((opcao, idx) => (
                    <TouchableOpacity
                    key={idx}
                    style={styles.checkboxContainer}
                    onPress={() => toggleOpcao(p.id, opcao)}
                    >
                    <View style={[styles.checkbox, respostas[p.id]?.includes(opcao) && styles.checkboxMarcado]} />
                    <Text style={styles.texto2}>{opcao}</Text>
                    </TouchableOpacity>
                ))
                ) : null}
            </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={next}>
            <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
        </ScrollView>
        </ImageBackground>
    );
}
