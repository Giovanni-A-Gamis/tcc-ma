import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity } from 'react-native';
import { Menu, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Handler from '../hooks/BackHandler';
import { handleLogout } from '../hooks/HandleLogout';

// Telas
import HomeScreen from '../screens/Home/index';
import GuideScreen from '../screens/Guide/index';
import GameScreen from '../screens/Games/index';
import AlarmScreen from '../screens/Alarm/index';
import DailyScreen from '../screens/Daily/index';
import ProfileScreen from '../screens/Profile/index';
import AboutScreen from '../screens/About/index';

const homeName = 'Home';
const guideName = 'Guia';
const gameName = 'Jogos';
const alarmName = 'Alarme';
const dailyName = 'Diário';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    Handler();

    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === homeName) iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === guideName) iconName = focused ? 'school' : 'school-outline';
                    else if (route.name === gameName) iconName = focused ? 'game-controller' : 'game-controller-outline';
                    else if (route.name === alarmName) iconName = focused ? 'alarm' : 'alarm-outline';
                    else if (route.name === dailyName) iconName = focused ? 'book' : 'book-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },

                headerShown: true,
                headerStyle: { backgroundColor: '#17285D' },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                    fontFamily: 'Poppins_700Bold',
                    color: 'white'
                },

                headerRight: () => <HeaderRight navigation={navigation} />,

                tabBarActiveTintColor: '#8ec0c7',
                tabBarInactiveTintColor: 'white',
                tabBarLabelStyle: { paddingBottom: 10, fontSize: 10, fontFamily: 'Poppins_400Regular' },
                tabBarStyle: { padding: 10, height: 70, backgroundColor: '#17285D' },
            })}
        >
            <Tab.Screen name={homeName} component={HomeScreen} options={{ title: 'Início' }} />
            <Tab.Screen name={gameName} component={GameScreen} options={{ title: 'Jogos' }} />
            <Tab.Screen name={guideName} component={GuideScreen} options={{ title: 'Guia' }} />
            <Tab.Screen name={alarmName} component={AlarmScreen} options={{ title: 'Alarmes' }} />
            <Tab.Screen name={dailyName} component={DailyScreen} options={{ title: 'Diário' }} />
            


        </Tab.Navigator>
    );
}

// Menu do header
function HeaderRight({ navigation }) {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const nav = useNavigation();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity onPress={openMenu}>
                        <Ionicons name="menu" size={24} color="white" style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                }
                contentStyle={{ backgroundColor: '#17285D' }}
            >
                <Menu.Item
                    onPress={() => {
                        closeMenu();
                        navigation.navigate(ProfileScreen);
                    }}
                    title="Perfil"
                    titleStyle={{ color: 'white', fontStyle: 'italic' }}
                />
                <Divider />
                <Menu.Item
                    onPress={() => {
                        closeMenu();
                        navigation.navigate(AboutScreen);
                    }}
                    title="Sobre nós"
                    titleStyle={{ color: 'white', fontStyle: 'italic' }}
                />
                <Divider />
                <Menu.Item
                    onPress={() => {
                        closeMenu();
                        console.log('Ativar modo escuro');
                    }}
                    title="Modo escuro"
                    titleStyle={{ color: 'white', fontStyle: 'italic' }}
                />
            </Menu>
        </View>
    );
}
