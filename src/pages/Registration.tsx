import { ethers } from 'ethers';
import React, { useState } from 'react';
import { g, modPow, N } from '../srpUtils';
import { register } from '../services/auth';
import useBoundStore from '../store/useStore';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const {setLoggedIn} = useBoundStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const salt = ethers.randomBytes(16)

    const x = ethers.toBigInt(ethers.keccak256(ethers.concat([
      ethers.toBeArray(ethers.toBigInt(salt)),
      ethers.keccak256(ethers.concat([
        ethers.toUtf8Bytes(formData.email),
        ethers.toUtf8Bytes(':'),
        ethers.toUtf8Bytes(formData.password)
      ]))
    ])));

    const v = modPow(g, x, N);
    
    const registrationData = {
      email: formData.email,
      salt: ethers.hexlify(salt),
      verifier: v.toString(16),
      username:formData.username,
      name: formData.name,
    };
    
    try {
      const {refreshToken, accessToken} = await register(registrationData);
      localStorage.setItem('refreshToken',refreshToken);
      localStorage.setItem('accessToken',accessToken);
      setLoggedIn(true);
    } catch (error) {
      console.log(error)
    }
  };

const [showPassword, setShowPassword] = useState(false);

return (
  <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
    
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 text-gray-500" />
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 text-gray-500" />
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div>
          <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <UserPlus className="h-4 w-4 text-gray-500" />
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
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
          Register
        </button>
        
        <Link 
          to="/login" 
          className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
        >
          Already have an account?
        </Link>
      </div>
    </form>
  </div>
);
};