import { sha256 } from "@noble/hashes/sha256";
import { keccak_256 } from "@noble/hashes/sha3";

export const crypto = {
  createHash(alg: string) {
    let data: Uint8Array[] = [];

    return {
      update(input: Uint8Array | string) {
        if (typeof input === "string") {
          data.push(new TextEncoder().encode(input));
        } else {
          data.push(input);
        }
        return this;
      },
      digest() {
        const merged = new Uint8Array(data.reduce((a, b) => a + b.length, 0));
        let offset = 0;
        for (const d of data) {
          merged.set(d, offset);
          offset += d.length;
        }

        if (alg === "sha256") return sha256(merged);
        if (alg === "keccak256") return keccak_256(merged);

        throw new Error("Unsupported hash: " + alg);
      }
    };
  }
};
