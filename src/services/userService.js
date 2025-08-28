import { supabase } from "../lib/supabaseClient"

export async function getUsers() {
    const { data, error } = await supabase.from("user").select("*")
    if (error) throw error
    return data
}

export async function addUser({ nome, email, senha_hash, data_nascimento, genero }) {
    const { data, error } = await supabase.from("user").insert([
        { nome, email, senha_hash, data_nascimento, genero }
    ])
    if (error) throw error
    return data
}
