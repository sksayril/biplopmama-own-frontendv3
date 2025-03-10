import React, { useState, useEffect } from 'react';
import { History, Users, Database, LogOut, Coins, Menu, X, FileText } from 'lucide-react';
import LeadsSection from './LeadsSection';
import HistorySection from './HistorySection';
import UserSection from './UserSection';
import mainlogo from '../assets/mainlogo.png';
interface DashboardProps {
  user: {
    userName: string;
    credits: number;
  };
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('leads');
  const [credits, setCredits] = useState(user.credits);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCredits = async () => {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        console.error('User token not found');
        return;
      }

      try {
        const response = await fetch('https://api.leadtech.solutions/api/users/get-credits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch credits');
        }

        const data = await response.json();
        setCredits(data.credits);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchCredits();
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false); // Close mobile menu when section changes
  };

  const redirectToTerms = () => {
    window.open('https://leadtech.solutions/terms-conditions.html', '_blank');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'leads':
        return <LeadsSection />;
      case 'history':
        return <HistorySection />;
      case 'user':
        return <UserSection user={user} />;
      default:
        return <LeadsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
            <img 
        src={mainlogo}
        alt="Company Logo" 
        className="w-30 h-20 object-contain" 
      />
            </div>
            <div className="flex items-center space-x-4">
              {/* Uncomment if you want to show credits */}
              {/* <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold">{credits} Credits</span>
              </div> */}
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center text-gray-600"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <button
                onClick={onLogout}
                className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu - Slide down when open */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => handleSectionChange('leads')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'leads'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Database className="w-5 h-5" />
              <span>Get Leads</span>
            </button>
            <button
              onClick={() => handleSectionChange('history')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'history'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <History className="w-5 h-5" />
              <span>History</span>
            </button>
            <button
              onClick={() => handleSectionChange('user')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>User Profile</span>
            </button>
            <button
              onClick={redirectToTerms}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100`}
            >
              <FileText className="w-5 h-5" />
              <span>Terms & Conditions</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - hidden on mobile, shown on md and larger screens */}
          <div className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('leads')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'leads'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Database className="w-5 h-5" />
                  <span>Get Leads</span>
                </button>
                <button
                  onClick={() => setActiveSection('history')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'history'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span>History</span>
                </button>
                <button
                  onClick={() => setActiveSection('user')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>User Profile</span>
                </button>
                <button
                  onClick={redirectToTerms}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100"
                >
                  <FileText className="w-5 h-5" />
                  <span>Terms & Conditions</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content area - full width on mobile, 3/4 width on md and larger screens */}
          <div className="md:col-span-3 col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              {/* Show active section title on mobile */}
              <div className="md:hidden mb-4 pb-3 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeSection === 'leads' && 'Get Leads'}
                  {activeSection === 'history' && 'History'}
                  {activeSection === 'user' && 'User Profile'}
                </h2>
              </div>
              
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Terms link */}
      {/* <footer className="bg-white py-4 shadow-inner mt-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
  &copy; {new Date().getFullYear()} Leadtech Open Source Technology. All Rights Reserved.
</div>

      </footer> */}
    </div>
  );
}