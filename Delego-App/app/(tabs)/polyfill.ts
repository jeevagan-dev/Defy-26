import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import process from 'process';
import { crypto } from "./crypto-shim";

(globalThis as any).Buffer = Buffer;
(globalThis as any).process = process;
(globalThis as any).crypto = crypto;
