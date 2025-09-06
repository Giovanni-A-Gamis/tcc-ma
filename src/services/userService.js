// src/services/userService.js
import { supabase } from "../lib/supabase";

/** Retorna o usuário autenticado (auth) */
export async function getSessionUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user || null;
}

/** Busca o perfil na tabela public.user */
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", userId)
        .single();

    // Se não existir linha, retorna null
    if (error) {
        if (error.code === "PGRST116") return null; // nenhum registro
        throw error;
    }
    return data;
}

/** Atualiza (ou cria) a foto do usuário com upsert */
export async function updateUserPhoto(userId, fotoUrl) {
    const { data, error } = await supabase
        .from("user")
        .update({ foto: fotoUrl })
        .eq("id", userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}


/** Gera a URL pública para um path do bucket avatars */
export function publicAvatarUrl(path) {
    if (!path) return null;
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data?.publicUrl || null;
}

/** Converte um campo 'foto' em URL final */
export function resolveAvatarUrl(foto) {
    if (!foto) return null;
    if (foto.startsWith("http://") || foto.startsWith("https://")) return foto;
    return publicAvatarUrl(foto);
}
