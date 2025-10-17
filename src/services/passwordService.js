import AsyncStorage from '@react-native-async-storage/async-storage';

const PASSWORDS_KEY = '@SenhaAtiva:passwords';

// Salvar/Atualizar senha
export const savePassword = async (passwordData) => {
    try {
        const existingPasswords = await getPasswords();
        
        // Se já existe um com mesmo ID, atualiza
        const index = existingPasswords.findIndex(p => p.id === passwordData.id);
        if (index !== -1) {
        existingPasswords[index] = passwordData;
        } else {
        // Novo registro
        passwordData.id = Date.now().toString(); // ID único simples
        passwordData.createdAt = new Date().toISOString();
        existingPasswords.push(passwordData);
        }

        await AsyncStorage.setItem(PASSWORDS_KEY, JSON.stringify(existingPasswords));
        return true;
    } catch (error) {
        console.error('Erro ao salvar senha:', error);
        return false;
    }
};

// Buscar todas as senhas
export const getPasswords = async () => {
    try {
        const passwordsString = await AsyncStorage.getItem(PASSWORDS_KEY);
        return passwordsString ? JSON.parse(passwordsString) : [];
    } catch (error) {
        console.error('Erro ao buscar senhas:', error);
        return [];
    }
};

// Excluir senha
export const deletePassword = async (id) => {
    try {
        const existingPasswords = await getPasswords();
        const filteredPasswords = existingPasswords.filter(p => p.id !== id);
        await AsyncStorage.setItem(PASSWORDS_KEY, JSON.stringify(filteredPasswords));
        return true;
    } catch (error) {
        console.error('Erro ao excluir senha:', error);
        return false;
    }
};

// Gerar senha forte
export const generateStrongPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};