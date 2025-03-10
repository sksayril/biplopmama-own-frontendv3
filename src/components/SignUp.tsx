import React, { useState } from 'react';
import { SignupData } from '../types';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import logo from '../assets/logoleads.png';

interface SignUpProps {
  onSuccess: () => void;
}

export default function SignUp({ onSuccess }: SignUpProps) {
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.leadtech.solutions/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      onSuccess();
    } catch (err) {
      setError('Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full">
      <div className="flex justify-center mb-8">
        <div className="bg-purple-100 p-4 rounded-full">
        <img 
        src={logo}
        alt="Company Logo" 
        className="w-16 h-16 object-contain" 
      />        </div>
      </div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
      <p className="text-center text-gray-600 mb-8">Join us and start generating leads</p>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Create a password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <span>Creating account...</span>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSuccess}
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}