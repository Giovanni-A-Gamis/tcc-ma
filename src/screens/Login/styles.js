import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
        backgroundColor: 'white',
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
    logocnome: {
        width: 250,
        height: 60,
        resizeMode: 'contain',
        marginBottom: 20,
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
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        width: '100%',
        height: 50,
        paddingHorizontal: 15,
        marginBottom: 15,
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
        paddingHorizontal: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
});
