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
    container1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 230,
        height: 300,
        marginTop: 160,
        marginBottom: 20,
    },
    speechBubble: {
        padding: 18,
        borderRadius: 15,
        maxWidth: '80%',
        position: 'absolute',
        top: 75,
        borderWidth:2,
        borderColor:"black",
    },
    speechText: {
        color: '#333',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '700',
    },
    container2: {
    flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    titulo2: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 25,
        marginTop: 40,
        textAlign: "center",
    },
    lista: {
        marginTop: 30,
        marginBottom: 40, 
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderWidth: 2,
        borderColor: "#333",
        marginRight: 12,
        borderRadius: 6,
    },
    checkboxMarcado: {
        backgroundColor: "#8ec0c7",
        borderColor: "black",
    },
    texto2: {
        fontSize: 20,
        flexShrink: 1,
    },
});
