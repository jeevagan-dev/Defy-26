
export const FACTORY_ADDRESS =
  "0xc93F0e39B32b5a28af4C00A6ef63E0cd0705c099";



export const SEPOLIA_RPC = "https://base-sepolia.g.alchemy.com/v2/Your api key";

// export const FACTORY_ABI = [
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "address",
//           "name": "wallet",
//           "type": "address"
//         }
//       ],
//       "name": "WalletCreated",
//       "type": "event"
//     },
//     {
//       "inputs": [],
//       "name": "createWallet",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "wallet",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "ownerToWallet",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ]

// export const WALLET_ABI = [
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "_owner",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "wallet",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "delegate",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "dailyLimit",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "expiry",
//           "type": "uint256"
//         }
//       ],
//       "name": "DelegateAdded",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "wallet",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "delegate",
//           "type": "address"
//         }
//       ],
//       "name": "DelegateRevoked",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "wallet",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "by",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         }
//       ],
//       "name": "Executed",
//       "type": "event"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "delegate",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "dailyLimit",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "expiry",
//           "type": "uint256"
//         }
//       ],
//       "name": "addDelegate",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "name": "delegates",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "active",
//           "type": "bool"
//         },
//         {
//           "internalType": "uint256",
//           "name": "dailyLimit",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "spentToday",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "lastReset",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "expiry",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address payable",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         }
//       ],
//       "name": "execute",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "owner",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "delegate",
//           "type": "address"
//         }
//       ],
//       "name": "revokeDelegate",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "stateMutability": "payable",
//       "type": "receive"
//     }
//   ]

export const FACTORY_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        }
      ],
      "name": "WalletCreated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "createWallet",
      "outputs": [
        {
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "ownerToWallet",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];


export const WALLET_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "HandleMismatch",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InsufficientFees",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidAttestation",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotAllowed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotOwner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TransferFailed",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        }
      ],
      "name": "DelegateAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        }
      ],
      "name": "DelegateRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "by",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Executed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "by",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "euint256",
          "name": "handle",
          "type": "bytes32"
        }
      ],
      "name": "ExecutionPrepared",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "encryptedDailyLimit",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "encryptedExpiry",
          "type": "bytes"
        }
      ],
      "name": "addDelegate",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "delegates",
      "outputs": [
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        },
        {
          "internalType": "euint256",
          "name": "dailyLimit",
          "type": "bytes32"
        },
        {
          "internalType": "euint256",
          "name": "spentToday",
          "type": "bytes32"
        },
        {
          "internalType": "euint256",
          "name": "lastReset",
          "type": "bytes32"
        },
        {
          "internalType": "euint256",
          "name": "expiry",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "handle",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "value",
              "type": "bytes32"
            }
          ],
          "internalType": "struct DecryptionAttestation",
          "name": "attestation",
          "type": "tuple"
        },
        {
          "internalType": "bytes[]",
          "name": "signatures",
          "type": "bytes[]"
        },
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "executeWithAttestation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "pendingExecution",
      "outputs": [
        {
          "internalType": "euint256",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encryptedValue",
          "type": "bytes"
        }
      ],
      "name": "prepareExecution",
      "outputs": [
        {
          "internalType": "euint256",
          "name": "handle",
          "type": "bytes32"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        }
      ],
      "name": "revokeDelegate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];