import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { styles }from './styles';

export default function About() {
        return (
            <View style={styles.container}>
                <Image 
                    source={require('../../../assets/logo.png')} 
                    style={{ width: 150, height: 150, marginBottom: 20 }}
                    resizeMode="contain"
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Sobre o Aplicativo</Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginHorizontal: 20 }}>
                    Este aplicativo foi desenvolvido como parte de um projeto de TCC para auxiliar na melhoria da memória e qualidade de vida dos idosos. 
                    Ele oferece jogos cognitivos, um alarme para lembrar de tomar medicamentos e um diário para registrar atividades diárias.
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginHorizontal: 20, marginTop: 10 }}>
                    Desenvolvido por Felipe Pedroso Cantanhede; Giovanni Alcaraz Gamis; Gustavo Pietro de Assis Silva.
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginHorizontal: 20, marginTop: 10 }}>
                    Versão 1.0.0
                </Text>
            </View>
        )
}