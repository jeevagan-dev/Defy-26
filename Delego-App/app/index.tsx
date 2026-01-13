

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createWallet } from '../utils/wallet';
import { saveWallet, getWallet, saveSmartWallet } from '../utils/secureStore';
import { getOrCreateSmartWallet } from '../utils/delegoFactory';

export default function OnboardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    checkExistingWallet();
  }, []);

  async function checkExistingWallet() {
    const existingWallet = await getWallet();
    if (existingWallet) {
      router.replace('/(tabs)');
    } else {
      setLoading(false);
    }
  }

  

  async function handleCreateWallet() {
  try {
    setCreating(true);

    // 1️⃣ Create EOA wallet
    const wallet = await createWallet();

    // 2️⃣ Save EOA securely
    await saveWallet({
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic,
      address: wallet.address,
    });

    // 3️⃣ Enter app
    router.replace('/(tabs)');
  } catch (error) {
    console.error('Error creating wallet:', error);
    setCreating(false);
  }
}


  function handleImportWallet() {
    router.push('/import');
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delego Wallet</Text>
      <Text style={styles.subtitle}>Your decentralized delegate wallet</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleCreateWallet}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Create New Wallet</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleImportWallet}
          disabled={creating}
        >
          <Text style={styles.secondaryButtonText}>Import Existing Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
