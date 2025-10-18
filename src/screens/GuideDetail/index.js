import React, { useRef } from "react";
import { 
    TouchableOpacity, 
    ScrollView, 
    View, 
    Text, 
    ImageBackground,
    Animated 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

export default function GuideDetail({ navigation, route }) {
    const { guia } = route.params;
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const getCategoryColor = (category) => {
        const colors = {
            "Memória": "#667eea",
            "Atenção": "#f093fb", 
            "Concentração": "#4facfe",
            "Reação": "#43e97b",
            "Lógica": "#fa709a",
            "Curiosidades": "#ffd200"
        };
        return colors[category] || "#666";
    };

    return (
        <View style={styles.container}>
            {/* Header Fixo */}
            <Animated.View style={[styles.fixedHeader, { opacity: headerOpacity }]}>
                <TouchableOpacity
                    style={styles.fixedBackButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#17285D" />
                </TouchableOpacity>
                <Text style={styles.fixedTitle} numberOfLines={1}>
                    {guia.titulo}
                </Text>
                <View style={styles.fixedPlaceholder} />
            </Animated.View>

            <Animated.ScrollView 
                style={styles.scrollView}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Hero Section - Altura Reduzida */}
                <ImageBackground 
                    source={{ uri: guia.img_url }} 
                    style={styles.heroImage}
                >
                    <View style={styles.heroOverlay} />
                    
                    {/* Botão Voltar Flutuante */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* Conteúdo do Hero - Mais Compacto */}
                    <View style={styles.heroContent}>
                        <View style={[
                            styles.categoryBadge,
                            { backgroundColor: getCategoryColor(guia.categoria) }
                        ]}>
                            <Text style={styles.categoryText}>{guia.categoria}</Text>
                        </View>
                        
                        <Text style={styles.title}>{guia.titulo}</Text>
                        
                        <View style={styles.metaContainer}>
                            <View style={styles.authorContainer}>
                                <Ionicons name="person-circle" size={16} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.author}>Por {guia.autor}</Text>
                            </View>

                            <View style={styles.metaInfo}>
                                <View style={styles.metaItem}>
                                    <Ionicons name="time" size={12} color="rgba(255,255,255,0.8)" />
                                    <Text style={styles.metaText}>5 min</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Ionicons name="eye" size={12} color="rgba(255,255,255,0.8)" />
                                    <Text style={styles.metaText}>Conhecimento</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>

                {/* Resto do conteúdo permanece igual */}
                <View style={styles.content}>
                    <View style={styles.contentHeader}>
                        <Text style={styles.contentTitle}>Sobre este guia</Text>
                        <View style={styles.divider} />
                    </View>
                    
                    <Text style={styles.text}>
                        {guia.conteudo}
                    </Text>

                    <View style={styles.tipsSection}>
                        <View style={styles.tipsHeader}>
                            <Ionicons name="bulb" size={24} color="#FFD700" />
                            <Text style={styles.tipsTitle}>Dica Importante</Text>
                        </View>
                        <Text style={styles.tipText}>
                            Pratique estas técnicas regularmente para obter os melhores resultados na sua memória.
                        </Text>
                    </View>

                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>Gostou deste guia?</Text>
                        <Text style={styles.ctaText}>
                            Explore mais conteúdos para continuar fortalecendo sua mente.
                        </Text>
                        <TouchableOpacity 
                            style={styles.ctaButton}
                            onPress={() => navigation.navigate("Guide")}
                        >
                            <Text style={styles.ctaButtonText}>Ver Mais Guias</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
}