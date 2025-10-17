import { supabase } from '../lib/supabase';

export const atualizarOfensiva = async (userId) => {
    try {
        const { data, error } = await supabase.rpc('atualizar_ofensiva', {
        p_user_id: userId
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao atualizar ofensiva:', error);
        return null;
    }
};

export const getOfensiva = async (userId) => {
    try {
        const { data, error } = await supabase
        .from('ofensiva')
        .select('*')
        .eq('user_id', userId)
        .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar ofensiva:', error);
        return null;
    }
};