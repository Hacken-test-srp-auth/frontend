import { ethers } from 'ethers';
import React, { useState } from 'react';
import { g, modPow, N } from '../srpUtils';
import { register } from '../services/auth';
import useBoundStore from '../store/useStore';

interface RegistrationFormData {
  username: string;
  email: string;
  name: string;
  password: string;
}

export const Registration: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    email: '',
    name: '',
    password: '',
  });

  const { setLoggedIn } = useBoundStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const salt = ethers.randomBytes(16);

    const x = ethers.toBigInt(
      ethers.keccak256(
        ethers.concat([
          ethers.toBeArray(ethers.toBigInt(salt)),
          ethers.keccak256(
            ethers.concat([
              ethers.toUtf8Bytes(formData.email),
              ethers.toUtf8Bytes(':'),
              ethers.toUtf8Bytes(formData.password),
            ])
          ),
        ])
      )
    );

    const v = modPow(g, x, N);

    const registrationData = {
      email: formData.email,
      salt: ethers.hexlify(salt),
      verifier: v.toString(16),
      username: formData.username,
      name: formData.name,
    };

    try {
      const { refreshToken, accessToken } = await register(registrationData);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('accessToken', accessToken);
      setLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
