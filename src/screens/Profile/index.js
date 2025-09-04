import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, TextInput } from "react-native";
import { supabase } from "../../lib/supabase";
import { styles } from "./styles";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPhoto, setNewPhoto] = useState(null);

    const calcularDeficit = (nivel) => {
        if (nivel < 50) return "Leve";
        if (nivel < 100) return "Moderado";
        return "Severo";
    };

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: supabaseUser } } = await supabase.auth.getUser();
            if (!supabaseUser) return;

            const { data, error } = await supabase
                .from("user")
                .select("*")
                .eq("id", supabaseUser.id)
                .single();

            if (!error && data) {
                setUser({
                    ...data,
                    foto: data.foto || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    deficit: calcularDeficit(data.nivel_memoria || 0),
                });
            }
        };

        fetchUser();
    }, []);

    const openImagePicker = async () => {
        // Solicita permissão
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permissão para acessar a galeria é necessária!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setNewPhoto(result.assets[0]);
        }
    };

    const saveProfile = async () => {
        if (!user) return;

        const updates = { nome: newName || user.nome };

        // Upload da nova foto
        if (newPhoto) {
            try {
                console.log('Iniciando upload da foto:', newPhoto);
                const fileExt = newPhoto.uri.split(".").pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;
                const response = await fetch(newPhoto.uri);
                if (!response.ok) {
                    console.log('Erro ao buscar imagem:', response.status, response.statusText);
                    alert('Não foi possível acessar a imagem selecionada.');
                    return;
                }
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const file = new File([arrayBuffer], newPhoto.fileName || fileName, { type: newPhoto.mimeType || "image/jpeg" });
                console.log('File gerado:', file);

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(fileName, file, { upsert: true });

                if (uploadError) {
                    console.log('Erro Supabase upload:', uploadError);
                    alert('Erro ao enviar imagem para o servidor.');
                    return;
                }
                console.log('Upload realizado:', uploadData);

                const publicUrlData = supabase.storage
                    .from("avatars")
                    .getPublicUrl(fileName);
                console.log('URL pública:', publicUrlData);

                updates.foto = publicUrlData.data.publicUrl;
            } catch (err) {
                console.log("Erro ao fazer upload da foto:", err);
                alert('Erro inesperado ao enviar imagem.');
                return;
            }
        }

        // Atualiza o usuário no banco
        const { error } = await supabase
            .from("user")
            .update(updates)
            .eq("id", user.id);

        if (!error) {
            setUser({ ...user, ...updates });
            setModalVisible(false);
            setNewPhoto(null);
        } else {
            console.log("Erro ao atualizar perfil:", error.message);
        }
    };

    if (!user) return <Text>Carregando...</Text>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Image source={{ uri: user.foto }} style={styles.avatar} />
                <Text style={styles.nome}>{user.nome}</Text>
            </View>

            {/* Cards */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Informações Pessoais</Text>
                <Text>Nome: {user.nome}</Text>
                <Text>Data de Nascimento: {user.data_nascimento ? new Date(user.data_nascimento).toLocaleDateString() : "-"}</Text>
                <Text>Gênero: {user.genero || "-"}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Status de Memória</Text>
                <Text>Nível de Memória: {user.nivel_memoria}</Text>
                <Text>Diagnóstico: {user.deficit}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Conta</Text>
                <Text>Email: {user.email}</Text>
                <Text>Telefone: {user.telefone || "(não cadastrado)"}</Text>
                <Text>Conta criada em: {new Date(user.criado_em).toLocaleDateString()}</Text>
            </View>

            {/* Botões */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Editar Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={async () => await supabase.auth.signOut()}>
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: "90%", backgroundColor: "#fff", borderRadius: 15, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Editar Perfil</Text>

                        {/* Foto atual */}
                        <Image
                            source={{ uri: newPhoto ? newPhoto.uri : user.foto }}
                            style={{ width: 100, height: 100, borderRadius: 50, alignSelf: "center", marginBottom: 15 }}
                        />

                        {/* Botão selecionar nova foto */}
                        <TouchableOpacity onPress={openImagePicker} style={{ marginBottom: 15 }}>
                            <Text style={{ color: "#17285D", textAlign: "center" }}>
                                {newPhoto ? "Nova foto selecionada" : "Selecionar nova foto"}
                            </Text>
                        </TouchableOpacity>

                        {/* Input de nome */}
                        <TextInput
                            placeholder="Nome"
                            value={newName || user.nome}
                            onChangeText={setNewName}
                            style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10 }}
                        />

                        {/* Botões */}
                        <TouchableOpacity onPress={saveProfile} style={{ backgroundColor: "#8ec0c7", padding: 12, borderRadius: 10, marginBottom: 10 }}>
                            <Text style={{ textAlign: "center", color: "#f0f0f0", fontWeight: "bold" }}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={{ textAlign: "center", color: "#17285D" }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
