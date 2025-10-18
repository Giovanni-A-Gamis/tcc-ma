import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingAnimation: {
        width: 400,
        height: 400,
    },
    background: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    content: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    logoAnimation: {
        width: 325,
        height: 85,
        marginBottom: 15,
    },
    buttonPrimary: {
        backgroundColor: '#FFF',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 5,
        elevation: 2,
        width: '100%',
        alignItems: 'center',
    },
    buttonTextPrimary: {
        fontFamily: 'Poppins_700Bold',
        color: '#000',
        fontSize: 18,
    },
    buttonSecondary: {
        paddingVertical: 14,
        paddingHorizontal: 40,
    },
    buttonTextSecondary: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
    }
});