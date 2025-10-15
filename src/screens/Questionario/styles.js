import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
    },

    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        width: '90%',
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    logo: {
        width: 200,
        height: 175,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#333',
        marginBottom: 25,
        textAlign: 'center',
    },
    allinput: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 25,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '100%',
        height: 50,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderColor: '#17285D',
        borderWidth: 1,
    },
    input: {
        flex: 1,
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#333',
    },
    iconContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
    backgroundColor: '#8ec0c7',
    borderRadius: 12,
    paddingVertical: 14,
    width: "60%",        
    alignSelf: "center", 
    elevation: 2,
    borderColor: '#17285D',
    borderWidth: 1,
    },

    buttonText: {
        color: '#17285D',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins_700Bold',
    },
   // --- ESTILOS ATUALIZADOS PARA STEPS 3 A 9 ---

    container1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    image: {
        width: 280,
        height: 350,
        marginTop: 130,
        marginBottom: 30,
    },

    speechBubble: {
        backgroundColor: 'rgba(255,255,255)',
        padding: 20,
        borderRadius: 20,
        maxWidth: '85%',
        position: 'absolute',
        top: 80,
        borderWidth: 1.5,
        borderColor: '#17285D',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5,
    },
    speechText: {
        color: '#17285D',
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'Poppins_700Bold',
        lineHeight: 30,
    },

    // ---- Perguntas (Step4 a Step8) ----
    container2: {
        flex: 1,
    },
    content: {
        padding: 25,
        paddingBottom: 60,
    },
    titulo2: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#17285D',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 25,
        textShadowColor: 'rgba(0,0,0,0.15)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 3,
    },

    lista: {
        marginBottom: 50,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 18,
        paddingVertical: 20,
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
    },

    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
        backgroundColor: "#f9fafc",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#d4d8de",
        elevation: 1,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderWidth: 2,
        borderColor: "#17285D",
        marginRight: 12,
        borderRadius: 6,
        backgroundColor: "#fff",
    },
    checkboxMarcado: {
        backgroundColor: "#8ec0c7",
        borderColor: "#17285D",
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
    },
    texto2: {
        fontSize: 18,
        color: "#17285D",
        flexShrink: 1,
        fontFamily: 'Poppins_400Regular',
    },

    button: {
        backgroundColor: '#8ec0c7',
        borderRadius: 15,
        paddingVertical: 16,
        width: "70%",
        alignSelf: "center",
        elevation: 3,
        borderColor: '#17285D',
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        marginBottom: 30,
    },
    buttonText: {
        color: '#17285D',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Poppins_700Bold',
    },


});
