import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F4F8",
        padding: 16,
        paddingTop: 25,
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    dayCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#d6d9e0",
        alignItems: "center",
        justifyContent: "center",
    },
    dayText: {
        fontFamily: "Poppins_700Bold",
        fontSize: 12,
        color: "#17285D",
    },
    agendaButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#17285D",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        marginBottom: 20,
    },
    greeting: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        color: "#17285D",
    },
    username: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "#555",
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: "Poppins_700Bold",
        fontSize: 15,
        color: "#17285D",
        marginBottom: 8,
    },
    gameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    gameCard: {
        backgroundColor: "#fff",
        width: "31%",
        borderRadius: 12,
        alignItems: "center",
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    gameName: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#17285D",
        marginTop: 4,
        textAlign: "center",
    },
    featureCard: {
        backgroundColor: "#17285D",
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    cardCategory: {
        fontFamily: "Poppins_400Regular",
        fontSize: 13,
        color: "#ccd3ff",
    },
    cardTitle: {
        fontFamily: "Poppins_700Bold",
        fontSize: 18,
        color: "#fff",
    },
    playButton: {
        backgroundColor: "#fff",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    playText: {
        color: "#17285D",
        fontFamily: "Poppins_700Bold",
        fontSize: 14,
    },
    animation: {
        width: 200,
        height: 550,
        marginTop: -210,
        marginBottom: -240,
        alignItems: 'center',
        justifyContent: 'center',

    },
    spacer: {
        alignItems: 'center',
        justifyContent: 'center',
    }

});
