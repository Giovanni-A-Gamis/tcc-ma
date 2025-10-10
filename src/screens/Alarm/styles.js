import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F7",
        padding: 16,
    },
    list: {
        flex: 1,
    },
    alarmCard: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
    },
    // NOVO: Estilo para alarmes inativos (desligados)
    alarmCardInativo: {
        backgroundColor: '#F5F5F5', // Cor de fundo mais clara
        opacity: 0.8, // Opacidade reduzida
    },
    alarmHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    alarmTime: {
        fontSize: 28,
        marginBottom: -6,
        color: "#333",
        fontFamily: 'Poppins_700Bold',
    },
    alarmTitle: {
        fontSize: 16,
        marginTop: 4,
        color: "#444",
        fontFamily: 'Poppins_400Regular',
    },
    // NOVO: Estilo de texto para quando o alarme está inativo
    textInativo: {
        color: '#A0A0A0', // Texto acinzentado
    },
    diasContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },
    dia: {
        marginRight: 8,
        fontSize: 14,
        color: "#AAA",
        fontFamily: 'Poppins_400Regular',
    },
    diaAtivo: {
        color: "#000",
        fontFamily: 'Poppins_700Bold',
    },
    // NOVO: Estilo para o dia da semana quando o alarme está inativo
    diaInativo: {
        opacity: 0.4,
    },

    // FAB
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#8ec0c7",
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 12,
        width: "85%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 6,
    },
    diaSelecionavel: {
        borderWidth: 1,
        borderColor: "#CCC",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        margin: 4,
    },
    diaSelecionado: {
        backgroundColor: "#3B82F6",
        borderColor: "#3B82F6",
    },
    diaTexto: {
        color: "#333",
    },
    saveButton: {
        backgroundColor: "#3B82F6",
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelButton: {
        marginTop: 10,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#555",
    },
});