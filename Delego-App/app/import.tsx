

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { importWalletFromMnemonic, validateMnemonic } from '../utils/wallet';
import { saveWallet, saveSmartWallet } from '../utils/secureStore';
import { getOrCreateSmartWallet } from '../utils/delegoFactory';

export default function ImportWalletScreen() {
  const router = useRouter();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);


  async function handleImport() {
  setError('');
  const trimmedMnemonic = mnemonic.trim().toLowerCase();

  if (!validateMnemonic(trimmedMnemonic)) {
    setError('Invalid seed phrase. Please check and try again.');
    return;
  }

  try {
    setImporting(true);

    // 1️⃣ Import EOA wallet
    const wallet = importWalletFromMnemonic(trimmedMnemonic);

    // 2️⃣ Save EOA securely
    await saveWallet({
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic,
      address: wallet.address,
    });

    // 3️⃣ Enter app
    router.replace('/(tabs)');
  } catch (e) {
    console.error(e);
    setError('Failed to import wallet. Please try again.');
    setImporting(false);
  }
}


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Import Wallet</Text>
        <Text style={styles.subtitle}>Enter your 12 or 24-word seed phrase</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter seed phrase (separated by spaces)"
          value={mnemonic}
          onChangeText={setMnemonic}
          multiline
          numberOfLines={4}
          autoCapitalize="none"
          autoCorrect={false}
          textAlignVertical="top"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, importing && styles.buttonDisabled]}
          onPress={handleImport}
          disabled={importing || !mnemonic.trim()}
        >
          {importing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Import Wallet</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={importing}
        >
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
