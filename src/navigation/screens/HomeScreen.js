import * as React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('Essa é a Home')}
                style={{ fontSize: 26, fontWeight: 'bold'}}>Home</Text>
        </View>
    )
}