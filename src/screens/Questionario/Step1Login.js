import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import logo from '../../../assets/logo.png';
import fundo from '../../../assets/fundologin.png';

export default function Step1Login({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const next = () => {
    navigation.navigate('Step2DadosPessoais', {
      formData: { ...route.params?.formData, email, senha }
    });
  };

  return (
    <ImageBackground source={fundo} resizeMode="cover" style={styles.background}>
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Seja bem-vindo ao MemóriaAtiva!</Text>

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
                value={senha}
                onChangeText={setSenha}
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

          <TouchableOpacity style={styles.button} onPress={next}>
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
