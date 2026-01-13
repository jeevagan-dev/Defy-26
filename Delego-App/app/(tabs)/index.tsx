import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getWallet,
  getSmartWallet,
  exportPrivateKey,
  deleteWallet,
  exportMnemonic,
  saveSmartWallet
} from '../../utils/secureStore';
import { getBalance } from '@/utils/balance';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { FACTORY_ADDRESS, SEPOLIA_RPC , FACTORY_ABI } from "@/utils/constants";
import { getOrCreateSmartWallet } from '@/utils/delegoFactory';
import { ethers } from 'ethers';
import { router } from 'expo-router';
import { listenForDelegates } from '@/utils/delegateScanner';
import { loadDelegatedWallets } from '@/utils/loadDelegates';






export default function HomeTab() {
  const [refreshing, setRefreshing] = useState(false);
  const [smartAddress, setSmartAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<string>('0.00');
  const [ownerAddress, setOwnerAddress] = useState('');
const [ownerBalance, setOwnerBalance] = useState('0.00');
const [hasSmartWallet, setHasSmartWallet] = useState(false);
const [delegatedWallets, setDelegatedWallets] = useState<string[]>([]);




useEffect(() => {
  loadWallet();
}, []);

useEffect(() => {
  if (!ownerAddress) return;

  async function initDelegates() {
    try {
      const wallets = await loadDelegatedWallets(ownerAddress);
      setDelegatedWallets(wallets);
    } catch (e) {
      console.error("Failed to load delegates", e);
    }
  }

  initDelegates();

  const stopListener = listenForDelegates(ownerAddress, (wallet) => {
    setDelegatedWallets(prev => {
      if (prev.includes(wallet)) return prev;
      return [...prev, wallet];
    });
  });

  return stopListener;
}, [ownerAddress]);


  

  async function onRefresh() {
  setRefreshing(true);
  await loadWallet();
  setRefreshing(false);
}


async function loadWallet() {
  try {
    const wallet = await getWallet();
    if (!wallet) {
      setLoading(false);
      return;
    }

    setOwnerAddress(wallet.address);


    // owner balance
    const ownerBal = await getBalance(wallet.address);
    setOwnerBalance(ownerBal);
  


    // 🔗 ON-CHAIN CHECK (SOURCE OF TRUTH)
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const factory = new ethers.Contract(
      FACTORY_ADDRESS,
      FACTORY_ABI,
      provider
    );

    const smartWallet = await factory.ownerToWallet(wallet.address);

    if (smartWallet && smartWallet !== ethers.ZeroAddress) {
      setSmartAddress(smartWallet);
      setHasSmartWallet(true);

      const smartBal = await getBalance(smartWallet);
      setBalance(smartBal);
    } else {
      setHasSmartWallet(false);
      setSmartAddress('');
    }
  } catch (e) {
    console.error(e);
  }

  setLoading(false);
}



async function handleCopyAddress() {
  if (!smartAddress) return;

  await Clipboard.setStringAsync(ownerAddress);
  Alert.alert('Copied', 'Smart wallet address copied to clipboard');
}


  async function handleExportPrivateKey() {
    Alert.alert(
      'Export Private Key',
      'Never share your private key with anyone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy',
          style: 'destructive',
          onPress: async () => {
            const privateKey = await exportMnemonic();
            if (privateKey) {
              await Clipboard.setStringAsync(privateKey);
              Alert.alert(
                'Copied',
                'Private key copied to clipboard.'
              );
            }
          },
        },
      ]
    );
  }

