import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

export default function Receive() {
  const { wallet } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receive ETH</Text>

      <QRCode value={wallet as string} size={220} />

      <Text style={styles.address}>{wallet}</Text>

      <Pressable
        style={styles.copyBtn}
        onPress={() => Clipboard.setStringAsync(wallet as string)}
      >
        <Text style={styles.copyText}>Copy Address</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  address: { marginTop: 20, fontSize: 13, color: '#555', textAlign: 'center' },
  copyBtn: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 12
  },
  copyText: { color: '#fff', fontWeight: '600' }
});
