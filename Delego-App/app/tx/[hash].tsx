import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ethers } from 'ethers';
import { SEPOLIA_RPC } from '@/utils/constants';

export default function TxDetailScreen() {
  const { hash } = useLocalSearchParams();
  const [tx, setTx] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTx();
  }, []);

  async function loadTx() {
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const transaction = await provider.getTransaction(hash as string);
    const receiptData = await provider.getTransactionReceipt(hash as string);

    setTx(transaction);
    setReceipt(receiptData);
    setLoading(false);
  }

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  if (!tx) return <Text>Transaction not found</Text>;

  const gasFee =
    receipt && tx.gasPrice
      ? ethers.formatEther(receipt.gasUsed * tx.gasPrice)
      : '0';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>

      <Detail label="Status" value={receipt?.status === 1 ? 'Confirmed' : 'Failed'} />
      <Detail label="Amount" value={`${ethers.formatEther(tx.value)} ETH`} />
      <Detail label="From" value={tx.from} />
      <Detail label="To" value={tx.to} />
      <Detail label="Block" value={receipt?.blockNumber?.toString() || '-'} />
      <Detail label="Gas Used" value={receipt?.gasUsed?.toString() || '-'} />
      <Detail label="Gas Fee" value={`${gasFee} ETH`} />
      <Detail label="Hash" value={tx.hash} />

      <Pressable
        style={styles.btn}
        onPress={() => Linking.openURL(`https://sepolia.etherscan.io/tx/${tx.hash}`)}
      >
        <Text style={styles.btnText}>View on Etherscan</Text>
      </Pressable>
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  row: { marginBottom: 12 },
  label: { fontSize: 12, color: '#666' },
  value: { fontSize: 14, fontWeight: '600' },
  btn: { marginTop: 24, backgroundColor: '#007AFF', padding: 14, borderRadius: 12 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
