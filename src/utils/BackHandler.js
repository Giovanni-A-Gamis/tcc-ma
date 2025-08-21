import React, { useEffect } from 'react';
import { View, Alert, BackHandler } from 'react-native';

export default function Handler() {
    useEffect(() => {
        const backAction = () => {
            Alert.alert("Sair do app", "Deseja realmente sair?", [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);


    
        /*
        const backAction = () => {
                const state = tabNavigationRef.current?.getState();
                const currentRouteName = state?.routes[state.index].name;
    
                if (currentRouteName === homeName) {
                    Alert.alert("Sair do app", "Deseja realmente sair?", [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Sair", onPress: () => BackHandler.exitApp() }
                    ]);
                return true;
            } else {
                tabNavigationRef.current?.navigate(homeName); // agora funciona
                return true;
                }
            };
    
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
    
            return () => backHandler.remove();
        }, []);
        //esse código é para interceptar o botão de voltar do Android e perguntar se o usuário quer sair do app quando estiver na tela Home.
        //não está funcionando, o de baixo está funcionando, mas esse não.
        */
}

