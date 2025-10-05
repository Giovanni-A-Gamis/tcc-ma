import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, PermissionsAndroid, Platform, Alert } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { encode as btoa } from "base-64";

const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "87654321-4321-4321-4321-ba0987654321";
const ESP32_ID = "68:25:DD:20:A9:E2";

const manager = new BleManager();

export default function BleTestScreen() {
  const [foundDevices, setFoundDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [status, setStatus] = useState("Desconectado");
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const scanTimeout = useRef(null);

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
      manager.destroy();
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
    };
  }, []);

  const scanForDevices = async () => {
    const ok = await requestPermissions();
    if (!ok) {
      Alert.alert("Permissão Bluetooth não concedida");
      return;
    }

    setFoundDevices([]);
    setIsScanning(true);
    setStatus("Procurando dispositivo...");

    manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error) {
        Alert.alert("Erro no scan", error.message);
        setIsScanning(false);
        manager.stopDeviceScan();
        return;
      }

      if (device) {
        setFoundDevices(prev => {
          if (prev.find(d => d.id === device.id)) return prev;
          return [...prev, device];
        });

        if (device.id === ESP32_ID) {
          connectToDevice(device.id);
        }
      }
    });

    if (scanTimeout.current) clearTimeout(scanTimeout.current);
    scanTimeout.current = setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
      setStatus("Scan parado");
    }, 10000);
  };

  const connectToDevice = async (deviceId) => {
    setIsScanning(false);
    manager.stopDeviceScan();
    setStatus("Conectando...");

    let timeoutId = null;
    let connected = false;

    try {
      await new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
          if (!connected) {
            reject(new Error("Timeout na conexão BLE"));
          }
        }, 5000);

        manager.connectToDevice(deviceId)
          .then(async device => {
            connected = true;
            if (timeoutId) clearTimeout(timeoutId);

            await device.requestMTU(517);
            await device.discoverAllServicesAndCharacteristics();

            setConnectedDevice(device);
            setIsConnected(true);
            setStatus("Conectado a " + device.id);
            resolve();
          })
          .catch(err => reject(err));
      });
    } catch (err) {
      console.log("Erro ao conectar:", err);
      setStatus("Falha na conexão");
      setIsConnected(false);
      setConnectedDevice(null);
    }
  };

  const stopScan = () => {
    manager.stopDeviceScan();
    setIsScanning(false);
    setStatus("Scan parado");
  };

  const sendCommand = async (command) => {
    if (!connectedDevice) return;
    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        btoa(command)
      );
      console.log("Enviado:", command);
      setStatus(`Comando ${command} enviado`);
    } catch (err) {
      console.log("Erro ao enviar:", err);
      setStatus("Erro ao enviar");
    }
  };

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
