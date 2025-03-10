import React, { useState } from 'react';
import { LoginData, User } from '../types';
import { Mail, Lock, LogIn } from 'lucide-react';
import logo from '../assets/logoleads.png';
interface LoginProps {
  onSuccess: (userData: User) => void;
  onSignupClick: () => void;
}

export default function Login({ onSuccess, onSignupClick }: LoginProps) {
  const [formData, setFormData] = useState<LoginData>({
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
      const response = await fetch('https://api.leadtech.solutions/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userName: data.userName,
        credits: data.credits,
      }));
      onSuccess({
        userName: data.userName,
        credits: data.credits,
        token: data.token,
      });
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full">
      <div className="flex justify-center mb-8">
        <div className="bg-blue-100 p-4 rounded-full">

        <img 
        src={logo}
        alt="Company Logo" 
        className="w-16 h-16 object-contain" 
      />
          {/* <LogIn className="w-8 h-8 text-blue-600" /> */}
        </div>
      </div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
      <p className="text-center text-gray-600 mb-8">Please sign in to your account</p>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSignupClick}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </form>
    </div>
  );
}