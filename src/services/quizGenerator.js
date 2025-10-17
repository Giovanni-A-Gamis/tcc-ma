// /services/quizGenerator.js
// ================================================
// Gerador de perguntas a partir do conteúdo do diário.
// Nível 1 (local): funciona 100% offline, com base em listas pré-definidas.
// Estruturado para expansão com IA futuramente (nível 2 e 3).
// ================================================

// 🔹 Função principal
export function generateQuestionsFromDiary(text) {
    if (!text || text.trim().length === 0) return [];

    // Extrai as "entidades" (conceitos principais)
    const entities = extractEntities(text);

    // Cria perguntas baseadas no que foi encontrado
    const questions = [];

    if (entities.food.length > 0) {
        questions.push({
        pergunta: "O que você comeu hoje?",
        respostaCorreta: entities.food[0],
        opcoes: shuffle([
            entities.food[0],
            "mamão",
            "pão com queijo",
            "nescau",
        ]),
        categoria: "alimentação",
        });
    }

    if (entities.feeling.length > 0) {
        questions.push({
        pergunta: "Como você se sentiu hoje?",
        respostaCorreta: entities.feeling[0],
        opcoes: shuffle([
            entities.feeling[0],
            "neutro",
            "animado",
            "cansado",
        ]),
        categoria: "emoção",
        });
    }

    if (entities.activity.length > 0) {
        questions.push({
        pergunta: "Qual atividade você realizou hoje?",
        respostaCorreta: entities.activity[0],
        opcoes: shuffle([
            entities.activity[0],
            "descansar",
            "ir à escola",
            "assistir TV",
        ]),
        categoria: "atividade",
        });
    }

    if (entities.place.length > 0) {
        questions.push({
        pergunta: "Onde você esteve hoje?",
        respostaCorreta: entities.place[0],
        opcoes: shuffle([
            entities.place[0],
            "em casa",
            "na escola",
            "no parque",
        ]),
        categoria: "local",
        });
    }

    // Se não encontrar nada relevante, gera uma genérica
    if (questions.length === 0) {
        questions.push({
        pergunta: "Você se lembra do que fez hoje?",
        respostaCorreta: "Sim",
        opcoes: shuffle(["Sim", "Não", "Um pouco", "Não lembro"]),
        categoria: "geral",
        });
    }

    return questions;
}

// ================================================
// Extrai palavras importantes com base em listas.
// Você pode expandir facilmente estas listas depois.
// ================================================
export function extractEntities(text) {
    const lower = text.toLowerCase();

    const foods = [
        "pão", "manteiga", "requeijão", "café", "arroz", "feijão", "mamão",
        "banana", "nescau", "leite", "bolo", "fruta", "suco", "tapioca"
    ];
    const feelings = [
        "feliz", "triste", "cansado", "animado", "ansioso", "calmo", "irritado", "entediado"
    ];
    const activities = [
        "estudar", "trabalhar", "nadar", "correr", "dormir", "ler", "jogar", "assistir", "cozinhar"
    ];
    const places = [
        "escola", "trabalho", "praia", "academia", "casa", "shopping", "parque", "igreja"
    ];

    const found = {
        food: foods.filter(f => lower.includes(f)),
        feeling: feelings.filter(f => lower.includes(f)),
        activity: activities.filter(f => lower.includes(f)),
        place: places.filter(f => lower.includes(f)),
    };

    return found;
}

// ================================================
// Função auxiliar para embaralhar arrays
// ================================================
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// ================================================
// FUTURO: Integração com IA (nível 2)
// -----------------------------------------------
// Você pode substituir o conteúdo da função `generateQuestionsFromDiary`
// por uma chamada a uma Edge Function do Supabase:
//
// const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-diary-quiz`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ conteudo: text }),
// });
// const data = await res.json();
// return data.questions;
//
// ================================================
