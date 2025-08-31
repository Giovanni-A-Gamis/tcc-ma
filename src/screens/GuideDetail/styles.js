import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
    },
    headerImage: {
        width: "100%",
        height: 200,
        justifyContent: "flex-end",
    },
    headerContent: {
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
        fontFamily: 'Poppins_700Bold',
    },
    author: {
        fontSize: 14,
        color: "#fff",
        marginTop: 4,
        fontFamily: 'Poppins_400Regular',
    },
    content: {
        padding: 16,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: "#333",
        fontFamily: 'Poppins_400Regular',
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        position: "absolute",
        top: 40,
        left: 16,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 20,
    },

});