async function handleCopyOwnerAddress() {
  await Clipboard.setStringAsync(ownerAddress);
  Alert.alert('Copied', 'Owner wallet address copied');
}


  async function handleDeleteWallet() {
    Alert.alert(
      'Delete Wallet',
      'This will permanently remove your wallet from this device. Make sure you have backed up your recovery phrase.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteWallet();
            setSmartAddress('');
            Alert.alert(
              'Wallet Deleted',
              'Your wallet has been removed.'
            );
          },
        },
      ]
    );
  }

  async function handleCreateSmartWallet() {
  try {
    if (Number(ownerBalance) === 0) {
      Alert.alert('Insufficient ETH', 'Please deposit ETH for gas.');
      return;
    }

    Alert.alert(
      'Create Smart Wallet',
      'Confirm wallet creation. This requires gas.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async () => {
            setLoading(true);

            // 🔑 get private key securely
            const privateKey = await exportPrivateKey();
            if (!privateKey) {
              setLoading(false);
              Alert.alert('Error', 'Private key not found');
              return;
            }

            const walletAddress =
              await getOrCreateSmartWallet(privateKey);

            setSmartAddress(walletAddress);
            await saveSmartWallet(walletAddress);

            setHasSmartWallet(true);

            const bal = await getBalance(walletAddress);
            setBalance(bal);

            setLoading(false);
            Alert.alert('Success', 'Smart wallet created!');
          },
        },
      ]
    );
  } catch (err: any) {
    console.error(err);
    setLoading(false);

    if (err.code === 'ACTION_REJECTED') {
      Alert.alert('Cancelled', 'Transaction rejected');
    } else {
      Alert.alert('Error', err.message || 'Failed to create wallet');
    }
  }
}





  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
  <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
     <ScrollView
  contentContainerStyle={styles.container}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#007AFF"
    /> 
  }
>

        <ActivityIndicator size="large" color="#007AFF" />
      </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
  <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    <ScrollView
  contentContainerStyle={styles.container}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#007AFF"
    />
  }
>

      <Text style={styles.title}>Delego Wallet</Text>

      {hasSmartWallet && (
  <>
    <View style={styles.addressContainer}>
      <Text style={styles.label}>Smart Wallet Address</Text>
      <Pressable onPress={handleCopyAddress}>
        <Text style={styles.address}>
          {smartAddress.slice(0, 8)}...{smartAddress.slice(-6)}
        </Text>
        <Text style={styles.copyHint}>Tap to copy</Text>
      </Pressable>
    </View>

    <View style={styles.balanceContainer}>
      <Text style={styles.balanceLabel}>Balance</Text>
      <Text style={styles.balanceValue}>{balance} ETH</Text>
    </View>
  </>
)}

{hasSmartWallet && (
  <View style={styles.actionRow}>

    {/* SEND */}
    <Pressable
      style={styles.actionBtn}
      onPress={() => router.push(`/send?wallet=${smartAddress}`)}
    >
      <Ionicons name="arrow-up" size={22} color="#007AFF" />
      <Text style={styles.actionText}>Send</Text>
    </Pressable>

    {/* RECEIVE */}
    <Pressable
      style={styles.actionBtn}
      onPress={() => router.push(`/receive?wallet=${smartAddress}`)}
    >
      <Ionicons name="arrow-down" size={22} color="#22C55E" />
      <Text style={styles.actionText}>Receive</Text>
    </Pressable>

    {/* SCAN */}
    <Pressable
      style={styles.actionBtn}
      onPress={() => router.push(`/scan`)}
    >
      <Ionicons name="qr-code" size={22} color="#F59E0B" />
      <Text style={styles.actionText}>Scan</Text>
    </Pressable>

  </View>
)}


