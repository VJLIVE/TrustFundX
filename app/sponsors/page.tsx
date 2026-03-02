'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { createGrant } from '@/lib/contractMethods';

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
      
      // Create grant on blockchain
      const txid = await createGrant(
        peraWallet,
        accountAddress,
        teamAddress,
        requiredVotes,
        milestoneCount
      );
      
      // Store grant in database
      const response = await fetch('/api/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsorAddress: accountAddress,
          teamAddress,
          requiredVotes,
          milestoneCount,
          appId: 756429531, // Your APP_ID
          txId: txid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to store grant in database');
      }

      alert(`Grant created successfully! Transaction ID: ${txid}`);
      setTeamAddress('');
      
      // Refresh grants list
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
      
      // Calculate total funded from grants
      let totalFundedAmount = 0;
      let totalPaidAmount = 0;
      
      for (const grant of fetchedGrants) {
        // Add up all funding sent to this grant
        totalFundedAmount += grant.totalFunded || 0;
        
        // Fetch milestones to calculate total paid
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Sponsor Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user.name}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Organization</p>
              <p className="font-medium text-gray-800">{user.organization}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Wallet Address</p>
              <p className="font-mono text-sm text-gray-800">{user.walletAddress}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Funded Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{grants.length}</p>
            <p className="text-sm text-gray-600 mt-2">Total projects</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Invested</h3>
            <p className="text-3xl font-bold text-green-600">{totalInvested.toFixed(2)} ALGO</p>
            <p className="text-sm text-gray-600 mt-2">Total funding provided</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Paid</h3>
            <p className="text-3xl font-bold text-blue-600">{totalPaid.toFixed(2)} ALGO</p>
            <p className="text-sm text-gray-600 mt-2">Released to teams</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Grants</h3>
            <p className="text-3xl font-bold text-purple-600">{grants.filter(g => g.status === 'active').length}</p>
            <p className="text-sm text-gray-600 mt-2">Ongoing grants</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create Grant</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Wallet Address
                </label>
                <input
                  type="text"
                  value={teamAddress}
                  onChange={(e) => setTeamAddress(e.target.value)}
                  placeholder="Enter Algorand wallet address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid Algorand address (58 characters)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Votes for Approval
                </label>
                <input
                  type="number"
                  min="1"
                  value={requiredVotes}
                  onChange={(e) => setRequiredVotes(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Milestones
                </label>
                <input
                  type="number"
                  min="1"
                  value={milestoneCount}
                  onChange={(e) => setMilestoneCount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
              </div>
            </div>

            <button
              onClick={handleInit}
              disabled={loading || !peraWallet || !accountAddress || !teamAddress.trim()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Grant...' : 'Create Grant'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Grant Management</h3>
            
            {grants.length === 0 ? (
              <p className="text-gray-600">No active grants</p>
            ) : (
              <div className="space-y-4">
                {grants.map((grant) => (
                  <div 
                    key={grant._id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/sponsors/grants/${grant._id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">Grant #{grant._id.slice(-6)}</h4>
                        <p className="text-xs text-gray-500 font-mono mb-1">ID: {grant._id}</p>
                        <p className="text-sm text-gray-600">Team: {grant.teamAddress.slice(0, 8)}...{grant.teamAddress.slice(-6)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        grant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {grant.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Milestones:</span>
                        <span className="ml-2 font-medium">{grant.milestoneCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Required Votes:</span>
                        <span className="ml-2 font-medium">{grant.requiredVotes}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      TX: {grant.txId.slice(0, 10)}...{grant.txId.slice(-10)}
                    </div>
                    <div className="mt-2 text-sm text-blue-600">
                      Click to manage →
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
