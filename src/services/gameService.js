import { supabase } from "../lib/supabase";

export async function getGames() {
  const { data, error } = await supabase.from("jogos").select("*");
  if (error) {
    console.error("Erro ao buscar jogos:", error);
    return [];
  }
  return data;
}
