import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ou outro ícone que preferir
import { ScrollView, View, Text, ImageBackground } from "react-native";
import { styles } from "./styles";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";

export default function GuideDetail({ navigation, route }) {
    const { guia } = route.params;

    return (
        <ScrollView style={styles.container}>
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 6, fontFamily: 'Poppins_400Regular' }}>Voltar</Text>
        </TouchableOpacity>

        <ImageBackground 
            source={{ uri: guia.img_url }} 
            style={styles.headerImage}
            imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        >
            <View style={styles.headerContent}>
            <Text style={styles.title}>{guia.titulo}</Text>
            <Text style={styles.author}>Por {guia.autor}</Text>
            </View>
        </ImageBackground>

        <View style={styles.content}>
            <Text style={styles.text}>{guia.conteudo}</Text>
        </View>
        </ScrollView>
    );
}
