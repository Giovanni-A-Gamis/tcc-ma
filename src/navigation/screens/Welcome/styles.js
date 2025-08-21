import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)', // Escurece a imagem
    },
    content: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
    },
    logo: {
        width: 325,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    buttonPrimary: {
        backgroundColor: '#FFF',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 5,
        elevation: 2,
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
