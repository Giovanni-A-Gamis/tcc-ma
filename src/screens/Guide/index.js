import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import { getGuides } from "../../services/guideService";
import { styles } from "./styles";

export default function Guide({ navigation }) {
    const [guides, setGuides] = useState([]);
    const [highlightGuides, setHighlightGuides] = useState([]);
    const [highlightIndex, setHighlightIndex] = useState(0);

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

    return (
        <ScrollView style={styles.container}>
            {/* Destaque do dia com setas dentro do card */}
            {highlightGuides.length > 0 && (
                <View style={{ marginBottom: 20, paddingHorizontal: 16 }}>
                    <View style={styles.highlightCardContainer}>
                        <TouchableOpacity
                            style={styles.highlightCard}
                            onPress={() =>
                                navigation.navigate("GuideDetail", { guia: highlightGuides[highlightIndex] })
                            }
                        >
                            <ImageBackground
                                source={{ uri: highlightGuides[highlightIndex].img_url }}
                                style={styles.highlightImage}
                                imageStyle={{ borderRadius: 20 }}
                            >
                                <View style={styles.highlightContent}>
                                    <Text style={styles.highlightTitle}>
                                        {highlightGuides[highlightIndex].titulo}
                                    </Text>
                                    <Text style={styles.highlightAuthor}>
                                        Por: {highlightGuides[highlightIndex].autor}
                                    </Text>
                                </View>

                                {/* Setas dentro do card */}
                                <TouchableOpacity
                                    style={[styles.arrowContainer, { left: 10 }]}
                                    onPress={() =>
                                        setHighlightIndex(
                                        (prev) => (prev - 1 + highlightGuides.length) % highlightGuides.length
                                        )
                                    }
                                >
                                    <Text style={styles.arrow}>{"<"}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.arrowContainer, { right: 10 }]}
                                    onPress={() =>
                                        setHighlightIndex((prev) => (prev + 1) % highlightGuides.length)
                                    }
                                >
                                    <Text style={styles.arrow}>{">"}</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Seções por categoria */}
            {categorias.map((cat) => renderSection(cat))}
        </ScrollView>
    );
}
