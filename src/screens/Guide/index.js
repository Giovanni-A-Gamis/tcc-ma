import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, FlatList, Dimensions } from "react-native";
import { getGuides } from "../../services/guideService";
import { styles } from "./styles";

const { width } = Dimensions.get("window");
const HIGHLIGHT_CARD_WIDTH = width - 64; // Largura do card menos o padding horizontal do container

export default function Guide({ navigation }) {
    const [guides, setGuides] = useState([]);
    const [highlightGuides, setHighlightGuides] = useState([]);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const fetchGuides = async () => {
        const data = await getGuides();
        setGuides(data);

            if (data.length > 0) {
                // Embaralhar e pegar 3 destaques
                const shuffled = data.sort(() => 0.5 - Math.random());
                setHighlightGuides(shuffled.slice(0, 3));
            }
        };
        fetchGuides();

    }, []);

    // Efeito para o carrossel rodar sozinho
    useEffect(() => {
        if (highlightGuides.length > 0) {
            const interval = setInterval(() => {
            setHighlightIndex(prevIndex => {
                const newIndex = (prevIndex + 1) % highlightGuides.length;
                // Rola para o novo item
                flatListRef.current?.scrollToOffset({
                    offset: newIndex * (HIGHLIGHT_CARD_WIDTH + 16), // Largura do card + margem
                    animated: true,
                });
                return newIndex;
            });
        }, 5000); // 3 segundos
        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
        }
    }, [highlightGuides]);

    const categorias = [
        "Memória",
        "Atenção",
        "Concentração",
        "Reação",
        "Lógica",
        "Curiosidades",
    ];

    const renderSection = (categoria) => {
        const data = guides.filter((g) => g.categoria === categoria);

        if (data.length === 0) return null;

        return (
            <View style={styles.section} key={categoria}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Guias sobre {categoria}</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data.map((item) => (
                    <View key={item.id || item.titulo} style={{ marginRight: 10 }}>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate("GuideDetail", { guia: item })}
                        >
                            <ImageBackground
                                source={{ uri: item.img_url }}
                                style={styles.cardImage}
                                imageStyle={{ borderRadius: 12 }}
                            >
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle} numberOfLines={2}>
                                    {item.titulo}
                                </Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    <Text style={styles.cardAuthor} numberOfLines={1}>
                        Por: {item.autor}
                    </Text>
                </View>
            ))}
            </ScrollView>
        </View>
        );

    };

    const renderHighlightItem = ({ item }) => (
        
        <TouchableOpacity
            style={[styles.highlightCard, { width: HIGHLIGHT_CARD_WIDTH, marginRight: 16 }]}
            onPress={() => navigation.navigate("GuideDetail", { guia: item })}
        >
            <ImageBackground
                source={{ uri: item.img_url }}
                style={styles.highlightImage}
                imageStyle={{ borderRadius: 20 }}
            >
                <View style={styles.highlightContent}>
                    <Text style={styles.highlightTitle}>
                        {item.titulo}
                    </Text>
                    <Text style={styles.highlightAuthor}>
                        Por: {item.autor}
                    </Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Destaque do dia com rolagem horizontal e automática */}
            {highlightGuides.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                    <FlatList
                        ref={flatListRef}
                        data={highlightGuides}
                        renderItem={renderHighlightItem}
                        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={HIGHLIGHT_CARD_WIDTH + 16}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                    />
                </View>
            )}

                {/* Seções por categoria */}
            {categorias.map((cat) => renderSection(cat))}
        </ScrollView>

    );
}