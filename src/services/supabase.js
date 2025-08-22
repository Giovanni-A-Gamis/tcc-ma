import axios from "axios";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

const supabase = axios.create({
    baseURL: `${SUPABASE_URL}/rest/v1/`,
    headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
});

export default supabase;
