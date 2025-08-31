import { supabase } from "../lib/supabase";

export async function getDiaries(user_id) {
    const { data, error } = await supabase
        .from("diario")
        .select("*")
        .eq("user_id", user_id)
        .order("data_registro", { ascending: false });

    if (error) {
        console.error("Erro ao buscar diários:", error);
        return [];
    }
    return data;
}

export async function createDiary({ user_id, titulo, conteudo }) {
    const { data, error } = await supabase
        .from("diario")
        .insert([{ user_id, titulo, conteudo }])
        .select();

    if (error) {
        console.error("Erro ao criar diário:", error);
        return null;
    }
    return data[0];
}

export async function updateDiary(id, conteudo) {
    const { data, error } = await supabase
        .from("diario")
        .update({ conteudo, editado_em: new Date() })
        .eq("id", id)
        .select();

    if (error) {
        console.error("Erro ao atualizar diário:", error);
        return null;
    }
    return data[0];
}
