import React, { useState, useEffect } from 'react';
import { UserCircle, CreditCard, Coins } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function UserSection() {
  const [user, setUser] = useState<{ userName: string; credits: number }>({
    userName: '',
    credits: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const userToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchCredits = async () => {
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
  
        const data = await response.json();
        console.log('Fetched Credits:', data); // Debugging output
        
        if (response.ok) {
          setUser({ userName: data.userName, credits: data.credits });
        }
      } catch (error) {
        console.error('Failed to fetch user credits:', error);
      }
    };
  
    fetchCredits();
  }, [userToken]);
  
  const handlePayment = async () => {
    if (!userToken) {
      console.error('User token not found');
      return;
    }
    setIsLoading(true);
    try {
      const orderResponse = await fetch('https://api.leadtech.solutions/api/data/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 199 }),
      });

      const orderData = await orderResponse.json();

      const options = {
        // key: 'rzp_test_BDT2TegS4Ax6Vp',
        key: 'rzp_test_DUyJsTbSpXKKaz',
        amount: 199 * 100,
        currency: 'INR',
        name: 'Lead Generator',
        description: '150 Credits Purchase',
        order_id: orderData.id,
        handler: async function (response: any) {
          const verifyResponse = await fetch('https://api.leadtech.solutions/api/data/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userToken,
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
            }),
          });

          if (verifyResponse.ok) {
            window.location.reload();
          }
        },
        prefill: {
          name: user.userName,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <UserCircle className="w-24 h-24 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-center mb-2">{user.userName}</h3>
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Coins className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-semibold">{user.credits} Credits</span>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Premium Package</h4>
                  <p className="text-sm text-gray-600">250 Credits</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">₹199</span>
            </div>
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Purchase Credits</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}