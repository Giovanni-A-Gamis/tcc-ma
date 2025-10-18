import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Animated, Image, Text, StyleSheet } from 'react-native';
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

const Tab = createBottomTabNavigator();

// Estilos definidos fora do componente
const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
        marginTop: -7,
    },
    headerLeft: {
        marginLeft: 16,
    },
    headerIcon: {
        width: 32,
        height: 32,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        color: 'rgba(255,255,255,0.8)',
        marginTop: -2,
    },
    headerRightContainer: {
        marginRight: 16,
    },
    menuButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    menuContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    menuItemText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#17285D',
        marginLeft: 8,
    },
    menuDivider: {
        backgroundColor: '#f0f0f0',
        marginVertical: 4,
    },
    logoutText: {
        color: '#e74c3c',
    },
});

// Componente HeaderRight separado
function HeaderRightComponent({ navigation }) {
    const [visible, setVisible] = React.useState(false);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const openMenu = () => {
        setVisible(true);
        Animated.spring(scaleAnim, {
            toValue: 1.1,
            useNativeDriver: true,
        }).start();
    };

    const closeMenu = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    const handleMenuAction = (action) => {
        closeMenu();
        setTimeout(action, 200);
    };

    return (
        <View style={styles.headerRightContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <TouchableOpacity 
                            style={styles.menuButton}
                            onPress={openMenu}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="ellipsis-vertical" size={22} color="white" />
                        </TouchableOpacity>
                    }
                    contentStyle={styles.menuContent}
                >
                    <Menu.Item
                        onPress={() => handleMenuAction(() => navigation.navigate('Profile'))}
                        title={
                            <View style={styles.menuItem}>
                                <Ionicons name="person" size={18} color="#17285D" />
                                <Text style={styles.menuItemText}>Perfil</Text>
                            </View>
                        }
                    />
                    <Divider style={styles.menuDivider} />
                    <Menu.Item
                        onPress={() => handleMenuAction(() => navigation.navigate('About'))}
                        title={
                            <View style={styles.menuItem}>
                                <Ionicons name="information-circle" size={18} color="#17285D" />
                                <Text style={styles.menuItemText}>Sobre nós</Text>
                            </View>
                        }
                    />
                    <Divider style={styles.menuDivider} />
                    <Menu.Item
                        onPress={() => handleMenuAction(() => console.log('Ativar modo escuro'))}
                        title={
                            <View style={styles.menuItem}>
                                <Ionicons name="moon" size={18} color="#17285D" />
                                <Text style={styles.menuItemText}>Modo escuro</Text>
                            </View>
                        }
                    />
                    <Divider style={styles.menuDivider} />
                    <Menu.Item
                        onPress={() => handleMenuAction(() => handleLogout(navigation))}
                        title={
                            <View style={styles.menuItem}>
                                <Ionicons name="log-out" size={18} color="#e74c3c" />
                                <Text style={[styles.menuItemText, styles.logoutText]}>Sair</Text>
                            </View>
                        }
                    />
                </Menu>
            </Animated.View>
        </View>
    );
}

export default function MainContainer() {
    Handler();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let iconSize = focused ? 26 : 22;
                    
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Jogos') iconName = focused ? 'game-controller' : 'game-controller-outline';
                    else if (route.name === 'Guia') iconName = focused ? 'school' : 'school-outline';
                    else if (route.name === 'Alarmes') iconName = focused ? 'alarm' : 'alarm-outline';
                    else if (route.name === 'Diário') iconName = focused ? 'book' : 'book-outline';
                    
                    return (
                        <View style={styles.iconContainer}>
                            <Ionicons name={iconName} size={iconSize} color={color} />
                        </View>
                    );
                },

                // MOSTRAR OS NOMES DA TAB BAR
                tabBarShowLabel: true,

                headerShown: true,
                headerStyle: { 
                    backgroundColor: '#17285D',
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 100,
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontSize: 22,
                    fontFamily: 'Poppins_700Bold',
                    color: 'white'
                },
                headerTitleAlign: 'center',

                headerLeft: () => (
                    <View style={styles.headerLeft}>
                        <Ionicons name="analytics" size={28} color="white" />
                    </View>
                ),

                headerRight: () => <HeaderRightComponent navigation={useNavigation()} />,

                tabBarActiveTintColor: '#8ec0c7',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
                tabBarLabelStyle: { 
                    paddingBottom: 8, 
                    fontSize: 10, 
                    fontFamily: 'Poppins_400Regular',
                    marginTop: -2,
                },
                tabBarStyle: { 
                    height: 75,
                    backgroundColor: '#17285D',
                    borderTopWidth: 0,
                    elevation: 15,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                },
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ 
                    title: 'Início',
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>MemoriaAtiva</Text>
                            <Text style={styles.headerSubtitle}>Treine sua mente</Text>
                        </View>
                    ),
                }} 
            />
            <Tab.Screen 
                name="Jogos" 
                component={GameScreen} 
                options={{ 
                    title: 'Jogos',
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Jogos Mentais</Text>
                            <Text style={styles.headerSubtitle}>Fortaleça sua memória</Text>
                        </View>
                    ),
                }} 
            />
            <Tab.Screen 
                name="Guia" 
                component={GuideScreen} 
                options={{ 
                    title: 'Guia',
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Guias</Text>
                            <Text style={styles.headerSubtitle}>Aprenda e evolua</Text>
                        </View>
                    ),
                }} 
            />
            <Tab.Screen 
                name="Alarmes" 
                component={AlarmScreen} 
                options={{ 
                    title: 'Alarmes',
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Alarmes</Text>
                            <Text style={styles.headerSubtitle}>Lembretes inteligentes</Text>
                        </View>
                    ),
                }} 
            />
            <Tab.Screen 
                name="Diário" 
                component={DailyScreen} 
                options={{ 
                    title: 'Diário',
                    headerTitle: () => (
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Diário</Text>
                            <Text style={styles.headerSubtitle}>Registre suas memórias</Text>
                        </View>
                    ),
                }} 
            />        
        </Tab.Navigator>
    );
}