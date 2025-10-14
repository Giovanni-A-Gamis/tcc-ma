import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f9fb",
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 16,
        backgroundColor: "#fff",
        elevation: 3,
    },
    cardImage: {
        height: 180,
        justifyContent: "flex-end",
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 10,
    },
    cardTitle: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Poppins_700Bold",
    },
    cardSubtitle: {
        color: "#ddd",
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
    },
    });
