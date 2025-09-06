import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        fontFamily: "Poppins_400Regular",
    },
    content: {
        padding: 20,
        alignItems: "center",
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    nome: {
        fontSize: 20,
        fontWeight: "700",
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
    },
    actions: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        marginBottom: 40,
    },
    button: {
        backgroundColor: "#4A90E2",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    logoutButton: {
        backgroundColor: "#E74C3C",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    // -------- ADIÇÕES --------
    smallButton: {
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: "#4A90E2",
        borderRadius: 8,
        alignSelf: "center",
    },
    smallButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    section: {
        marginTop: 20,
        marginHorizontal: 20,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
    },
    placeholder: {
        fontStyle: "italic",
        color: "gray",
    },
    avatarsModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarsModal: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
    },
    avatarsGrid: {
        marginTop: 12,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    avatarOption: {
        width: "48%",
        aspectRatio: 1,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    avatarOptionImage: {
        width: "100%",
        height: "100%",
    },
    closeModalButton: {
        marginTop: 8,
        alignSelf: "center",
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
    },
});
