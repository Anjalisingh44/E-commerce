import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AccountSettings = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        city: '',
    });

    const [newPassword, setNewPassword] = useState({
        currentPassword: '',
        newPassword: '',
    });

    const [newCity, setNewCity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const userToken = localStorage.getItem('accessToken');

    // Fetch user profile
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setUserData(response.data);
            } catch (err) {
                setError('Failed to fetch user profile.');
            }
        };

        fetchUserProfile();
    }, [userToken]);

    // Handle Profile Update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                '/api/users/profile', // matches your backend route
                {
                    username: userData.username,
                    email: userData.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    // Handle Password Change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                '/api/users/password', // matches your backend route
                newPassword,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setSuccess('Password changed successfully!');
        } catch (err) {
            setError('Failed to change password.');
        }
    };

    // Handle City Update
    const handleCityUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                '/api/users/address/city', // matches your backend route
                { city: newCity },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setSuccess('City updated successfully!');
        } catch (err) {
            setError('Failed to update city.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            {/* Profile Settings Form */}
            <form onSubmit={handleProfileUpdate} className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                <div className="mb-4">
                    <label className="block mb-2">Username</label>
                    <input
                        type="text"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Update Profile
                </button>
            </form>

            {/* Password Change Form */}
            <form onSubmit={handlePasswordChange} className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>

                <div className="mb-4 relative">
                    <label className="block mb-2">Current Password</label>
                    <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={newPassword.currentPassword}
                        onChange={(e) => setNewPassword({ ...newPassword, currentPassword: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <div
                        className="absolute right-3 top-10 cursor-pointer"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                        {showCurrentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </div>
                </div>

                <div className="mb-4 relative">
                    <label className="block mb-2">New Password</label>
                    <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword.newPassword}
                        onChange={(e) => setNewPassword({ ...newPassword, newPassword: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <div
                        className="absolute right-3 top-10 cursor-pointer"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </div>
                </div>

                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Change Password
                </button>
            </form>

            {/* Address (City only) Form */}
            <form onSubmit={handleCityUpdate} className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Manage City</h2>
                <div className="mb-4">
                    <label className="block mb-2">City</label>
                    <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Update City
                </button>
            </form>
        </div>
    );
};

export default AccountSettings;
