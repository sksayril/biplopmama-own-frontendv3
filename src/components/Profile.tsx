import React from 'react';
import { User } from '../types';
import { UserCircle, CreditCard } from 'lucide-react';

interface ProfileProps {
  user: {
    userName: string;
    credits: number;
  };
  onLogout: () => void;
}

export default function Profile({ user, onLogout }: ProfileProps) {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <UserCircle className="w-20 h-20 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">{user.userName}</h2>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <CreditCard className="w-5 h-5 text-green-600" />
            <span className="text-lg font-semibold">Credits: {user.credits}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}