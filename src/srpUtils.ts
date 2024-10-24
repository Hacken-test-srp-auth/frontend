import { ethers } from "ethers";

export const N = ethers.toBigInt(
  "0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE65381FFFFFFFFFFFFFFFF"
);
export const g = ethers.toBigInt(2);
export const k = ethers.toBigInt(3);

export function modPow(
  base: bigint,
  exponent: bigint,
  modulus: bigint
): bigint {
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }
  return result;
}

export function calculateX(privateKey: Uint8Array): bigint {
  return ethers.toBigInt(privateKey);
}

export function calculateVerifier(x: bigint): bigint {
  return modPow(g, x, N);
}
