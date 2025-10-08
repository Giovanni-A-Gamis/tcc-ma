// BleTestScreen.js (Mantido com o mesmo nome e exportações)

import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, PermissionsAndroid, Platform, Alert } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { encode as btoa } from "base-64";

// Definições de UUIDs e ID do ESP32
export const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
export const CHARACTERISTIC_UUID_CMD = "87654321-4321-4321-4321-ba0987654321"; // O seu UUID original (para comandos ON/OFF)
export const CHARACTERISTIC_UUID_NOTIFY = "BA987654-3210-FEDC-BA98-76543210FEDC"; // NOVO: UUID para a Notificação do Alarme
export const ESP32_ID = "68:25:DD:20:A9:E2";

const manager = new BleManager();

// Função para decodificar base64 (necessária para dados de notificação)
function atob(b64) {
    // Retorna a string decodificada do Base64
    return Buffer.from(b64, 'base64').toString('utf8');
}


// ----------------------------------------------------
// Hook Customizado Exportável
// ----------------------------------------------------

/**
 * Hook para gerenciar a conexão BLE com o ESP32.
 * @param {function(string): void} onAlarmReceived - Callback para quando o ESP32 notificar.
 */
export function useBleService(onAlarmReceived) {
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [status, setStatus] = useState("Desconectado");
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const scanTimeout = useRef(null);
    const alarmSubscription = useRef(null);

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);
            return Object.values(granted).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
        }
        return true;
    };

    useEffect(() => {
        requestPermissions();
        return () => {
            if (alarmSubscription.current) alarmSubscription.current.remove(); // Limpa o listener
            manager.destroy();
            if (scanTimeout.current) clearTimeout(scanTimeout.current);
        };
    }, []);

    const connectToDevice = async (deviceId) => {
        setIsScanning(false);
        manager.stopDeviceScan();
        setStatus("Conectando...");

        let timeoutId = null;
        let connected = false;

        try {
            const device = await new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => {
                    if (!connected) reject(new Error("Timeout na conexão BLE"));
                }, 5000);

                manager.connectToDevice(deviceId)
                    .then(async dev => {
                        connected = true;
                        if (timeoutId) clearTimeout(timeoutId);

                        await dev.requestMTU(517);
                        await dev.discoverAllServicesAndCharacteristics();
                        resolve(dev);
                    })
                    .catch(err => reject(err));
            });

            setConnectedDevice(device);
            setIsConnected(true);
            setStatus("Conectado a " + device.id);

            // ⚠️ NOVO: Inicia a escuta da Característica de Notificação
            if (alarmSubscription.current) alarmSubscription.current.remove();
            
            alarmSubscription.current = device.monitorCharacteristicForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID_NOTIFY,
                (error, characteristic) => {
                    if (error) {
                        console.error("Erro na Notificação BLE:", error.message);
                        return;
                    }
                    if (characteristic && characteristic.value) {
                        const decodedValue = atob(characteristic.value); 
                        if (onAlarmReceived) {
                            onAlarmReceived(decodedValue); 
                        }
                    }
                }
            );

        } catch (err) {
            console.log("Erro ao conectar:", err);
            setStatus("Falha na conexão");
            setIsConnected(false);
            setConnectedDevice(null);
        }
    };

    const scanForDevices = async () => {
        const ok = await requestPermissions();
        if (!ok) {
            Alert.alert("Permissão Bluetooth não concedida");
            return;
        }

        setIsScanning(true);
        setStatus("Procurando dispositivo...");

        manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
            if (error) {
                Alert.alert("Erro no scan", error.message);
                setIsScanning(false);
                manager.stopDeviceScan();
                return;
            }

            if (device && device.id === ESP32_ID) {
                manager.stopDeviceScan(); // Para o scan após encontrar
                connectToDevice(device.id);
            }
        });

        if (scanTimeout.current) clearTimeout(scanTimeout.current);
        scanTimeout.current = setTimeout(() => {
            manager.stopDeviceScan();
            setIsScanning(false);
            if (!isConnected) setStatus("Scan parado");
        }, 10000);
    };

    const stopScan = () => {
        manager.stopDeviceScan();
        setIsScanning(false);
        setStatus("Scan parado");
    };

    const sendCommand = async (command) => {
        if (!connectedDevice) {
            setStatus("Erro: Não conectado.");
            return;
        }
        try {
            await connectedDevice.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID_CMD, // Usando o UUID de Comando
                btoa(command)
            );
            console.log("Comando enviado:", command);
            setStatus(`Comando ${command} enviado`);
        } catch (err) {
            console.log("Erro ao enviar:", err);
            setStatus("Erro ao enviar");
        }
    };

    return {
        status,
        isConnected,
        isScanning,
        scanForDevices,
        stopScan,
        sendCommand,
        connectedDevice,
    };
}


// ----------------------------------------------------
// Componente Original Mantido (usa o hook para teste)
// ----------------------------------------------------

export default function BleTestScreen() {
    // O componente original usa o hook exportado internamente
    const { status, isConnected, isScanning, scanForDevices, stopScan, sendCommand } = useBleService((data) => {
        Alert.alert("Sinal BLE Recebido", `Dados: ${data}`); // Exemplo de uso
    });

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>{status}</Text>

            <Button title="Procurar ESP32" onPress={scanForDevices} disabled={isScanning || isConnected} />
            <View style={{ height: 10 }} />
            <Button title="Parar Scan" onPress={stopScan} disabled={!isScanning} />
            <View style={{ height: 20 }} />

            <Button title="Ligar (ON)" onPress={() => sendCommand("ON")} disabled={!isConnected} />
            <View style={{ height: 10 }} />
            <Button title="Desligar (OFF)" onPress={() => sendCommand("OFF")} disabled={!isConnected} />
        </View>
    );
}