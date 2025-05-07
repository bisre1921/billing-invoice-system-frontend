'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

interface User {
  _id: string;
  name?: string;
  email?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user profile.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userInfo?.user_id]);

  if (loading) {
    return <div>Loading profile information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No profile information available.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Your Profile</h1>
      <div className="bg-white shadow-md rounded-md p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p className="text-gray-900">{user.name || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="text-gray-900">{user.email || 'N/A'}</p>
        </div>
        <button
          onClick={() => router.push('/profile/edit')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Edit Profile
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
              // Implement delete account API call and logic using userInfo.user_id
              console.log('Delete account clicked for user:', userInfo?.user_id);
            }
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;