import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 16,
    },

    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
        color: "#333",
    },

    diaryList: {
        flex: 1,
        marginBottom: 60, 
    },

    diaryItem: {
        backgroundColor: "#FFF",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 3,
    },

    diaryDate: {
        fontSize: 19,
        color: "#000",
        marginBottom: 6,
        fontFamily: 'Poppins_700Bold'
    },

    diaryContent: {
        fontSize: 16,
        color: "#333",
        fontFamily: 'Poppins_400Regular'
    },

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

    fabText: {
        fontSize: 30,
        color: "#FFF",
        fontWeight: "bold",
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
        borderRadius: 10,
        width: "90%",
        elevation: 5,
        
    },

    modalTitle: {
        fontSize: 20,
        marginBottom: 12,
        color: "#333",
        textAlign: "center",
        fontFamily: 'Poppins_700Bold'
    },

    textArea: {
        height: 150,
        borderColor: "#CCC",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        textAlignVertical: "top",
        backgroundColor: "#FAFAFA",
        fontFamily: 'Poppins_400Regular'
    },

    saveButton: {
        backgroundColor: "#8ec0c7",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },

    saveButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: 'Poppins_700Bold'
    },

    cancelButton: {
        backgroundColor: "#E0E0E0",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },

    cancelButtonText: {
        color: "#333",
        fontSize: 14,
        fontFamily: 'Poppins_700Bold'
    },
    todayDiaryItem: {
        backgroundColor: '#f0f8ff',
        borderLeftWidth: 4,
        borderLeftColor: '#8ec0c7',
        marginBottom: 12,
    },
    diaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#8ec0c7',
    },
    editButtonText: {
        marginLeft: 4,
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        color: '#17285D',
    },
});