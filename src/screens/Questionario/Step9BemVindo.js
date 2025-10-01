import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { styles } from './styles';
import memooi from '../../../assets/memooi.png';
import fundo2 from '../../../assets/fundoquest.jpg';
import { supabase } from '../../lib/supabase';

export default function Step9BemVindo({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const formData = route.params?.formData || {}; // tem tudo que coletaram nos steps

    // validar campos mínimos antes de tentar criar
    function validateForm() {
        if (!formData.email || !formData.senha) {
            Alert.alert('Erro', 'Email e senha são obrigatórios.');
            return false;
        }
        if (!formData.nome) {
            // se o nome não foi coletado em algum step, pedir ao usuário
            Alert.alert('Erro', 'Por favor preencha seu nome no passo anterior.');
            return false;
        }
        return true;
    }

    async function finish() {
        if (!validateForm()) return;

        setLoading(true);

        try {
            // 1) Criar conta auth
            const { data: signData, error: signError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.senha,
            });

            if (signError) {
                // erro comum: email já em uso
                console.error('Erro no signUp:', signError);
                Alert.alert('Erro ao criar conta', signError.message || JSON.stringify(signError));
                setLoading(false);
                return;
            }

            // signData pode conter user ou next steps (verificação por e-mail)
            const userId = signData?.user?.id;
            if (!userId) {
                // Em alguns setups, signUp retorna null user (ex.: confirmação obrigatória)
                // tentamos pegar user do session
                const { data: me } = await supabase.auth.getUser();
                const uid = me?.data?.user?.id;
                if (!uid) {
                    Alert.alert('Erro', 'Não foi possível obter o id do usuário após signUp.');
                    setLoading(false);
                    return;
                }
                // override
                signData.user = { id: uid };
            }

            const finalUserId = signData.user.id || (await supabase.auth.getUser()).data?.user?.id;

            // 2) Inserir linha na tabela public.user
            // Ajuste os campos conforme seu schema; obrigatórios: id e nome
            const userRow = {
                id: finalUserId,
                nome: formData.nome,
                email: formData.email,
                telefone: formData.telefone || null,
                genero: formData.genero || null,
                data_nascimento: formData.data_nascimento || null,
                foto: formData.foto || null,
                xp: formData.xp || 0,
            };

            const { error: insertUserError } = await supabase.from('user').insert([userRow]);

            if (insertUserError) {
                console.error('Erro ao inserir public.user:', insertUserError);
                // Se deu violação de constraint (ex.: user já existe), podemos tentar fazer update
                if (insertUserError.code === '23505') {
                    // unique violation: tenta update
                    const { error: updErr } = await supabase
                        .from('user')
                        .update(userRow)
                        .eq('id', finalUserId);
                    if (updErr) throw updErr;
                } else {
                    throw insertUserError;
                }
            }

            // 3) Inserir respostas do questionário (se existirem)
            // Expectativa: formData.perguntas = [{ pergunta_id, resposta }, ...]
            if (Array.isArray(formData.perguntas) && formData.perguntas.length > 0) {
                const respostas = formData.perguntas.map((p) => ({
                    user_id: finalUserId,
                    pergunta_id: p.pergunta_id || null,
                    resposta: typeof p.resposta === 'string' ? p.resposta : JSON.stringify(p.resposta),
                }));

                const { error: respError } = await supabase.from('questionario_respostas').insert(respostas);
                if (respError) {
                    console.error('Erro ao inserir respostas:', respError);
                    // não aborta todo o fluxo — log e avisa
                    Alert.alert('Aviso', 'Conta criada, mas falhou ao salvar respostas do questionário.');
                }
            }

            Alert.alert('Sucesso', 'Conta criada com sucesso!');
            // Redireciona para MainContainer (limpando pilha)
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainContainer' }],
            });
        } catch (err) {
            console.error('Erro ao finalizar cadastro:', err);
            Alert.alert('Erro', err.message || JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <ImageBackground source={fundo2} resizeMode="cover" style={styles.background}>
            <View style={styles.container1}>
                <View style={styles.speechBubble}>
                    <Text style={styles.speechText}>Agora sim, seja bem vindo ao nosso aplicativo!!</Text>
                </View>

                <Image source={memooi} style={styles.image} resizeMode="contain" />

                <TouchableOpacity style={styles.button} onPress={finish} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Criando conta...' : 'Finalizar'}</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}
