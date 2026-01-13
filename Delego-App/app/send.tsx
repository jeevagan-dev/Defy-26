

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12
  },
  sendBtn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center'
  },
  sendText: { color: '#fff', fontWeight: '600' }
});


import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { confidentialSend } from "@/utils/confidentialSend";

export default function SendScreen() {
  const { wallet } = useLocalSearchParams<{ wallet: string }>();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!to || !amount) {
      Alert.alert("Missing fields", "Enter recipient and amount");
      return;
    }

    try {
      setLoading(true);

      await confidentialSend({
        walletAddress: wallet!,
        to,
        amount,
      });

      Alert.alert("Success", "Transaction sent confidentially");
      router.back();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Confidential Send</Text>

      <TextInput
        placeholder="Recipient address"
        value={to}
        onChangeText={setTo}
        style={styles.input}
      />

      <TextInput
        placeholder="Amount (ETH)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <Pressable style={styles.sendBtn} onPress={handleSend} disabled={loading}>
        <Text style={styles.sendText}>
          {loading ? "Sending..." : "Send Confidentially"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
