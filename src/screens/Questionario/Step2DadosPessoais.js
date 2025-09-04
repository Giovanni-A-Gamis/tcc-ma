import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from './styles';
import logo from '../../../assets/logo.png';
import fundo from '../../../assets/fundologin.png';

export default function Step2DadosPessoais({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [genero, setGenero] = useState('');

  const next = () => {
    navigation.navigate('Step3Pergunta', {
      formData: { ...route.params?.formData, nome, telefone, genero }
    });
  };

  return (
    <ImageBackground source={fundo} resizeMode="cover" style={styles.background}>
          <StatusBar style="light" />
          <View style={styles.overlay}>
            <View style={styles.card}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.title}>Dados Pessoais</Text>
    
              <View style={styles.allinput}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                  />
                </View>
    
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    value={telefone}
                    onChangeText={setTelefone}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Gênero"
                    value={genero}
                    onChangeText={setGenero}
                    placeholderTextColor="#999"
                  />

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
