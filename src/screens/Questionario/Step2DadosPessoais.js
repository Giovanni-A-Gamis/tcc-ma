import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Alert, ImageBackground, Modal } from "react-native";
import { styles } from "./styles";
import fundo from '../../../assets/fundologin.png';

const AVATAR_OPTIONS = [
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/1.png",
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/2.png",
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/3.png",
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/4.png",
];

const GENERO_OPTIONS = ["Masculino", "Feminino", "Outro", "Prefiro não dizer"];

export default function Step2Profile({ navigation, route }) {
    const formData = route.params?.formData || {};
    const [nome, setNome] = useState(formData.nome || '');
    const [genero, setGenero] = useState(formData.genero || '');
    const [telefone, setTelefone] = useState(formData.telefone || '');
    const [foto, setFoto] = useState(formData.foto || '');
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);

    const avatarChoices = useMemo(() => AVATAR_OPTIONS.map(url => ({ url, path: url })), []);

    const handleNext = () => {
        if (!nome.trim()) { Alert.alert('Atenção', 'Por favor, preencha seu nome.'); return; }
        if (!foto) { Alert.alert('Atenção', 'Por favor, selecione um avatar.'); return; }
        if (!telefone.trim()) { Alert.alert('Atenção', 'Por favor, preencha seu telefone.'); return; }
        if (!genero) { Alert.alert('Atenção', 'Por favor, selecione um gênero.'); return; }

        navigation.navigate('Step3Pergunta', {
            formData: { ...formData, nome: nome.trim(), genero, telefone: telefone.trim(), foto }
        });
    };

    const handleChooseAvatar = (choice) => {
        setFoto(choice.path);
        setAvatarModalVisible(false);
    };

    const formatTelefone = (text) => {
        const digits = text.replace(/\D/g, '');
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
        if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
        return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
    };

    return (
        <ImageBackground source={fundo} resizeMode="cover" style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <View style={[styles.card, { alignItems: 'center', paddingVertical: 30 }]}>
                    {/* Avatar */}
                    <TouchableOpacity
                        onPress={() => setAvatarModalVisible(true)}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            borderWidth: 2,
                            borderColor: '#17285D',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                            overflow: 'hidden',
                        }}
                    >
                        {foto ? (
                            <Image source={{ uri: foto }} style={{ width: 120, height: 120 }} />
                        ) : (
                            <Text style={{ fontSize: 30, color: '#17285D' }}>+</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={{ fontSize: 15, fontFamily: 'Poppins_700Bold', color: '#17285D', marginBottom: 15 }}>Preencha alguns dados!!!</Text>

                    {/* Nome */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input]}
                            placeholder="Nome *"
                            value={nome}
                            onChangeText={setNome}
                        />
                    </View>

                    {/* Telefone com máscara */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input]}
                            placeholder="Telefone *"
                            value={telefone}
                            onChangeText={t => setTelefone(formatTelefone(t))}
                            keyboardType="phone-pad"
                            maxLength={15}
                        />
                    </View>

                    {/* Seleção de gênero */}
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins_400Regular', color: '#17285D', marginBottom: 7 }}>Selecione seu gênero:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 25 }}>
                        {GENERO_OPTIONS.map(opt => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => setGenero(opt)}
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    margin: 5,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#17285D',
                                    backgroundColor: genero === opt ? '#8ec0c7' : '#fff',
                                    elevation: 2,
                                }}
                            >
                                <Text style={{ color: genero === opt ? '#fff' : '#17285D', fontFamily: 'Poppins_400Regular' }}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>Próximo</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal de avatar */}
                <Modal visible={avatarModalVisible} transparent animationType="fade">
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            padding: 20,
                            width: '85%',
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 20, marginBottom: 10, fontFamily: 'Poppins_700Bold', color: '#17285D' }}>Escolha seu avatar</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {avatarChoices.map(opt => (
                                    <TouchableOpacity
                                        key={opt.path}
                                        onPress={() => handleChooseAvatar(opt)}
                                        style={{ margin: 10 }}
                                    >
                                        <Image source={{ uri: opt.url }} style={{ 
                                            width: 100, 
                                            height: 100, 
                                            borderRadius: 10, 
                                            borderColor: '#17285D', 
                                            borderWidth: 1, 
                                            elevation: 2 
                                          }} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            
                            <TouchableOpacity
                                onPress={() => setAvatarModalVisible(false)}
                                style={{ 
                                  marginTop: 20, 
                                  padding: 10, 
                                  paddingHorizontal: 20, 
                                  backgroundColor: '#8ec0c7', 
                                  borderRadius: 10, 
                                  borderColor: '#17285D', 
                                  borderWidth: 1,
                                  elevation: 2}}
                            >
                                <Text style={{ color: '#17285D', fontFamily: 'Poppins_700Bold' }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
}
