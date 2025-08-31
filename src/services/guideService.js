import { supabase } from "../lib/supabase";

export async function getGuides() {
    const { data, error } = await supabase
        .from("guia")
        .select("*")

    if (error) {
        console.error("Erro ao buscar guias:", error.message);
        return [];
    }

    return data;
}