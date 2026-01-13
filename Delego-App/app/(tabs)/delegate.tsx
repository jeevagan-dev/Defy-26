import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { exportPrivateKey, getSmartWallet } from '@/utils/secureStore';
import { addDelegate, revokeDelegate, getDelegateInfo } from '@/utils/smartWallet';
import { ethers } from 'ethers';

export default function Delegate() {
  const insets = useSafeAreaInsets();

  const [delegateAddress, setDelegateAddress] = useState('');
  const [delegateInfo, setDelegateInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleAddDelegate() {
    try {
      const wallet = await getSmartWallet();
      const pk = await exportPrivateKey();
      if (!wallet || !pk) return;

      setLoading(true);

      const expiry = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

      await addDelegate(wallet, pk, delegateAddress, "0.1", expiry);

      Alert.alert("Success", "Delegate added");
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      Alert.alert("Error", err.message);
    }
  }

  async function handleRevokeDelegate() {
    try {
      const wallet = await getSmartWallet();
      const pk = await exportPrivateKey();
      if (!wallet || !pk) return;

      setLoading(true);

      await revokeDelegate(wallet, pk, delegateAddress);

      Alert.alert("Success", "Delegate revoked");
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      Alert.alert("Error", err.message);
    }
  }

  async function handleCheckDelegate() {
    try {
      const wallet = await getSmartWallet();
      if (!wallet) return;

      const info = await getDelegateInfo(wallet, delegateAddress);
      setDelegateInfo(info);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />

      {/* Top Safe Area Spacer */}
      <View style={{ height: insets.top }} />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Delegate Management</Text>

        <TextInput
          placeholder="Delegate Address"
          value={delegateAddress}
          onChangeText={setDelegateAddress}
          style={styles.input}
          autoCapitalize="none"
        />

        <Pressable style={styles.primaryBtn} onPress={handleAddDelegate}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Add Delegate</Text>
          )}
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={handleRevokeDelegate}>
          <Text style={styles.btnText}>Revoke Delegate</Text>
        </Pressable>

        <Pressable style={styles.checkBtn} onPress={handleCheckDelegate}>
          <Text style={styles.btnText}>Check Delegate</Text>
        </Pressable>

        {delegateInfo && (
          <View style={styles.infoBox}>
            <Text>Active: {delegateInfo.active ? "Yes" : "No"}</Text>
            <Text>Daily Limit: {ethers.formatEther(delegateInfo.dailyLimit)} ETH</Text>
            <Text>Expiry: {new Date(Number(delegateInfo.expiry) * 1000).toDateString()}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#000"
  },

  input: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
    color: "#000"
  },

  primaryBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },

  secondaryBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },

  checkBtn: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 12,
    alignItems: "center"
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },

  infoBox: {
    marginTop: 20,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12
  }
});
