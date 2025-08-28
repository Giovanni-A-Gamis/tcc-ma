import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import logocnome from '../../../assets/logocnome.png';
import fundo from '../../../assets/fundologin.png';
import { BlurView } from 'expo-blur';
import { styles } from './styles';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <ImageBackground source={fundo} resizeMode="cover" style={styles.background}>
            <BlurView intensity={50} tint="systemMaterialDark" style={StyleSheet.absoluteFill} />
            <StatusBar style="light" />
            <View style={styles.overlay}>
                {/* Card central */}
                <View style={styles.card}>
                    <Image source={logocnome} style={styles.logocnome} />
                    <Text style={styles.title}>Seja bem-vindo de volta!</Text>

                    {/* Inputs */}
                    <View style={styles.allinput}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                placeholderTextColor="#999"
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
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
                                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainContainer')}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}