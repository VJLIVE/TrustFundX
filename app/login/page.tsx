'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';

export default function LoginPage() {
  const router = useRouter();
  const { connectWallet, accountAddress } = useWallet();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const accounts = await connectWallet();
      
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        localStorage.setItem('user', JSON.stringify(data.user));

        switch (data.user.role) {
          case 'student':
            router.push('/students');
            break;
          case 'sponsor':
            router.push('/sponsors');
            break;
          case 'voter':
            router.push('/voters');
            break;
          default:
            router.push('/students');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h1>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Connect your Pera Wallet to login
            </p>
            
            {accountAddress && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">
                Connected: {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Connecting...' : 'Connect Pera Wallet'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