{!hasSmartWallet && ownerAddress && (
  <View style={styles.card}>

    {/* HEADER */}
    <Text style={styles.sectionTitle}>Receive ETH</Text>
    <Text style={styles.subLabel}>
      Fund your owner wallet to pay gas for smart wallet creation
    </Text>

    {/* QR CODE */}
    <View style={styles.qrWrapper}>
      <QRCode
        value={ownerAddress}
        size={160}
        backgroundColor="white"
        color="black"
      />
    </View>

    {/* ADDRESS BOX */}
    <Pressable onPress={handleCopyOwnerAddress} style={styles.addressBox}>
      <Text style={styles.addressText}>
        {ownerAddress}
      </Text>
      <Text style={styles.copyHint}>Tap to copy address</Text>
    </Pressable>

    {/* BALANCE */}
    <View style={styles.balanceRow}>
      <Text style={styles.balanceLabel}>Balance</Text>
      <Text style={styles.balanceValueSmall}>
        {ownerBalance} ETH
      </Text>
    </View>

    {/* ACTION */}
    {Number(ownerBalance) === 0 ? (
      <Text style={styles.warning}>
        ⚠️ Deposit ETH to continue
      </Text>
    ) : (
      <Pressable
  style={styles.createBtn}
  onPress={handleCreateSmartWallet}
>
  <Text style={styles.createText}>Create Smart Wallet</Text>
</Pressable>
    )}
  </View>
)}

{delegatedWallets.length > 0 && (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Wallets You Can Spend From</Text>

    {delegatedWallets.map(wallet => (
      <Pressable
        key={wallet}
        style={styles.delegateWalletRow}
        onPress={() => router.push(`/delegate-wallet?wallet=${wallet}`)}
      >
        <Text style={styles.walletText}>
          {wallet.slice(0, 8)}...{wallet.slice(-6)}
        </Text>
        <Text style={styles.accessBadge}>Delegate Access</Text>
      </Pressable>
    ))}
  </View>
)}


   </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
  flexGrow: 1,
  backgroundColor: '#FFFFFF',
  padding: 20,
  justifyContent: 'center',
},

delegateWalletRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#F3F4F6',
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 14,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

walletText: {
  fontSize: 15,
  fontWeight: '600',
  color: '#111827',
  letterSpacing: 0.3,
},
actionRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 24,
},

actionBtn: {
  flex: 1,
  backgroundColor: '#F3F4F6',
  marginHorizontal: 6,
  paddingVertical: 16,
  borderRadius: 16,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

actionText: {
  marginTop: 6,
  fontSize: 13,
  fontWeight: '600',
  color: '#111827',
},


accessBadge: {
  backgroundColor: '#DCFCE7',
  color: '#166534',
  fontSize: 12,
  fontWeight: '700',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  overflow: 'hidden',
},


  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
  },

  
  /* ---------------- ADDRESS CARD ---------------- */
  addressContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },

  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },

  address: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  copyHint: {
    fontSize: 11,
    color: '#007AFF',
    marginTop: 4,
  },

  /* ---------------- BALANCE CARD ---------------- */
  balanceContainer: {
    width: '100%',
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },

  balanceLabel: {
    fontSize: 12,
    color: '#555',
  },

  balanceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginTop: 6,
  },

  /* ---------------- OWNER CARD (NO SMART WALLET) ---------------- */
  card: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  warning: {
    marginTop: 12,
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
    textAlign: 'center',
  },

  /* ---------------- CREATE SMART WALLET BUTTON ---------------- */
  createBtn: {
    marginTop: 14,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  createText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  /* ---------------- ACTION BUTTONS ---------------- */
  exportBtn: {
    marginTop: 12,
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
  },

  exportText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  deleteBtn: {
    marginTop: 16,
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
  },
  safeArea: {
  flex: 1,
  backgroundColor: '#FFFFFF',
},

input: {
  backgroundColor: "#F3F4F6",
  padding: 12,
  borderRadius: 10,
  marginBottom: 12,
  fontSize: 14,
}
,


  deleteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: '#000',
  textAlign: 'center',
},

subLabel: {
  fontSize: 13,
  color: '#6B7280',
  textAlign: 'center',
  marginBottom: 16,
},

qrWrapper: {
  alignItems: 'center',
  marginBottom: 16,
},

addressBox: {
  backgroundColor: '#F3F4F6',
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
},

addressText: {
  fontSize: 12,
  fontWeight: '500',
  color: '#111827',
  textAlign: 'center',
},

balanceRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 12,
},

balanceValueSmall: {
  fontSize: 14,
  fontWeight: '600',
  color: '#111827',
},

});
