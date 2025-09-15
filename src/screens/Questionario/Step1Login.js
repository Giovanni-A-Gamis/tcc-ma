  import React, { useState, useEffect } from 'react';
  import { View, Text, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
  import { StatusBar } from 'expo-status-bar';
  import { Ionicons } from '@expo/vector-icons';
  import { styles } from './styles';
  import logo from '../../../assets/logo.png';
  import fundo from '../../../assets/fundologin.png';

  export default function Step1Login({ navigation, route }) {
      const [email, setEmail] = useState(route.params?.formData?.email || '');
      const [senha, setSenha] = useState(route.params?.formData?.senha || '');
      const [confirmarSenha, setConfirmarSenha] = useState(route.params?.formData?.confirmarSenha || '');
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      // Estados de erro
      const [emailError, setEmailError] = useState('');
      const [senhaError, setSenhaError] = useState({ letra: false, numero: false, especial: false, tamanho: false });
      const [confirmarSenhaError, setConfirmarSenhaError] = useState('');

      const validateEmail = (email) => {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return regex.test(email);
      };

      const validateSenha = (senha) => ({
          letra: /[a-zA-Z]/.test(senha),
          numero: /[0-9]/.test(senha),
          especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
          tamanho: senha.length >= 6
      });

      useEffect(() => {
          setEmailError(email && !validateEmail(email) ? 'Isso não é um email válido' : '');
      }, [email]);

      useEffect(() => {
          setSenhaError(validateSenha(senha));
      }, [senha]);

      useEffect(() => {
          setConfirmarSenhaError(confirmarSenha && senha !== confirmarSenha ? 'As senhas não conferem' : '');
      }, [confirmarSenha, senha]);

      const next = () => {
          const emailValido = validateEmail(email);
          const senhaValida = Object.values(validateSenha(senha)).every(Boolean);
          const confirmarValido = senha === confirmarSenha && senha !== '';

          if (!emailValido || !senhaValida || !confirmarValido) {
              return; // os erros já são exibidos em tempo real
          }

          navigation.navigate('Step2DadosPessoais', {
              formData: { ...route.params?.formData, email: email.trim(), senha }
          });
      };

      const getColor = (valid) => valid ? 'green' : 'red';

      return (
          <ImageBackground source={fundo} resizeMode="cover" style={styles.background}>
              <StatusBar style="light" />
              <View style={styles.overlay}>
                  <View style={styles.card}>
                      <Image source={logo} style={styles.logo} />
                      <Text style={styles.title}>Seja bem-vindo ao MemóriaAtiva!</Text>

                      <View style={styles.allinput}>
                          {/* Email */}
                          <View style={[styles.inputContainer, emailError ? { borderColor: 'red' } : null]}>
                              <TextInput
                                  style={styles.input}
                                  placeholder="Email"
                                  value={email}
                                  onChangeText={setEmail}
                                  keyboardType="email-address"
                                  placeholderTextColor="#999"
                                  autoCapitalize="none"
                                  autoComplete="email"
                              />
                          </View>
                          {emailError ? <Text style={{ color: 'red', marginBottom: 15, marginTop: -7 }}>{emailError}</Text> : null}

                          {/* Senha */}
                          <View style={[styles.inputContainer, Object.values(senhaError).includes(false) && senha ? { borderColor: 'red' } : null]}>
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
                          {senha ? (
                              <View style={{ marginBottom: 10 }}>
                                  <Text style={{ color: getColor(senhaError.letra) }}>• Contém pelo menos 1 letra</Text>
                                  <Text style={{ color: getColor(senhaError.numero) }}>• Contém pelo menos 1 número</Text>
                                  <Text style={{ color: getColor(senhaError.especial) }}>• Contém pelo menos 1 caracter especial</Text>
                                  <Text style={{ color: getColor(senhaError.tamanho) }}>• Mínimo de 6 caracteres</Text>
                              </View>
                          ) : null}

                          {/* Confirmar Senha */}
                          <View style={[styles.inputContainer, confirmarSenhaError ? { borderColor: 'red' } : null]}>
                              <TextInput
                                  style={styles.input}
                                  placeholder="Confirmar Senha"
                                  value={confirmarSenha}
                                  onChangeText={setConfirmarSenha}
                                  secureTextEntry={!showConfirmPassword}
                                  placeholderTextColor="#999"
                              />
                              <TouchableOpacity
                                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                  style={styles.iconContainer}
                              >
                                  <Ionicons
                                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                                      size={24}
                                      color="gray"
                                  />
                              </TouchableOpacity>
                          </View>
                          {confirmarSenhaError ? <Text style={{ color: 'red', marginBottom: 5 }}>{confirmarSenhaError}</Text> : null}
                      </View>

                      <TouchableOpacity style={styles.button} onPress={next}>
                          <Text style={styles.buttonText}>Próximo</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </ImageBackground>
      );
  }
