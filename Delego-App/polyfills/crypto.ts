import 'react-native-url-polyfill/auto';
import * as Crypto from 'expo-crypto';

if (typeof global.crypto !== 'object') {
  global.crypto = {} as any;
}

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = (array: any) => {
    const randomBytes = Crypto.getRandomBytes(array.length);
    for (let i = 0; i < array.length; i++) {
      array[i] = randomBytes[i];
    }
    return array;
  };
}
