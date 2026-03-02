'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';

export default function StudentDashboard() {
  const router = useRouter();
  const { accountAddress, disconnectWallet } = useWallet();
  const [user, setUser] = useState<any>(null);
  const [grants, setGrants] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'student') {
      router.push('/login');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  useEffect(() => {
    if (user && accountAddress) {
      fetchGrants();
    }
  }, [user, accountAddress]);

  const fetchGrants = async () => {
    if (!accountAddress) return;
    
    try {
      // Fetch grants where team address matches student's wallet
      const response = await fetch(`/api/grants?teamAddress=${accountAddress}`);
      const data = await response.json();
      setGrants(data.grants || []);

      // Fetch milestones for these grants
      if (data.grants && data.grants.length > 0) {
        const grantId = data.grants[0]._id;
        const milestonesRes = await fetch(`/api/milestones?grantId=${grantId}`);
        const milestonesData = await milestonesRes.json();
        setMilestones(milestonesData.milestones || []);
      }
    } catch (err) {
      console.error('Failed to fetch grants:', err);
    }
  };

  const handleLogout = () => {
    disconnectWallet();
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  const totalFunding = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const completedMilestones = milestones.filter(m => m.paid).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Student Dashboard</h1>
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
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Organization</p>
              <p className="font-medium">{user.organization}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Wallet Address</p>
              <p className="font-mono text-sm">{user.walletAddress}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">My Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{grants.length}</p>
            <p className="text-sm text-gray-600 mt-2">Active projects</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Funding</h3>
            <p className="text-3xl font-bold text-green-600">{totalFunding.toFixed(2)} ALGO</p>
            <p className="text-sm text-gray-600 mt-2">Received funding</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Milestones</h3>
            <p className="text-3xl font-bold text-purple-600">{completedMilestones}/{milestones.length}</p>
            <p className="text-sm text-gray-600 mt-2">Completed milestones</p>
          </div>
        </div>

        {/* Grants */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Grants</h3>
          {grants.length === 0 ? (
            <p className="text-gray-600">No grants assigned yet</p>
          ) : (
            <div className="space-y-4">
              {grants.map((grant) => (
                <div key={grant._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">Grant #{grant._id.slice(-6)}</h4>
                      <p className="text-sm text-gray-600">Sponsor: {grant.sponsorAddress.slice(0, 8)}...{grant.sponsorAddress.slice(-6)}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Milestones</h3>
          {milestones.length === 0 ? (
            <p className="text-gray-600">No milestones created yet</p>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">Milestone #{milestone.milestoneId}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">{milestone.amount} ALGO</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-600">Approvals: </span>
                      <span className="font-medium">{milestone.approvals}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      milestone.paid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {milestone.paid ? 'Paid' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
