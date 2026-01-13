import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { ethers } from 'ethers';
import { SEPOLIA_RPC, WALLET_ABI } from '@/utils/constants';
import { exportPrivateKey } from '@/utils/secureStore';
import { getBalance } from '@/utils/balance';

export default function DelegateWallet() {
  const { wallet } = useLocalSearchParams();
  const [info, setInfo] = useState<any>(null);
  const [balance, setBalance] = useState("0");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadInfo();
  }, []);

  async function loadInfo() {
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const contract = new ethers.Contract(wallet as string, WALLET_ABI, provider);

    const pk = await exportPrivateKey();
    const signer = new ethers.Wallet(pk!, provider);

    const delegate = await signer.getAddress();

    const data = await contract.delegates(delegate);
    const bal = await getBalance(wallet as string);

    setInfo(data);
    setBalance(bal);
  }

 async function sendTx() {
  try {
    if (!to || !amount) {
      Alert.alert("Error", "Enter recipient and amount");
      return;
    }

    if (!info.active) {
      Alert.alert("Access Revoked", "Your delegate permission is inactive");
      return;
    }

    const remaining =
      Number(ethers.formatEther(info.dailyLimit)) -
      Number(ethers.formatEther(info.spentToday));

    if (Number(amount) > remaining) {
      Alert.alert("Limit Exceeded", "Amount exceeds remaining daily limit");
      return;
    }

    const expiry = Number(info.expiry) * 1000;
    if (Date.now() > expiry) {
      Alert.alert("Expired", "Delegate permission has expired");
      return;
    }

    if (Number(balance) === 0) {
      Alert.alert("No Balance", "Smart wallet has no ETH");
      return;
    }

    const pk = await exportPrivateKey();
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const signer = new ethers.Wallet(pk!, provider);

    const contract = new ethers.Contract(wallet as string, WALLET_ABI, signer);

    const tx = await contract.execute(
      to,
      ethers.parseEther(amount)   // ✅ only 2 params
    );

    await tx.wait();

    Alert.alert("Success", "Transaction sent");
    loadInfo();
  } catch (e: any) {
    console.log("REVERT:", e);
    Alert.alert("Error", e.reason || e.message);
  }
}



  if (!info) return null;

  const remaining =
    Number(ethers.formatEther(info.dailyLimit)) -
    Number(ethers.formatEther(info.spentToday));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delegated Wallet</Text>

      <Text style={styles.balance}>{balance} ETH</Text>

      <View style={styles.infoBox}>
        <Text>Daily Limit: {ethers.formatEther(info.dailyLimit)} ETH</Text>
        <Text>Spent Today: {ethers.formatEther(info.spentToday)} ETH</Text>
        <Text>Remaining: {remaining} ETH</Text>
        <Text>Expiry: {new Date(Number(info.expiry) * 1000).toDateString()}</Text>
      </View>

      <TextInput
        placeholder="Recipient"
        style={styles.input}
        value={to}
        onChangeText={setTo}
      />

      <TextInput
        placeholder="Amount (ETH)"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <Pressable style={styles.sendBtn} onPress={sendTx}>
        <Text style={styles.sendText}>Send ETH</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
  flex: 1,
  backgroundColor: "#FFFFFF",
  padding: 20,
},

title: {
  fontSize: 22,
  fontWeight: "700",
  color: "#000",
  textAlign: "center",
  marginBottom: 20,
},

balance: {
  fontSize: 34,
  fontWeight: "800",
  color: "#000",
  textAlign: "center",
  marginBottom: 20,
},

infoBox: {
  backgroundColor: "#F3F4F6",
  borderRadius: 16,
  padding: 18,
  marginBottom: 24,
},

infoText: {
  fontSize: 14,
  color: "#111827",
  marginBottom: 6,
  fontWeight: "500",
},

input: {
  backgroundColor: "#F9FAFB",
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 14,
  fontSize: 15,
  color: "#000",
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "#E5E7EB",
},

sendBtn: {
  backgroundColor: "#007AFF",
  paddingVertical: 16,
  borderRadius: 16,
  alignItems: "center",
  marginTop: 10,
},

sendText: {
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: "700",
},

})