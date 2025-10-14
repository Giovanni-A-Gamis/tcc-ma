import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f9fb",
    },
    image: {
        height: 250,
        justifyContent: "flex-end",
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    gameTitle: {
        color: "#fff",
        fontSize: 26,
        fontFamily: "Poppins_700Bold",
        textAlign: "center",
    },
    category: {
        color: "#ddd",
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: "#333",
        fontFamily: "Poppins_400Regular",
        marginBottom: 20,
        textAlign: "justify",
    },
    infoBox: {
        backgroundColor: "#e9f2f3",
        padding: 12,
        borderRadius: 10,
        marginBottom: 30,
    },
    infoText: {
        fontSize: 14,
        color: "#17285D",
        fontFamily: "Poppins_400Regular",
        marginBottom: 5,
    },
    bold: {
        fontFamily: "Poppins_700Bold",
    },
    button: {
        backgroundColor: "#8ec0c7",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10,
        elevation: 3,
    },
    secondaryButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#8ec0c7",
    },
    buttonText: {
        color: "#17285D",
        fontSize: 16,
        fontFamily: "Poppins_700Bold",
    },
    secondaryText: {
        color: "#8ec0c7",
    },
});