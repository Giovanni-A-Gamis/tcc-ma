import * as React from 'react';
import { View, Text } from 'react-native';
import { alarmStyles } from './styles';

export default function AlarmScreen({navigation}) {
    return (
        <View style={alarmStyles.container}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold'}}>Alarme</Text>
        </View>
    )
}