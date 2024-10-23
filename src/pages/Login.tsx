import React, { useState } from 'react';
import { ethers } from 'ethers';
import { g, k, modPow, N } from '../srpUtils';
import { completeLogin, initLogin } from '../services/auth';
import useBoundStore from '../store/useStore';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff} from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const { setLoggedIn } = useBoundStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const initResponse = await initLogin(email)
      const { salt, serverPublicKey } = initResponse;

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
      const completeResponse = await completeLogin(email, clientPublicKey.toString(), ethers.hexlify(M1))

      const { M2, accessToken, refreshToken } = completeResponse;

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
      setLoggedIn(true);

      // Redirect or update app state here
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };

return (
  <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
    
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 text-gray-500" />
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Lock className="h-4 w-4 text-gray-500" />
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          Sign In
        </button>
        
        <Link 
          to="/registration" 
          className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
        >
          Create account
        </Link>
      </div>
    </form>
  </div>
);
};