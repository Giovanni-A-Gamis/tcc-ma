import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export async function handleLogout(navigation) {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    } catch (err) {
        console.log('Erro no logout:', err);
        Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
    }
}
