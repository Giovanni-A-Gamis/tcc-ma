import React, { useEffect, useState, useRef } from "react";
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    ImageBackground, 
    FlatList, 
    Dimensions,
    Animated 
} from "react-native";
import { getGuides } from "../../services/guideService";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const HIGHLIGHT_CARD_WIDTH = width - 64;

export default function Guide({ navigation }) {
    const [guides, setGuides] = useState([]);
    const [highlightGuides, setHighlightGuides] = useState([]);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [fadeAnim] = useState(new Animated.Value(0));
    const flatListRef = useRef(null);

    useEffect(() => {
        const fetchGuides = async () => {
            const data = await getGuides();
            setGuides(data);

            if (data.length > 0) {
                const shuffled = data.sort(() => 0.5 - Math.random());
                setHighlightGuides(shuffled.slice(0, 3));
            }
            
            // Animação de entrada
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        };
        fetchGuides();
    }, []);

    useEffect(() => {
        if (highlightGuides.length > 0) {
            const interval = setInterval(() => {
                setHighlightIndex(prevIndex => {
                    const newIndex = (prevIndex + 1) % highlightGuides.length;
                    flatListRef.current?.scrollToOffset({
                        offset: newIndex * (HIGHLIGHT_CARD_WIDTH + 16),
                        animated: true,
                    });
                    return newIndex;
                });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [highlightGuides]);

    const categorias = [
        { name: "Memória", icon: "🧠", color: "#667eea" },
        { name: "Atenção", icon: "👁️", color: "#f093fb" },
        { name: "Concentração", icon: "🎯", color: "#4facfe" },
        { name: "Reação", icon: "⚡", color: "#43e97b" },
        { name: "Lógica", icon: "🔍", color: "#fa709a" },
        { name: "Curiosidades", icon: "💡", color: "#ffd200" },
    ];

    const getCategoryColor = (categoryName) => {
        const category = categorias.find(cat => cat.name === categoryName);
        return category ? category.color : "#666";
    };

    const renderSection = (categoria) => {
        const data = guides.filter((g) => g.categoria === categoria.name);

        if (data.length === 0) return null;

        return (           
            <View style={styles.section} key={categoria.name}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionIcon}>{categoria.icon}</Text>
                        <Text style={styles.sectionTitle}>Guias de {categoria.name}</Text>
                    </View>
                </View>

                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScroll}
                >
                    {data.map((item, index) => (
                        <TouchableOpacity
                            key={item.id || item.titulo}
                            style={[
                                styles.card,
                                { 
                                    marginLeft: index === 0 ? 0 : 12,
                                    borderLeftColor: getCategoryColor(categoria.name)
                                }
                            ]}
                            onPress={() => navigation.navigate("GuideDetail", { guia: item })}
                        >
                            <ImageBackground
                                source={{ uri: item.img_url }}
                                style={styles.cardImage}
                                imageStyle={styles.cardImageStyle}
                            >
                                <View style={styles.cardGradient} />
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle} numberOfLines={2}>
                                        {item.titulo}
                                    </Text>
                                    <View style={styles.cardFooter}>
                                        <Ionicons name="person-outline" size={12} color="rgba(255,255,255,0.8)" />
                                        <Text style={styles.cardAuthor}>
                                            {item.autor}
                                        </Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    const renderHighlightItem = ({ item, index }) => (
        <TouchableOpacity
            style={[styles.highlightCard, { width: HIGHLIGHT_CARD_WIDTH }]}
            onPress={() => navigation.navigate("GuideDetail", { guia: item })}
            activeOpacity={0.9}
        >
            <ImageBackground
                source={{ uri: item.img_url }}
                style={styles.highlightImage}
                imageStyle={styles.highlightImageStyle}
            >
                <View style={styles.highlightGradient} />
                <View style={styles.highlightContent}>
                    <View style={styles.highlightBadge}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.highlightBadgeText}>Destaque</Text>
                    </View>
                    <Text style={styles.highlightTitle} numberOfLines={2}>
                        {item.titulo}
                    </Text>
                    <View style={styles.highlightFooter}>
                        <View style={styles.authorInfo}>
                            <Ionicons name="person-circle" size={16} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.highlightAuthor}>Por {item.autor}</Text>
                        </View>
                        <View style={styles.readTime}>
                            <Ionicons name="time" size={14} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.readTimeText}>5 min</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <Animated.ScrollView 
            style={[styles.container, { opacity: fadeAnim }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Guia de Memória 🧠</Text>
                    <Text style={styles.headerSubtitle}>
                        Descubra técnicas e curiosidades para fortalecer sua mente
                    </Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Ionicons name="book" size={20} color="#17285D" />
                        <Text style={styles.statText}>{guides.length} guias</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="trending-up" size={20} color="#17285D" />
                        <Text style={styles.statText}>Conhecimento</Text>
                    </View>
                </View>
            </View>

            {/* Carrossel de Destaques */}
            {highlightGuides.length > 0 && (
                <View style={styles.highlightSection}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Ionicons name="flash" size={20} color="#FF6B6B" />
                            <Text style={styles.highlightSectionTitle}>Em Destaque</Text>
                        </View>
                        <View style={styles.pagination}>
                            {highlightGuides.map((_, index) => (
                                <View 
                                    key={index}
                                    style={[
                                        styles.paginationDot,
                                        index === highlightIndex && styles.paginationDotActive
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                    
                    <FlatList
                        ref={flatListRef}
                        data={highlightGuides}
                        renderItem={renderHighlightItem}
                        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={HIGHLIGHT_CARD_WIDTH + 16}
                        decelerationRate="fast"
                        contentContainerStyle={styles.highlightList}
                        onMomentumScrollEnd={(event) => {
                            const newIndex = Math.round(
                                event.nativeEvent.contentOffset.x / (HIGHLIGHT_CARD_WIDTH + 16)
                            );
                            setHighlightIndex(newIndex);
                        }}
                    />
                </View>
            )}

            {/* Seções por Categoria */}
            <View style={styles.categoriesContainer}>
                {categorias.map((cat) => renderSection(cat))}
            </View>

            {/* Footer Motivacional */}
            <View style={styles.footer}>
                <Ionicons name="bulb" size={24} color="#FFD700" />
                <Text style={styles.footerText}>
                    Aprender algo novo todos os dias mantém sua mente afiada!
                </Text>
            </View>
        </Animated.ScrollView>
    );
}