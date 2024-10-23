import React, { useState, useEffect } from 'react';
import useBoundStore from '../store/useStore';
import { UpdateProfileData } from '../types/profile';
import { User, Mail, Loader2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, updateProfile, setProfile } = useBoundStore();
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(()=> {
    setProfile();
  },[setProfile])

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        username: profile.username
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateProfile(formData);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

return (
  <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile Settings</h1>
    
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 text-gray-500" />
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 text-gray-500" />
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
            placeholder="Enter your username"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Updating...
          </>
        ) : (
          'Update Profile'
        )}
      </button>
    </form>
  </div>
);
};