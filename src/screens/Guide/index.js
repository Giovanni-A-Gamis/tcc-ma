import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Divider } from 'react-native-paper';

export default function HomeScreen() {

    return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text></Text>
        </ScrollView>
    </SafeAreaView>
    );
}