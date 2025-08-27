import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: 'white',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#8ec0c7',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'black',
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        paddingVertical: 14,
        paddingHorizontal: 40,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        width: '85%',
        height: 55,
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    input: {
        flex: 1,
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
    },
    iconContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    allinput: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        
    },
    logocnome: {
        width: 320,
        height: 50,
        marginBottom: 40,
    },
});
