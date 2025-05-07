'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, updateUser } from '../../api/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const EditProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserInput>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userInfo?.user_id) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getUser(userInfo.user_id);
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          address: response.data.user.address,
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user profile.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userInfo?.user_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo?.user_id) {
      setError('User not authenticated.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateUser(userInfo.user_id, formData);
      setSuccessMessage('Profile updated successfully!');
      setLoading(false);
      setTimeout(() => {
        router.push('/profile'); 
      }, 1000); 
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10 text-center">Loading profile information...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-10 text-red-500 text-center">Error: {error}</div>;
  }

  if (!user) {
    return <div className="container mx-auto py-10 text-gray-500 text-center">No profile information available.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Edit Your Profile</h1>
      <div className="bg-white shadow-md rounded-md p-6">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{successMessage}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;