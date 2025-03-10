import React from 'react';
import { CreditCard } from 'lucide-react';

interface CreditAlertProps {
  onClose: () => void;
}

export default function CreditAlert({ onClose }: CreditAlertProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <CreditCard className="w-16 h-16 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Low Credits Alert!</h2>
        <p className="text-gray-600 text-center mb-6">
          Your credits are running low. Recharge now to continue using all features!
        </p>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-center font-bold text-2xl text-blue-600">₹199</p>
          <p className="text-center text-gray-600">for 150 credits</p>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onClose}
        >
          Recharge Now
        </button>
      </div>
    </div>
  );
}