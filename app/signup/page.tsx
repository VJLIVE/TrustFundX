'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { UserRole } from '@/lib/types';

export default function SignupPage() {
  const router = useRouter();
  const { connectWallet, accountAddress } = useWallet();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: 'student' as UserRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!formData.name || !formData.email || !formData.organization) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      const accounts = await connectWallet();

      if (accounts.length > 0) {
        await handleSignup(accounts[0]);
      }
    } catch (err) {
      setError('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          walletAddress,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      localStorage.setItem('user', JSON.stringify({ ...formData, walletAddress }));

      router.push(`/${formData.role}s`);
    } catch (err: any) {
      setError(err.message);
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
          <h2 className="text-4xl font-semibold mb-4 leading-tight tracking-tight">Join the future of<br />education funding.</h2>
          <p className="text-blue-100 text-lg max-w-md">Create your account to start sponsoring students or vote on proposals seamlessly on the TrustFundX blockchain.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md bg-card text-card-foreground rounded-xl shadow-sm border border-border p-8 relative z-10">

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground font-medium">TrustFundX × Pera</p>
            <h1 className="text-2xl tracking-tight font-semibold mt-2">
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Secure onboarding with wallet authentication
            </p>
          </div>

          {/* STEP 1 */}
          {step === 1 ? (
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  placeholder="Enter your organization"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                >
                  <option value="student">Student</option>
                  <option value="sponsor">Sponsor</option>
                  <option value="voter">Voter</option>
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20 font-medium">
                  {error}
                </div>
              )}

              {/* Button */}
              <button
                onClick={handleNext}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4"
              >
                Continue
              </button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{' '}
                <a href="/login" className="text-primary font-medium hover:underline underline-offset-4">
                  Login
                </a>
              </p>
            </div>
          ) : (
            /* STEP 2 */
            <div className="space-y-6 text-center">
              <div>
                <p className="text-muted-foreground mb-4">
                  Connect your wallet to finish signup
                </p>

                {accountAddress && (
                  <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-md text-sm border border-primary/20 font-medium">
                    {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20 font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleConnectWallet}
                disabled={loading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full flex-row gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"></span>
                    <span>Connecting...</span>
                  </>
                ) : (
                  'Connect Pera Wallet'
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full border border-input bg-background"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}