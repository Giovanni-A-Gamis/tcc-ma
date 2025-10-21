import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
        backgroundColor: '#FAFAFA',
    },

    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },

    logo: {
        width: 200,
        height: 200,
        marginBottom: -30,
    },

    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#333',
    },

    section: {
        marginBottom: 12,
        marginHorizontal: 20,
    },

    sectionButton: {
        backgroundColor: '#E6E6E6',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        elevation: 2,
    },

    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#222',
    },

    sectionContent: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#EEE',
    },

    text: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'justify',
        color: '#444',
        fontFamily: 'Poppins_400Regular',
    },

    memberButton: {
        marginTop: 10,
    },

    memberName: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins_700Bold',
    },

    memberText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        textAlign: 'justify',
        marginTop: 4,
        backgroundColor: '#F8F8F8',
        padding: 10,
        borderRadius: 8,
    },

    version: {
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },

    animation: {
        width: 200,
        height: 550,
        marginTop: -190,
        marginBottom: -200,
    },

    spacer: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
