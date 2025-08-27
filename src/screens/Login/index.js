import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    ImageBackground,
} from 'react-native';
import { styles } from './styles';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import logocnome from '../../../assets/logocnome.png';
import fundo from '../../../assets/fundologin.png';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

  return (
    <ImageBackground
      source={fundo}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <StatusBar style="light" />
        <Image source={logocnome} style={styles.logocnome} />
        

        <View style={styles.allinput}>
        <Text style={styles.title}>Seja bem-vindo de volta!</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
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
          onPress={() => navigation.navigate('MainContainer')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
