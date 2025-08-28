import { Alert } from 'react-native';
import { login } from '../services/authService';

export const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preencha email e senha.');
            return;
        }

        try {
            setLoading(true);
            const data = await login(email, password);
            console.log('Usuário logado:', data);

            navigation.navigate('MainContainer');
        } catch (error) {
            console.log(error);
            Alert.alert('Erro no login', error.message || 'Ocorreu um erro.');
        } finally {
            setLoading(false);
        }
    };