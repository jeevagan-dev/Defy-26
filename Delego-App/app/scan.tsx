import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera permission required</Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={({ data }) => {
          if (scanned) return;
          setScanned(true);

          // Navigate to send page with scanned address
          router.replace(`/send?to=${data}`);
        }}
      />

      <View style={styles.overlay}>
        <Text style={styles.scanText}>Scan Wallet QR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  text: {
    fontSize: 16,
    marginBottom: 20
  },

  btn: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 12
  },

  btnText: {
    color: '#fff',
    fontWeight: '600'
  },

  overlay: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center'
  },

  scanText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  }
});
