import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainContainer from './MainContainer';

import BoasVindas from '../screens/Welcome';
import Login from '../screens/Login';
import Questionario from '../screens/Questionario';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={BoasVindas} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Questionario" component={Questionario} />
            <Stack.Screen name="MainContainer" component={MainContainer} />
            <Stack.Screen name="GuideDetail" component={require('../screens/GuideDetail').default} /*options={{title: '', headerShown: true}}*/ />
        </Stack.Navigator>
    )
}