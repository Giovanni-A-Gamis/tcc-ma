import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainContainer from './MainContainer';

import BoasVindas from '../screens/Welcome';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import GuideDetail from '../screens/GuideDetail';
import About from '../screens/About';
import GamePlaceholder from '../screens/Games/GamePlaceholder';
import GameIntro from '../screens/Games/GameIntro';
import MemoryPairs from "../screens/Games/Play/MemoryPairs";
import SequenceMemory from '../screens/Games/Play/SequenceMemory';
import QuebraCodigo from '../screens/Games/Play/QuebraCodigo';
import PalavrasFugidias from '../screens/Games/Play/PalavrasFugitivas';
import StroopGame from '../screens/Games/Play/Stroop';

import Step1Login from '../screens/Questionario/Step1Login';
import Step2DadosPessoais from '../screens/Questionario/Step2DadosPessoais';
import Step3Pergunta from '../screens/Questionario/Step3Pergunta';
import Step4Memoria1 from '../screens/Questionario/Step4Memoria1';
import Step5Memoria2 from '../screens/Questionario/Step5Memoria2';
import Step6Memoria3 from '../screens/Questionario/Step6Memoria3';
import Step7Memoria4 from '../screens/Questionario/Step7Memoria4';
import Step8Memoria5 from '../screens/Questionario/Step8Memoria5';
import Laudo from '../screens/Questionario/Laudo';
import Step9BemVindo from '../screens/Questionario/Step9BemVindo';



const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={BoasVindas} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Profile" component={Profile} options={{title: 'Perfil', headerShown: true, headerStyle: {backgroundColor: '#17285D'}, headerTintColor: 'white', headerTitleStyle: {fontFamily: 'Poppins_700Bold'}}}/>
            <Stack.Screen name="GuideDetail" component={GuideDetail} />
            <Stack.Screen name="About" component={About} options={{title: 'Sobre', headerShown: true, headerStyle: {backgroundColor: '#17285D'}, headerTintColor: 'white', headerTitleStyle: {fontFamily: 'Poppins_700Bold' }}}/>

            {/*Games*/}

            <Stack.Screen
                name="MemoryPairs"
                component={MemoryPairs}
                options={{
                    title: "Jogo da Memória",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#17285D" },
                    headerTintColor: "white",
                    headerTitleStyle: { fontFamily: "Poppins_700Bold" },
                }}
            />

            <Stack.Screen
                name="SequenceMemory"
                component={SequenceMemory}
                options={{
                    title: "Sequência Atencional",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#17285D" },
                    headerTintColor: "white",
                    headerTitleStyle: { fontFamily: "Poppins_700Bold" },
                }}
            />

            <Stack.Screen
                name="QuebraCodigo"
                component={QuebraCodigo}
                options={{
                    title: "Quebra-Código",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#17285D" },
                    headerTintColor: "white",
                    headerTitleStyle: { fontFamily: "Poppins_700Bold" },
                }}
            />

            <Stack.Screen
                name="PalavrasFugidias"
                component={PalavrasFugidias}
                options={{
                    title: "Palavras Fugidias",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#17285D" },
                    headerTintColor: "white",
                    headerTitleStyle: { fontFamily: "Poppins_700Bold" },
                }}
            />

            <Stack.Screen
                name="Stroop"
                component={StroopGame}
                options={{
                    title: "Efeito Stroop",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#17285D" },
                    headerTintColor: "white",
                    headerTitleStyle: { fontFamily: "Poppins_700Bold" },
                }}
            />

            <Stack.Screen
                name="GamePlaceholder"
                component={GamePlaceholder}
                options={{
                    title: "Jogo",
                    headerShown: true,
                    headerStyle: { backgroundColor: "#17285D" },
                    headerTintColor: "white",
                    headerTitleStyle: { fontSize: 20, fontFamily: "Poppins_700Bold", color: "white" },
                }}
            />

            <Stack.Screen
                name="GameIntro"
                component={GameIntro}
            />


            <Stack.Screen name="Step1Login" component={Step1Login} />
            <Stack.Screen name="Step2DadosPessoais" component={Step2DadosPessoais} />
            <Stack.Screen name="Step3Pergunta" component={Step3Pergunta} />
            <Stack.Screen name="Step4Memoria1" component={Step4Memoria1} />
            <Stack.Screen name="Step5Memoria2" component={Step5Memoria2} />
            <Stack.Screen name="Step6Memoria3" component={Step6Memoria3} />
            <Stack.Screen name="Step7Memoria4" component={Step7Memoria4} />
            <Stack.Screen name="Step8Memoria5" component={Step8Memoria5} />
            <Stack.Screen name="Laudo" component={Laudo} />
            <Stack.Screen name="Step9BemVindo" component={Step9BemVindo} />

            <Stack.Screen name="MainContainer" component={MainContainer} options={{ headerTitleStyle: { fontSize: 20, fontFamily: "Poppins_700Bold", color: "white" }}}/>
        </Stack.Navigator>
    )
}
