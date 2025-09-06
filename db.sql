-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.alarme_dias (
    alarme_id integer NOT NULL,
    dia_semana_id integer NOT NULL,
    CONSTRAINT alarme_dias_pkey PRIMARY KEY (alarme_id, dia_semana_id),
    CONSTRAINT fk_alarme_dias_dia_semana_id FOREIGN KEY (dia_semana_id) REFERENCES public.dias_da_semana(id),
    CONSTRAINT fk_alarme_dias_alarme_id FOREIGN KEY (alarme_id) REFERENCES public.alarmes(id)
);
CREATE TABLE public.alarmes (
    id integer NOT NULL DEFAULT nextval('alarmes_id_seq'::regclass),
    user_id uuid NOT NULL,
    titulo character varying NOT NULL,
    horario time without time zone NOT NULL,
    ativo boolean DEFAULT true,
    CONSTRAINT alarmes_pkey PRIMARY KEY (id),
    CONSTRAINT fk_alarmes_user FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.calendario (
    id integer NOT NULL DEFAULT nextval('calendario_id_seq'::regclass),
    user_id uuid NOT NULL,
    titulo character varying NOT NULL,
    descricao text,
    data_evento date NOT NULL,
    hora_evento time without time zone,
    repetir boolean DEFAULT false,
    notificar boolean DEFAULT false,
    CONSTRAINT calendario_pkey PRIMARY KEY (id),
    CONSTRAINT fk_calendario_user FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.diario (
    id integer NOT NULL DEFAULT nextval('diario_id_seq'::regclass),
    user_id uuid NOT NULL,
    titulo character varying,
    conteudo text,
    data_registro date DEFAULT CURRENT_DATE,
    editado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT diario_pkey PRIMARY KEY (id),
    CONSTRAINT fk_diario_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.dias_da_semana (
    id integer NOT NULL DEFAULT nextval('dias_da_semana_id_seq'::regclass),
    nome_dia character varying NOT NULL UNIQUE,
    CONSTRAINT dias_da_semana_pkey PRIMARY KEY (id)
);
CREATE TABLE public.guia (
    id integer NOT NULL DEFAULT nextval('guia_id_seq'::regclass),
    titulo character varying NOT NULL,
    conteudo text,
    categoria character varying NOT NULL CHECK (categoria::text = ANY (ARRAY['Memória'::character varying, 'Atenção'::character varying, 'Concentração'::character varying, 'Reação'::character varying, 'Lógica'::character varying, 'Curiosidades'::character varying]::text[])),
    img_url text NOT NULL,
    autor character varying,
    CONSTRAINT guia_pkey PRIMARY KEY (id)
);
CREATE TABLE public.jogos (
    id integer NOT NULL DEFAULT nextval('jogos_id_seq'::regclass),
    nome character varying NOT NULL,
    descricao text,
    categoria character varying,
    nivel_dificuldade character varying CHECK (nivel_dificuldade::text = ANY (ARRAY['Facil'::character varying, 'Medio'::character varying, 'Dificil'::character varying]::text[])),
    CONSTRAINT jogos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.jogos_resultados (
    id integer NOT NULL DEFAULT nextval('jogos_resultados_id_seq'::regclass),
    user_id uuid NOT NULL,
    jogo_id integer NOT NULL,
    xp integer NOT NULL,
    data_jogada timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT jogos_resultados_pkey PRIMARY KEY (id),
    CONSTRAINT fk_jogoresultado_user FOREIGN KEY (user_id) REFERENCES public.user(id),
    CONSTRAINT fk_jogoresultado_jogos FOREIGN KEY (jogo_id) REFERENCES public.jogos(id)
    );
CREATE TABLE public.questionario (
    id integer NOT NULL DEFAULT nextval('questionario_id_seq'::regclass),
    user_id uuid NOT NULL,
    pergunta character varying NOT NULL,
    resposta text,
    respondido_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT questionario_pkey PRIMARY KEY (id),
    CONSTRAINT fk_questionario_user FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.user (
    id uuid NOT NULL,
    nome character varying NOT NULL,
    email character varying NOT NULL UNIQUE,
    data_nascimento date,
    nivel_memoria integer DEFAULT 0,
    genero character varying CHECK (genero::text = ANY (ARRAY['Masculino'::character varying, 'Feminino'::character varying, 'Outro'::character varying, 'Prefiro não dizer'::character varying]::text[])),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_pkey PRIMARY KEY (id)
);