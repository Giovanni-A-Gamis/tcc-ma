import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    Alert,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { savePassword, getPasswords, deletePassword, generateStrongPassword } from '../services/passwordService';

const PasswordManager = () => {
    const [passwords, setPasswords] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPassword, setEditingPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const [form, setForm] = useState({
        service: '',
        username: '',
        password: '',
        notes: ''
    });

    // Carregar senhas ao iniciar
    useEffect(() => {
        loadPasswords();
    }, []);

    const loadPasswords = async () => {
        const savedPasswords = await getPasswords();
        setPasswords(savedPasswords);
    };

    // Limpar formulário
    const clearForm = () => {
        setForm({
        service: '',
        username: '',
        password: '',
        notes: ''
        });
        setEditingPassword(null);
        setShowPassword(false);
    };

    // Abrir modal para nova senha
    const handleNewPassword = () => {
        clearForm();
        setModalVisible(true);
    };

    // Abrir modal para editar senha
    const handleEditPassword = (password) => {
        setForm({
        service: password.service,
        username: password.username,
        password: password.password,
        notes: password.notes || ''
        });
        setEditingPassword(password);
        setModalVisible(true);
    };

    // Gerar senha forte
    const handleGeneratePassword = () => {
        const strongPassword = generateStrongPassword();
        setForm(prev => ({ ...prev, password: strongPassword }));
    };

    // Salvar senha
    const handleSavePassword = async () => {
        if (!form.service || !form.username || !form.password) {
        Alert.alert('Atenção', 'Preencha serviço, usuário e senha!');
        return;
        }

        const passwordData = {
        ...form,
        id: editingPassword?.id || Date.now().toString(),
        updatedAt: new Date().toISOString()
        };

        const success = await savePassword(passwordData);
        
        if (success) {
        await loadPasswords();
        setModalVisible(false);
        clearForm();
        Alert.alert('Sucesso', 'Senha salva com segurança!');
        } else {
        Alert.alert('Erro', 'Não foi possível salvar a senha.');
        }
    };

    // Excluir senha
    const handleDeletePassword = (password) => {
        Alert.alert(
        'Confirmar exclusão',
        `Deseja excluir a senha de ${password.service}?`,
        [
            { text: 'Cancelar', style: 'cancel' },
            {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
                const success = await deletePassword(password.id);
                if (success) {
                await loadPasswords();
                Alert.alert('Sucesso', 'Senha excluída!');
                }
            }
            }
        ]
        );
    };

    // Renderizar item da lista
    const renderPasswordItem = ({ item }) => (
        <View style={styles.passwordItem}>
        <View style={styles.passwordInfo}>
            <Text style={styles.serviceText}>{item.service}</Text>
            <Text style={styles.usernameText}>{item.username}</Text>
            {item.notes ? <Text style={styles.notesText}>{item.notes}</Text> : null}
        </View>
        
        <View style={styles.passwordActions}>
            <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditPassword(item)}
            >
            <Ionicons name="pencil" size={20} color="#17285D" />
            </TouchableOpacity>
            
            <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeletePassword(item)}
            >
            <Ionicons name="trash" size={20} color="#e74c3c" />
            </TouchableOpacity>
        </View>
        </View>
    );

    return (
        <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
            <Text style={styles.title}>Senhas</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleNewPassword}>
            <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </View>

        {/* Lista de Senhas */}
        {passwords.length === 0 ? (
            <View style={styles.emptyState}>
            <Ionicons name="lock-closed" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma senha salva</Text>
            <Text style={styles.emptySubtext}>
                Suas senhas ficam armazenadas apenas neste dispositivo
            </Text>
            </View>
        ) : (
            <FlatList
            data={passwords}
            renderItem={renderPasswordItem}
            keyExtractor={item => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            />
        )}

        {/* Modal para adicionar/editar senha */}
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                {editingPassword ? 'Editar Senha' : 'Nova Senha'}
                </Text>

                <TextInput
                style={styles.input}
                placeholder="Serviço (ex: Gmail, Facebook)"
                value={form.service}
                onChangeText={text => setForm(prev => ({ ...prev, service: text }))}
                />

                <TextInput
                style={styles.input}
                placeholder="Usuário/E-mail"
                value={form.username}
                onChangeText={text => setForm(prev => ({ ...prev, username: text }))}
                />

                <View style={styles.passwordInputContainer}>
                <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Senha"
                    value={form.password}
                    onChangeText={text => setForm(prev => ({ ...prev, password: text }))}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#666" 
                    />
                </TouchableOpacity>
                </View>

                <TouchableOpacity 
                style={styles.generateButton}
                onPress={handleGeneratePassword}
                >
                <Text style={styles.generateButtonText}>🎲 Gerar Senha Forte</Text>
                </TouchableOpacity>

                <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Observações (opcional)"
                value={form.notes}
                onChangeText={text => setForm(prev => ({ ...prev, notes: text }))}
                multiline
                />

                <View style={styles.modalActions}>
                <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                    setModalVisible(false);
                    clearForm();
                    }}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSavePassword}
                >
                    <Text style={styles.saveButtonText}>
                    {editingPassword ? 'Atualizar' : 'Salvar'}
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#17285D',
    },
    addButton: {
        backgroundColor: '#17285D',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#666',
        marginTop: 10,
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#999',
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 20,
    },
    list: {
        flex: 1,
    },
    passwordItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#17285D',
    },
    passwordInfo: {
        flex: 1,
    },
    serviceText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#17285D',
    },
    usernameText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginTop: 2,
    },
    notesText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#888',
        marginTop: 4,
        fontStyle: 'italic',
    },
    passwordActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        padding: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#17285D',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
    },
    passwordInputContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    generateButton: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#bbdefb',
    },
    generateButtonText: {
        color: '#1976d2',
        fontFamily: 'Poppins_700Bold',
        fontSize: 14,
    },
    notesInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    saveButton: {
        backgroundColor: '#17285D',
    },
    cancelButtonText: {
        color: '#666',
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
    },
    saveButtonText: {
        color: '#fff',
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
    },
});

export default PasswordManager;