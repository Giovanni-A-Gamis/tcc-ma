import React, { use, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Modal } from "react-native";
import { styles } from "./styles";
import {
getSessionUser,
getUserProfile,
updateUserPhoto,
publicAvatarUrl,
resolveAvatarUrl,
} from "../../services/userService";
import { handleLogout } from "../../hooks/HandleLogout";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
    const navigation = useNavigation();

    const [authUser, setAuthUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);

    // Avatares padrão no bucket
    const AVATAR_OPTIONS = [
        "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/1.png",
        "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/2.png",
        "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/3.png",
        "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/4.png",
    ];

    const avatarChoices = useMemo(
    () =>
        AVATAR_OPTIONS.map((url) => ({
            path: url,   
            url,         
        })),
    []

    );

    // Carrega auth user + profile
    useEffect(() => {
        (async () => {
            try {
                const user = await getSessionUser();
                setAuthUser(user);

                if (user?.id) {
                    const p = await getUserProfile(user.id);
                    setProfile(p || null);
                }
            } catch (e) {
                console.error("Erro ao carregar perfil:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const avatarUrl = useMemo(() => {
        const foto = profile?.foto || AVATAR_OPTIONS[0];
        return resolveAvatarUrl(foto);
    }, [profile]);

    const handleChooseAvatar = async (choice) => {
        if (!authUser?.id) return;
        try {
            const updated = await updateUserPhoto(authUser.id, choice.path);
            setProfile(updated);
            setAvatarModalVisible(false);
        } catch (e) {
            console.error("Erro ao atualizar avatar:", e);
        }
    };

    const nivel_memoria = profile?.nivel_memoria ?? 0;
    const genero = profile?.genero ?? "—";
    const deficit = profile?.deficit ?? "—";
    const criado_em = profile?.criado_em
        ? new Date(profile.criado_em).toLocaleDateString("pt-BR")
        : "—";
    const telefone = profile?.telefone ?? "—";
    const data_nascimento = profile?.data_nascimento
        ? new Date(profile.data_nascimento).toLocaleDateString("pt-BR")
        : "—";

    const getNivel = (valorNivelMemoria) => {
        if (valorNivelMemoria < 300) return "Iniciante";
        if (valorNivelMemoria < 800) return "Intermediário";
        if (valorNivelMemoria < 1200) return "Avançado";
        return "Mestre da Memória";
    };

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Avatar + infos básicas */}
            <View style={styles.avatarContainer}>
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                <Text style={styles.nome}>{profile?.nome || authUser?.user_metadata?.name || "Usuário"}</Text>
                <Text style={styles.email}>{authUser?.email}</Text>

                <TouchableOpacity style={styles.smallButton} onPress={() => setAvatarModalVisible(true)}>
                    <Text style={styles.smallButtonText}>Trocar avatar</Text>
                </TouchableOpacity>
            </View>
            
            <View>
            {/* Cartões de informações */}
                {/* Status de memória */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Status da Memória</Text>
                    <Text style={styles.sectionContent}>Nível: {getNivel(nivel_memoria)}</Text>
                    <Text style={styles.sectionContent}>XP Total: {nivel_memoria}</Text>
                </View>

                {/* Ofensiva de Jogos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ofensiva de Jogos</Text>
                    <Text style={styles.placeholder}>Ainda não há registros</Text>
                </View>

                {/* Informações adicionais */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações adicionais</Text>
                    <Text style={styles.sectionContent}>Gênero: {genero}</Text>
                    <Text style={styles.sectionContent}>Data de nascimento: {data_nascimento}</Text>
                    <Text style={styles.sectionContent}>Déficit de memória: {deficit}</Text>
                    <Text style={styles.sectionContent}>Telefone: {telefone}</Text>
                    <Text style={styles.sectionContent}>Conta criada em: {criado_em}</Text>
                </View>

                {/* Senhas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Senhas</Text>
                    <Text style={styles.placeholder}>Suas senhas ficam salvas apenas no seu dispositivo</Text>
                </View>

                {/* Ações */}
                <View style={styles.actions}>
                    

                    <TouchableOpacity onPress={() => handleLogout(navigation)} style={[styles.button, styles.logoutButton]}>
                        <Text style={styles.buttonText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>
            

            {/* Modal de seleção de avatar */}
            <Modal visible={avatarModalVisible} animationType="fade" transparent>
                <View style={styles.avatarsModalOverlay}>
                    <View style={styles.avatarsModal}>
                        <Text style={styles.sectionTitle}>Escolha seu avatar</Text>
                        <View style={styles.avatarsGrid}>
                            {avatarChoices.map((opt) => (
                                <TouchableOpacity
                                    key={opt.path}
                                    style={styles.avatarOption}
                                    onPress={() => handleChooseAvatar(opt)}
                                >
                                    <Image
                                        source={{ uri: opt.url }}
                                        style={styles.avatarOptionImage}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>


                        <TouchableOpacity
                            onPress={() => setAvatarModalVisible(false)}
                            style={styles.closeModalButton}
                        >
                            <Text style={styles.smallButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );

}