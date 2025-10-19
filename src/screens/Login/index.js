import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    ImageBackground,
    Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../services/authService';
import logo from '../../../assets/traco.png';
import fundo from '../../../assets/fundologin.png';
import { styles } from './styles';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Carregar email salvo quando o componente monta
    useEffect(() => {
        const loadEmail = async () => {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
        };
        loadEmail();
    }, []);

    const handleLoginPress = async () => {
        if (!email || !password) {
        Alert.alert('Erro', 'Preencha email e senha.');
        return;
        }

        try {
        setLoading(true);
        const data = await login(email, password);
        console.log('Usuário logado:', data);

        // Salvar email se "lembrar de mim" marcado
        if (rememberMe) {
            await AsyncStorage.setItem('savedEmail', email);
        } else {
            await AsyncStorage.removeItem('savedEmail');
        }

        navigation.navigate('MainContainer');
        } catch (error) {
        console.log(error);
        Alert.alert('Erro no login', error.message || 'Ocorreu um erro.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <ImageBackground source={fundo} resizeMode="cover" style={styles.background}>
        <StatusBar style="light" />
        <View style={styles.overlay}>
            <View style={styles.card}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Seja bem-vindo de volta!</Text>

            <View style={styles.allinput}>
                <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                />
                </View>

                <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.iconContainer}
                >
                    <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="gray"
                    />
                </TouchableOpacity>
                </View>

                {/* Lembrar de mim */}
                <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}
                onPress={() => setRememberMe(!rememberMe)}
                >
                <View
                    style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#17285D',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 8,
                    backgroundColor: rememberMe ? '#8ec0c7' : '#fff',
                    }}
                >
                    {rememberMe && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16 }}>
                    Lembrar de mim
                </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleLoginPress}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                {loading ? 'Carregando...' : 'Login'}
                </Text>
            </TouchableOpacity>

            </View>
        </View>
        </ImageBackground>
    );
}
