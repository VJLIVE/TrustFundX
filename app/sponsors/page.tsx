'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import { createGrant } from '@/lib/contractMethods';
import {
  ChevronDown,
  Plus,
  Wallet,
  Building2 as BuildingOfficeIcon,
  User as UserIcon,
  CircleDollarSign as CurrencyDollarIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon
} from 'lucide-react';

export default function SponsorDashboard() {
  const router = useRouter();
  const { peraWallet, accountAddress, disconnectWallet } = useWallet();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teamAddress, setTeamAddress] = useState('');
  const [requiredVotes, setRequiredVotes] = useState(2);
  const [milestoneCount, setMilestoneCount] = useState(3);
  const [grants, setGrants] = useState<any[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'sponsor') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    disconnectWallet();
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleInit = async () => {
    if (!peraWallet || !accountAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (!teamAddress.trim()) {
      setError('Please enter a team wallet address');
      return;
    }

    console.log('Pera Wallet instance:', peraWallet);
    console.log('Connected account:', accountAddress);
    console.log('Team address:', teamAddress);
    console.log('Required votes:', requiredVotes);
    console.log('Milestone count:', milestoneCount);

    try {
      setLoading(true);
      setError('');

      const txid = await createGrant(
        peraWallet,
        accountAddress,
        teamAddress,
        requiredVotes,
        milestoneCount
      );

      const response = await fetch('/api/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsorAddress: accountAddress,
          teamAddress,
          requiredVotes,
          milestoneCount,
          appId: parseInt(process.env.NEXT_PUBLIC_APP_ID || '0'),
          txId: txid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to store grant in database');
      }

      alert(`Grant created successfully! Transaction ID: ${txid}`);
      setTeamAddress('');
      setShowCreateForm(false);
      fetchGrants();
    } catch (err: any) {
      console.error('Grant creation error:', err);
      setError(err.message || 'Failed to create grant');
    } finally {
      setLoading(false);
    }
  };

  const fetchGrants = async () => {
    if (!accountAddress) return;

    try {
      const response = await fetch(`/api/grants?sponsorAddress=${accountAddress}`);
      const data = await response.json();
      const fetchedGrants = data.grants || [];
      setGrants(fetchedGrants);

      let totalFundedAmount = 0;
      let totalPaidAmount = 0;

      for (const grant of fetchedGrants) {
        totalFundedAmount += grant.totalFunded || 0;

        const milestonesResponse = await fetch(`/api/milestones?grantId=${grant._id}`);
        const milestonesData = await milestonesResponse.json();
        const milestones = milestonesData.milestones || [];

        console.log('Grant ID:', grant._id);
        console.log('Total Funded for this grant:', grant.totalFunded);
        console.log('Milestones:', milestones);

        milestones.forEach((milestone: any) => {
          console.log('Milestone:', milestone.milestoneId, 'Amount:', milestone.amount, 'Paid:', milestone.paid);
          if (milestone.paid) {
            totalPaidAmount += milestone.amount;
          }
        });
      }

      console.log('Total Funded:', totalFundedAmount);
      console.log('Total Paid:', totalPaidAmount);

      setTotalInvested(totalFundedAmount);
      setTotalPaid(totalPaidAmount);
    } catch (err) {
      console.error('Failed to fetch grants:', err);
    }
  };

  useEffect(() => {
    if (user && accountAddress) {
      fetchGrants();
    }
  }, [user, accountAddress]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center gap-2 mr-4">
                <div className="bg-black text-white w-6 h-6 flex items-center justify-center font-bold text-sm rounded-sm transform -rotate-6">
                  X
                </div>
                <span className="font-semibold text-lg tracking-tight text-black">TrustFundX</span>
              </Link>
              <div className="h-6 w-[1px] bg-gray-300" />
              <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center shadow-sm ml-3">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Sponsor Dashboard
                </h1>
                <p className="text-xs text-slate-500 font-medium">Manage your grants & investments</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                <UserIcon className="w-4 h-4" />
                <span>{user.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-all duration-200 flex items-center space-x-2 text-sm"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8">
          <div className="flex items-start space-x-5 mb-6">
            <div className="w-16 h-16 bg-blue-400 rounded-xl flex items-center justify-center shadow-sm">
              <BuildingOfficeIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome back, {user.name}!</h2>
              <p className="text-sm text-gray-500">Sponsor Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Organization</p>
              <p className="text-sm font-medium text-gray-900">{user.organization}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Wallet Address</p>
              <div className="flex items-center space-x-2 mt-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-mono text-gray-900">
                  {user.walletAddress?.slice(0, 8)}...{user.walletAddress?.slice(-6)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Funded Projects</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {grants.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Total projects sponsored</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Invested</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalInvested.toFixed(2)} ALGO
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Total funding committed</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Paid</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalPaid.toFixed(2)} ALGO
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Released to teams</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Active Grants</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {grants.filter(g => g.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Ongoing grants</p>
          </div>
        </div>

        {/* Grants Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-3">
                <span>Grant Management</span>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {grants.length}
                </span>
              </h3>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>{showCreateForm ? 'Cancel' : 'Create Grant'}</span>
              </button>
            </div>
          </div>

          {/* Create Grant Form */}
          {showCreateForm && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="max-w-2xl space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-start space-x-3">
                    <div className="w-5 h-5 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Team Wallet Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Wallet className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={teamAddress}
                        onChange={(e) => setTeamAddress(e.target.value)}
                        placeholder="Enter Algorand wallet address"
                        className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all duration-200"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Enter a valid Algorand address (58 characters)</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Required Votes</label>
                    <input
                      type="number"
                      min="1"
                      value={requiredVotes}
                      onChange={(e) => setRequiredVotes(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Number of Milestones</label>
                  <input
                    type="number"
                    min="1"
                    value={milestoneCount}
                    onChange={(e) => setMilestoneCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all duration-200"
                  />
                </div>

                <button
                  onClick={handleInit}
                  disabled={loading || !peraWallet || !accountAddress || !teamAddress.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 w-full"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Grant...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Grant</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Grants List */}
          <div className="p-6">
            {grants.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-6">
                  <Wallet className="w-12 h-12 text-slate-400" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">No grants yet</h4>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Create your first grant to start funding innovative projects and teams.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
                >
                  Create First Grant
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {grants.map((grant) => (
                  <div
                    key={grant._id}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition cursor-pointer"
                    onClick={() => router.push(`/sponsors/grants/${grant._id}`)}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-base font-medium text-gray-900 mb-1">
                          Grant #{grant._id.slice(-6).toUpperCase()}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono">
                          <span>ID:</span>
                          <span className="font-semibold">{grant._id.slice(0, 8)}...</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${grant.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {grant.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2 text-slate-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Team:</span>
                        </div>
                        <div className="font-mono font-semibold text-gray-900 bg-slate-100 px-3 py-1 rounded-xl text-sm">
                          {grant.teamAddress.slice(0, 8)}...{grant.teamAddress.slice(-6)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-700">{grant.milestoneCount}</span>
                          </div>
                          <span>Milestones</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-700">{grant.requiredVotes}</span>
                          </div>
                          <span>Required Votes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                      <div className="text-xs text-slate-500 font-mono">
                        TX: {grant.txId.slice(0, 8)}...{grant.txId.slice(-8)}
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                        <span>Manage Grant</span>
                        <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
