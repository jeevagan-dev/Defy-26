import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

import { getSmartWallet, getWallet } from '@/utils/secureStore';
import { getBalance } from '@/utils/balance';
import { sendEthToSmartWallet } from '@/utils/sendEth';
import { getTxHistory } from '@/utils/history';
import { estimateEthTransferGas } from '@/utils/gas';
import { waitForTx } from '@/utils/txTracker';

export default function ExploreTab() {
  const router = useRouter();

  const [amount, setAmount] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [ownerBalance, setOwnerBalance] = useState('0.00');
  const [smartAddress, setSmartAddress] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [gasPreview, setGasPreview] = useState<any>(null);
  const [pendingTx, setPendingTx] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (amount && ownerAddress && smartAddress) {
      previewGas();
    } else {
      setGasPreview(null);
    }
  }, [amount]);

  async function load() {
    try {
      const smartAddr = await getSmartWallet();
      const ownerWallet = await getWallet();

      if (!ownerWallet) return;

      setOwnerAddress(ownerWallet.address);
      setOwnerBalance(await getBalance(ownerWallet.address));

      if (!smartAddr) return;

      setSmartAddress(smartAddr);
      setHistory(await getTxHistory(smartAddr));
    } finally {
      setLoading(false);
    }
  }

  async function previewGas() {
    try {
      const gas = await estimateEthTransferGas(
        ownerAddress,
        smartAddress,
        amount
      );
      setGasPreview(gas);
    } catch {
      setGasPreview(null);
    }
  }

  async function handleSend() {
    if (!amount || Number(amount) <= 0) {
      Alert.alert('Invalid Amount');
      return;
    }

    if (Number(amount) > Number(ownerBalance)) {
      Alert.alert('Insufficient Balance');
      return;
    }

    try {
      setSending(true);

      const hash = await sendEthToSmartWallet(smartAddress, amount);

      setPendingTx(hash);
      setTxStatus('Pending');

      const receipt = await waitForTx(hash);

      if (receipt?.status === 1) {
        setTxStatus('Confirmed');
        Alert.alert('Success', 'Transaction confirmed');
      } else {
        setTxStatus('Failed');
        Alert.alert('Failed', 'Transaction failed');
      }

      setPendingTx(null);
      setAmount('');
      await load();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fund Smart Wallet</Text>

      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Owner Wallet Balance</Text>
        <Text>{ownerAddress}</Text>
        <Text style={styles.balanceValue}>{ownerBalance} ETH</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Amount in ETH"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      {gasPreview && (
        <View style={styles.gasBox}>
          <Text style={styles.gasText}>Estimated Gas</Text>
          <Text style={styles.gasValue}>{gasPreview.feeEth} ETH</Text>
        </View>
      )}

      <Pressable
        style={[styles.btn, sending && { opacity: 0.6 }]}
        onPress={handleSend}
        disabled={sending}
      >
        <Text style={styles.btnText}>
          {sending ? 'Sending...' : 'Send ETH'}
        </Text>
      </Pressable>

      {pendingTx && (
  <View style={styles.pendingBox}>
    <Text style={styles.pendingTitle}>Transaction Pending</Text>
    <Text style={styles.pendingHash}>
      {pendingTx.slice(0, 14)}...
    </Text>
    <Text style={styles.pendingStatus}>{txStatus}</Text>
  </View>
)}


      <Text style={styles.historyTitle}>Transaction History</Text>

      {history.map((tx, i) => {
        const ethValue = (Number(tx.value) / 1e18).toFixed(4);
        const incoming =
          tx.to?.toLowerCase() === smartAddress.toLowerCase();

        return (
          <Pressable
            key={i}
            style={styles.txItem}
            onPress={() => router.push(`/tx/${tx.hash}`)}
          >
            <Text>{tx.hash.slice(0, 10)}...</Text>
            <Text style={{ color: incoming ? 'green' : 'red' }}>
              {incoming ? '+' : '-'}{ethValue} ETH
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  empty: {
    color: '#999',
    textAlign: 'center',
  },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  txText: {
    fontSize: 13,
  },
  balanceBox: {
  padding: 14,
  borderRadius: 12,
  backgroundColor: '#F5F5F5',
  marginBottom: 16,
  alignItems: 'center',
},
balanceLabel: {
  fontSize: 12,
  color: '#666',
},
balanceValue: {
  fontSize: 20,
  fontWeight: '700',
  marginTop: 4,
},
/* ---------------- GAS PREVIEW BOX ---------------- */

gasBox: {
  backgroundColor: '#F0F9FF',
  borderRadius: 14,
  padding: 14,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: '#BAE6FD',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

gasText: {
  fontSize: 14,
  color: '#0369A1',
  fontWeight: '600',
},

gasValue: {
  fontSize: 15,
  fontWeight: '700',
  color: '#0C4A6E',
},

/* ---------------- PENDING TX BOX ---------------- */

pendingBox: {
  backgroundColor: '#FFF7ED',
  borderRadius: 14,
  padding: 16,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: '#FDBA74',
  alignItems: 'center',
},

pendingTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#EA580C',
  marginBottom: 6,
},

pendingHash: {
  fontSize: 13,
  color: '#7C2D12',
  marginBottom: 4,
},

pendingStatus: {
  fontSize: 13,
  fontWeight: '600',
  color: '#9A3412',
},


});
