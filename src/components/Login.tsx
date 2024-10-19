import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { g, k, modPow, N } from '../srpUtils';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const initResponse = await axios.post('http://localhost:3000/auth/login-init', { email });
      const { salt, serverPublicKey } = initResponse.data;

      const clientPrivateKey = ethers.toBigInt(ethers.randomBytes(32));
      const clientPublicKey = modPow(g, clientPrivateKey, N);

      const x = ethers.toBigInt(ethers.keccak256(ethers.concat([
        ethers.toBeArray(ethers.toBigInt(salt)),
        ethers.keccak256(ethers.concat([
          ethers.toUtf8Bytes(email),
          ethers.toUtf8Bytes(':'),
          ethers.toUtf8Bytes(password)
        ]))
      ])));

      const bigintServerPublicKey = ethers.toBigInt(`0x${serverPublicKey}`)

      const u = ethers.toBigInt(ethers.keccak256(ethers.concat([
        ethers.toBeArray(clientPublicKey), 
        ethers.toBeArray(bigintServerPublicKey)
      ])));

      const gToX = modPow(g, x, N);
      const kgToX = (k * gToX) % N;
      const base = (bigintServerPublicKey - kgToX + N) % N;

      const S = modPow(base, clientPrivateKey + u * x, N);

      const K = ethers.keccak256(ethers.toBeArray(S));

      // Step 4: Compute client proof
      const M1 = ethers.keccak256(ethers.concat([
        ethers.toBeArray(clientPublicKey),
        ethers.toBeArray(BigInt(bigintServerPublicKey)),
        K
      ]));

      // Step 5: Complete login
      const completeResponse = await axios.post('http://localhost:3000/auth/login-complete', {
        email,
        clientPublicKey: clientPublicKey.toString(),
        clientProof: ethers.hexlify(M1)
      });


      const { M2, accessToken, refreshToken } = completeResponse.data;

      console.log('Received from server:', {
        M2
      });

      // Step 6: Verify server proof
      const expectedM2 = ethers.keccak256(ethers.concat([
        ethers.toBeArray(clientPublicKey),
        M1,
        K
      ]));

      if (M2 !== ethers.hexlify(expectedM2)) {
        throw new Error('Server verification failed');
      }

      localStorage.setItem('accessToken', accessToken )
      localStorage.setItem('refreshToken', refreshToken )

      console.log('Client computed M2:', ethers.hexlify(expectedM2));

      // Login successful, save the token

      // Redirect or update app state here
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};