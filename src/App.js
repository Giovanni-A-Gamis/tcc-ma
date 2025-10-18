import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './navigation/RootNavigator';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular: require('../assets/fonts/Poppins-Regular.ttf'),
    Poppins_500Medium: require('../assets/fonts/Poppins-Medium.ttf'),
    Poppins_600SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    Poppins_700Bold: require('../assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) return null;
  
  return (
    <PaperProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
