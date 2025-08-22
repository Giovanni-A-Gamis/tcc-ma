import axios from 'axios'

const supabase = axios.create({
    baseUrl: 'https://onakobymklswoaqexsct.supabase.co/rest/v1/',
    headers: {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uYWtvYnlta2xzd29hcWV4c2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDc1NTEsImV4cCI6MjA3MTMyMzU1MX0.0fQFDv4Viei5g8R9-tl0rh9-b0tbZfI8v8O9sgRTI80'
    }
})

export default supabase