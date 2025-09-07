import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 16,
    },
    
    section: {
        marginBottom: 24,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: "#333",
    },

    seeMore: {
        fontSize: 14,
        color: "#4A90E2",
        fontWeight: "500",
    },

    card: {
        width: 160,
        height: 110,
        borderRadius: 12,
        overflow: "hidden",
        marginRight: 10,
    },

    cardImage: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 8,
    },

    cardContent: {
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 4,
        borderRadius: 5,
    },

    cardTitle: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center",
        fontFamily: 'Poppins_400Regular',
    },
    cardAuthor: {
        marginTop: 4,
        fontSize: 13,
        color: "#555",
        fontFamily: 'Poppins_400Regular',
    },

    highlightCard: {
        width: "100%",
        marginBottom: 12,
        marginTop: 20,
        height: 180,
        flex: 1,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
    },

    highlightImage: {
        flex: 1,
        justifyContent: "flex-end",
    },

    highlightContent: {
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 16,
    },

    highlightTitle: {
        color: "#fff",
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
    },

    highlightAuthor: {
        color: "#fff",
        fontSize: 14,
        marginTop: 4,
        fontFamily: 'Poppins_400Regular',
    },

    arrowContainer: {
        position: "absolute",
        top: "50%",
        transform: [{ translateY: -12 }],
        borderRadius: 20,
    },

    arrow: {
        fontSize: 30,
        fontFamily: 'Poppins_700Bold',
        color: "#17285D",
    },
});
