// StepProfile.js
import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, Alert } from "react-native";
import { styles } from "./styles";
import { Ionicons } from '@expo/vector-icons';

const AVATAR_OPTIONS = [
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/1.png",
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/2.png",
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/3.png",
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/4.png",
];

export default function StepProfile({ navigation, route }) {
    const formData = route.params?.formData || {};

    const [nome, setNome] = useState(formData.nome || '');
    const [genero, setGenero] = useState(formData.genero || '');
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [foto, setFoto] = useState(formData.foto || AVATAR_OPTIONS[0]);

    const avatarChoices = useMemo(() =>
        AVATAR_OPTIONS.map(url => ({ url, path: url })), []
    );

    function next() {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'Por favor preencha seu nome.');
            return;
        }

        // Avança pro próximo step, carregando os dados atuais
        navigation.navigate('Step9BemVindo', {
            formData: { ...formData, nome: nome.trim(), genero, foto }
        });
    }

    const handleChooseAvatar = (choice) => {
        setFoto(choice.path);
        setAvatarModalVisible(false);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: foto }} style={styles.avatar} />
                <Text style={styles.label}>Nome</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome"
                        value={nome}
                        onChangeText={setNome}
                    />
                </View>

                <Text style={styles.label}>Gênero</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu gênero"
                        value={genero}
                        onChangeText={setGenero}
                    />
                </View>

                <TouchableOpacity style={styles.smallButton} onPress={() => setAvatarModalVisible(true)}>
                    <Text style={styles.smallButtonText}>Escolher Avatar</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={next}>
                <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>

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
