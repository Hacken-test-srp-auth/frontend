import { ethers } from "ethers";

export class SRPService {
  // RFC 5054 2048-bit constants
  private static readonly N = ethers.toBigInt(import.meta.env.VITE_N);
  private static readonly g = ethers.toBigInt(import.meta.env.VITE_G);
  private static readonly k = ethers.toBigInt(import.meta.env.VITE_K);

  private static modPow(
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

  static computeLoginProof(
    email: string,
    password: string,
    salt: string,
    serverPublicKey: string
  ) {
    const clientPrivateKey = ethers.toBigInt(ethers.randomBytes(32));
    const clientPublicKey = this.modPow(this.g, clientPrivateKey, this.N);

    const x = this.calculateX(email, password, salt);
    const bigintServerPublicKey = ethers.toBigInt(`0x${serverPublicKey}`);

    const u = ethers.toBigInt(
      ethers.keccak256(
        ethers.concat([
          ethers.toBeArray(clientPublicKey),
          ethers.toBeArray(bigintServerPublicKey),
        ])
      )
    );

    const gToX = this.modPow(this.g, x, this.N);
    const kgToX = (this.k * gToX) % this.N;
    const base = (bigintServerPublicKey - kgToX + this.N) % this.N;

    const S = this.modPow(base, clientPrivateKey + u * x, this.N);
    const K = ethers.keccak256(ethers.toBeArray(S));

    const M1 = ethers.keccak256(
      ethers.concat([
        ethers.toBeArray(clientPublicKey),
        ethers.toBeArray(BigInt(bigintServerPublicKey)),
        K,
      ])
    );

    return {
      clientPublicKey: clientPublicKey.toString(),
      clientProof: ethers.hexlify(M1),
      K,
    };
  }

  static generateRegistrationData(email: string, password: string) {
    const salt = ethers.randomBytes(16);

    const x = ethers.toBigInt(
      ethers.keccak256(
        ethers.concat([
          ethers.toBeArray(ethers.toBigInt(salt)),
          ethers.keccak256(
            ethers.concat([
              ethers.toUtf8Bytes(email),
              ethers.toUtf8Bytes(":"),
              ethers.toUtf8Bytes(password),
            ])
          ),
        ])
      )
    );

    const verifier = this.modPow(this.g, x, this.N);

    return {
      salt: ethers.hexlify(salt),
      verifier: verifier.toString(16),
    };
  }

  private static calculateX(
    email: string,
    password: string,
    salt: string
  ): bigint {
    return ethers.toBigInt(
      ethers.keccak256(
        ethers.concat([
          ethers.toBeArray(ethers.toBigInt(salt)),
          ethers.keccak256(
            ethers.concat([
              ethers.toUtf8Bytes(email),
              ethers.toUtf8Bytes(":"),
              ethers.toUtf8Bytes(password),
            ])
          ),
        ])
      )
    );
  }
}
