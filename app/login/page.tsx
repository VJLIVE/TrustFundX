'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';

export default function LoginPage() {
  const router = useRouter();
  const { connectWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const accounts = await connectWallet();

      if (accounts.length > 0) {
        const walletAddress = accounts[0];

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        localStorage.setItem('user', JSON.stringify(data.user));

        router.push(`/${data.user.role}s`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - TrustFundX Branding */}
      <div className="hidden lg:flex flex-col bg-blue-600 text-white p-12 justify-between relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <img src="/unnamed.jpg" alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 object-cover" />
        </div>

        {/* Top Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
          <img src="/unnamed.jpg" alt="TrustFundX Logo" className="w-8 h-8 rounded-full object-cover" />
          <span className="text-2xl font-bold tracking-tight">TrustFundX</span>
        </div>

        {/* Bottom Copy Area */}
        <div className="relative z-10 mt-auto">
          <h2 className="text-4xl font-semibold mb-4 leading-tight tracking-tight">Empowering transparent<br />funding on TrustFundX.</h2>
          <p className="text-blue-100 text-lg max-w-md">Connect your Pera Wallet to access your dashboard, securely manage sponsorships, and track distributions.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center bg-background px-4 py-12">
        <div className="bg-card text-card-foreground w-full max-w-md rounded-xl border border-border shadow-sm p-8 text-center relative z-10">
          {/* Header */}
          <p className="text-sm text-muted-foreground mb-6 font-medium">
            TrustFundX × Pera
          </p>

          {/* Heading */}
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-snug">
            Welcome Back to Your
            <br />
            TrustFundX Dashboard
          </h1>

          <p className="text-muted-foreground text-sm mb-6">
            Connect your Pera Wallet to securely access features.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 font-medium">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10 px-4 py-2 rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"></span>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span>Connect Pera Wallet</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-muted-foreground">
            New to TrustFundX?{' '}
            <a href="/signup" className="text-primary font-medium hover:underline underline-offset-4">
              Create your Pera Wallet
            </a>
          </p>

          <p className="text-xs text-muted-foreground/60 mt-6">
           Secured by Pera Wallet
          </p>
        </div>
      </div>
    </div>
  );
}