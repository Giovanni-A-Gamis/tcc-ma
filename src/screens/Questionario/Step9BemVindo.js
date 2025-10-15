import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { styles } from './styles';
import memooi from '../../../assets/memooi.png';
import fundo2 from '../../../assets/fundoquest.jpg';
import { supabase } from '../../lib/supabase';

export default function Step9BemVindo({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const formData = route.params?.formData || {};

    function validateForm() {
        if (!formData.email || !formData.senha) {
            console.log('Dados faltantes:', { 
                email: formData.email, 
                senha: formData.senha,
                todosDados: formData 
            });
            Alert.alert('Erro', 'Email e senha são obrigatórios.');
            return false;
        }
        if (!formData.nome) {
            Alert.alert('Erro', 'Nome é obrigatório.');
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
                options: {
                    data: {
                        nome: formData.nome,
                        telefone: formData.telefone
                    }
                }
            });

            if (signError) {
                console.error('Erro no signUp:', signError);
                Alert.alert('Erro ao criar conta', signError.message || JSON.stringify(signError));
                setLoading(false);
                return;
            }

            const userId = signData?.user?.id;
            let finalUserId = userId;

            if (!finalUserId) {
                const { data: { user } } = await supabase.auth.getUser();
                finalUserId = user?.id;
            }

            if (!finalUserId) {
                console.warn('Não foi possível obter o ID do usuário, criando registro temporário...');
            } else {
                // 2) Inserir linha na tabela public.user
                const userRow = {
                    id: finalUserId,
                    nome: formData.nome,
                    email: formData.email,
                    telefone: formData.telefone || null,
                    genero: formData.genero || null,
                    data_nascimento: formData.data_nascimento || null,
                    foto: formData.foto || null,
                    nivel_memoria: formData.nivel_memoria || 0, 
                    deficit: formData.deficit || null,           
                    deficit_details: formData.deficit_details || null  
                };

                const { error: insertUserError } = await supabase.from('user').insert([userRow]);

                if (insertUserError) {
                    console.error('Erro ao inserir public.user:', insertUserError);
                    if (insertUserError.code === '23505') {
                        const { error: updErr } = await supabase
                            .from('user')
                            .update(userRow)
                            .eq('id', finalUserId);
                        if (updErr) {
                            console.error('Erro ao atualizar usuário:', updErr);
                        }
                    }
                }

                // 3) Inserir respostas do questionário
                if (Array.isArray(formData.perguntas) && formData.perguntas.length > 0) {
                    const respostas = formData.perguntas.map((p) => ({
                        user_id: finalUserId,
                        pergunta_id: p.pergunta_id || null,
                        resposta: typeof p.resposta === 'string' ? p.resposta : JSON.stringify(p.resposta),
                    }));

                    const { error: respError } = await supabase.from('questionario_respostas').insert(respostas);
                    if (respError) {
                        console.error('Erro ao inserir respostas:', respError);
                    }
                }
            }

            // ✅ VERIFICAR SE PRECISA CONFIRMAR EMAIL
            // No Supabase, se email_confirmed_at for null, significa que precisa confirmar
            const needsEmailConfirmation = signData.user && !signData.user.email_confirmed_at;

            if (needsEmailConfirmation) {
                Alert.alert(
                    'Verifique seu Email',
                    'Enviamos um link de confirmação para seu email. Por favor, verifique sua caixa de entrada e confirme sua conta antes de fazer login.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Redireciona para login após o OK
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                });
                            }
                        }
                    ]
                );
            } else {
                // Se não precisa confirmar email, vai direto para login
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }

        } catch (err) {
            console.error('Erro ao finalizar cadastro:', err);
            // Em caso de erro, ainda assim redireciona para login
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } finally {
            setLoading(false);
        }
    }
    
    console.log('FORM DATA FINAL:', JSON.stringify(formData, null, 2));
    
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