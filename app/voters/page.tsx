'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { approveMilestone } from '@/lib/contractMethods';
import { checkVoteExists, checkVoterRegistered, checkMilestoneExists } from '@/lib/diagnostics';
import { syncMilestoneFromBlockchain } from '@/lib/syncBlockchain';

export default function VoterDashboard() {
  const router = useRouter();
  const { peraWallet, accountAddress, disconnectWallet } = useWallet();
  const [user, setUser] = useState<any>(null);
  const [grants, setGrants] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null); // Store milestone ID being approved
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'voter') {
      router.push('/login');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  useEffect(() => {
    if (user && accountAddress) {
      fetchVoterData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, accountAddress]);

  const fetchVoterData = async () => {
    if (!accountAddress) return;
    
    try {
      // Fetch grants where this user is a voter
      const votersRes = await fetch(`/api/voters?voterAddress=${accountAddress}`);
      const votersData = await votersRes.json();
      
      if (votersData.voters && votersData.voters.length > 0) {
        const grantIds: string[] = Array.from(new Set(votersData.voters.map((v: any) => v.grantId as string))); // Remove duplicates
        
        // Fetch grant details
        const grantsPromises = grantIds.map((id: string) => 
          fetch(`/api/grants?_id=${id}`).then(r => r.json())
        );
        const grantsResults = await Promise.all(grantsPromises);
        const fetchedGrants = grantsResults.map(r => r.grants[0]).filter(Boolean);
        setGrants(fetchedGrants);

        // Fetch milestones for these grants
        const milestonesPromises = grantIds.map((id: string) =>
          fetch(`/api/milestones?grantId=${id}`).then(r => r.json())
        );
        const milestonesResults = await Promise.all(milestonesPromises);
        const allMilestones = milestonesResults.flatMap(r => r.milestones || []);
        
        // Remove duplicates based on _id
        const uniqueMilestones = allMilestones.filter((milestone, index, self) =>
          index === self.findIndex((m) => m._id === milestone._id)
        );
        
        // Filter out milestones this voter has already voted on
        const milestonesWithVoteStatus = await Promise.all(
          uniqueMilestones.map(async (milestone) => {
            const hasVoted = await checkVoteExists(accountAddress, milestone.milestoneId);
            return {
              ...milestone,
              hasVoted
            };
          })
        );
        
        setMilestones(milestonesWithVoteStatus);
      }
    } catch (err) {
      console.error('Failed to fetch voter data:', err);
    }
  };

  const handleApprove = async (milestone: any) => {
    if (!peraWallet || !accountAddress) return;

    try {
      setLoading(milestone._id);
      setError('');

      // Check if voter is registered
      const isVoterRegistered = await checkVoterRegistered(accountAddress);
      if (!isVoterRegistered) {
        throw new Error(
          'You are not registered as a voter for this grant. ' +
          'Please ask the sponsor to register your wallet address: ' + 
          accountAddress
        );
      }

      // Check if milestone exists
      const milestoneExists = await checkMilestoneExists(milestone.milestoneId);
      if (!milestoneExists) {
        throw new Error('Milestone does not exist on the blockchain');
      }

      // Check if already voted
      const alreadyVoted = await checkVoteExists(accountAddress, milestone.milestoneId);
      if (alreadyVoted) {
        throw new Error('You have already voted on this milestone');
      }

      // Approve on blockchain
      const grant = grants.find(g => g._id === milestone.grantId);
      if (!grant) {
        throw new Error('Grant not found');
      }

      const txid = await approveMilestone(
        peraWallet,
        accountAddress,
        milestone.milestoneId,
        grant.teamAddress
      );

      console.log('Blockchain approval successful:', txid);

      // Sync milestone data from blockchain to database
      const synced = await syncMilestoneFromBlockchain(
        milestone._id,
        milestone.milestoneId
      );

      if (!synced) {
        console.warn('Failed to sync milestone data from blockchain');
      }

      alert(`Milestone approved! TX: ${txid}`);
      
      // Refresh data to show updated approvals
      await fetchVoterData();
    } catch (err: any) {
      console.error('Approval error:', err);
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleSyncMilestone = async (milestone: any) => {
    try {
      setLoading(milestone._id);
      setError('');
      
      const synced = await syncMilestoneFromBlockchain(
        milestone._id,
        milestone.milestoneId
      );
      
      if (synced) {
        alert('Milestone synced successfully!');
        await fetchVoterData();
      } else {
        throw new Error('Failed to sync milestone');
      }
    } catch (err: any) {
      console.error('Sync error:', err);
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleLogout = () => {
    disconnectWallet();
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  // Pending milestones: not paid AND voter hasn't voted yet
  const pendingMilestones = milestones.filter(m => !m.paid && !m.hasVoted);
  
  // Total votes this voter has cast
  const totalVotesCast = milestones.filter(m => m.hasVoted).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Voter Dashboard</h1>
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
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Votes</h3>
            <p className="text-3xl font-bold text-blue-600">{pendingMilestones.length}</p>
            <p className="text-sm text-gray-600 mt-2">Awaiting your vote</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Votes Cast</h3>
            <p className="text-3xl font-bold text-green-600">{totalVotesCast}</p>
            <p className="text-sm text-gray-600 mt-2">Votes submitted</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Grants</h3>
            <p className="text-3xl font-bold text-purple-600">{grants.length}</p>
            <p className="text-sm text-gray-600 mt-2">Assigned grants</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h3>
          {pendingMilestones.length === 0 ? (
            <p className="text-gray-600">No pending approvals</p>
          ) : (
            <div className="space-y-4">
              {pendingMilestones.map((milestone, index) => {
                const grant = grants.find(g => g._id === milestone.grantId);
                return (
                  <div key={`${milestone._id}-${index}`} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">Milestone #{milestone.milestoneId}</h4>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        {grant && (
                          <p className="text-xs text-gray-500 mt-1">
                            Grant: {grant._id.slice(-6)} | Team: {grant.teamAddress.slice(0, 8)}...
                          </p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-green-600">{milestone.amount} ALGO</span>
                    </div>
                    
                    {/* Team Submission */}
                    {(milestone.submissionNote || milestone.submissionFileUrl) && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800 mb-2">Team Submission:</p>
                        {milestone.submissionNote && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-600 mb-1">Note:</p>
                            <p className="text-sm text-gray-800">{milestone.submissionNote}</p>
                          </div>
                        )}
                        {milestone.submissionFileUrl && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-600 mb-1">Document:</p>
                            <a 
                              href={milestone.submissionFileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline inline-flex items-center"
                            >
                              📄 View Submission PDF
                            </a>
                          </div>
                        )}
                        {milestone.submittedAt && (
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(milestone.submittedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-gray-600">Approvals: </span>
                        <span className="font-medium text-gray-800">{milestone.approvals}</span>
                        {grant && (
                          <span className="text-gray-600"> / {grant.requiredVotes} required</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSyncMilestone(milestone)}
                          disabled={loading !== null}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                          title="Sync from blockchain"
                        >
                          🔄 Sync
                        </button>
                        <button
                          onClick={() => handleApprove(milestone)}
                          disabled={loading !== null}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        >
                          {loading === milestone._id ? 'Processing...' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Approved Milestones */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Approved Milestones</h3>
          {milestones.filter(m => m.hasVoted).length === 0 ? (
            <p className="text-gray-600">You haven't approved any milestones yet</p>
          ) : (
            <div className="space-y-4">
              {milestones.filter(m => m.hasVoted).map((milestone, index) => {
                const grant = grants.find(g => g._id === milestone.grantId);
                return (
                  <div key={`${milestone._id}-approved-${index}`} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Milestone #{milestone.milestoneId}
                          <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">✓ Voted</span>
                        </h4>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        {grant && (
                          <p className="text-xs text-gray-500 mt-1">
                            Grant: {grant._id.slice(-6)} | Team: {grant.teamAddress.slice(0, 8)}...
                          </p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-green-600">{milestone.amount} ALGO</span>
                    </div>
                    
                    {/* Team Submission */}
                    {(milestone.submissionNote || milestone.submissionFileUrl) && (
                      <div className="mb-2 p-3 bg-white rounded-lg">
                        <p className="text-sm font-semibold text-blue-800 mb-2">Team Submission:</p>
                        {milestone.submissionNote && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-600 mb-1">Note:</p>
                            <p className="text-sm text-gray-800">{milestone.submissionNote}</p>
                          </div>
                        )}
                        {milestone.submissionFileUrl && (
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Document:</p>
                            <a 
                              href={milestone.submissionFileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              📄 View Submission PDF
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-600">Approvals: </span>
                        <span className="font-medium text-gray-800">{milestone.approvals}</span>
                        {grant && (
                          <span className="text-gray-600"> / {grant.requiredVotes} required</span>
                        )}
                      </div>
                      <span className={milestone.paid ? 'text-green-600 font-medium' : 'text-yellow-600'}>
                        {milestone.paid ? '✓ Paid' : 'Awaiting more votes'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All Milestones */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">All Milestones</h3>
          {milestones.length === 0 ? (
            <p className="text-gray-600">No milestones yet</p>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone, index) => {
                const grant = grants.find(g => g._id === milestone.grantId);
                return (
                  <div key={`${milestone._id}-all-${index}`} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">Milestone #{milestone.milestoneId}</h4>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{milestone.amount} ALGO</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          milestone.paid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {milestone.paid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Approvals: {milestone.approvals}
                      {grant && ` / ${grant.requiredVotes}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
