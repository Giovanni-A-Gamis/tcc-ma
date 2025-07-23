import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'react-native';

// Screens
import HomeScreen from './screens/HomeScreen';
import GuideScreen from './screens/GuideScreen';
import GameScreen from './screens/GamesScreen';
import AlarmScreen from './screens/AlarmScreen';
import DailyScreen from './screens/DailyScreen';    

// Screens names
const homeName = 'Home';
const guideName = 'Guia';
const gameName = 'Jogos';
const alarmName = 'Alarme';
const dailyName = 'Diário';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === guideName) {
                        iconName = focused ? 'school' : 'school-outline';
                    } else if (rn === gameName) {
                        iconName = focused ? 'game-controller' : 'game-controller-outline';
                    } else if (rn === alarmName) {
                        iconName = focused ? 'alarm' : 'alarm-outline';
                    } else if (rn === dailyName) {
                        iconName = focused ? 'book' : 'book-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                    
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'white',
                    tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
                    tabBarStyle: { padding: 10, height: 70, backgroundColor: '#17285D' },
    })}
>
                <Tab.Screen name={homeName} component={HomeScreen} />
                <Tab.Screen name={gameName} component={GameScreen} />  
                <Tab.Screen name={guideName} component={GuideScreen} /> 
                <Tab.Screen name={alarmName} component={AlarmScreen} />
                <Tab.Screen name={dailyName} component={DailyScreen} />

            </Tab.Navigator>
        </NavigationContainer>
    )
}