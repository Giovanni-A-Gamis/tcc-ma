import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
    },
    button: {
        backgroundColor: '#17285D',
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFF',
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
        width: '80%',
        height: 45,
        marginVertical: 10,
        paddingHorizontal: 10,
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
        margin: 10,
    },
});
