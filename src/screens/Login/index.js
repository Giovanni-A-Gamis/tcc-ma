import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ImageBackground, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../../services/authService'; 
import logo from '../../../assets/logo.png';
import fundo from '../../../assets/fundologin.png';
import { styles } from './styles';
import { handleLogin } from '../../hooks/HandleLogin'; // não funciona então coloquei direto a função aqui

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preencha email e senha.');
            return;
        }

        try {
            setLoading(true);
            const data = await login(email, password);
            console.log('Usuário logado:', data);

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
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? 'Carregando...' : 'Login'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginTop: 15 }}
                        onPress={() => navigation.navigate('MainContainer')}
                    >
                        <Text style={{ fontFamily: 'Poppins_700Bold' }}>DEV</Text>
                        
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}