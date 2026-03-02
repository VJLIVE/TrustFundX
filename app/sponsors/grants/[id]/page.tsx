'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { initVoter, initMilestone, fundContract } from '@/lib/contractMethods';

export default function GrantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { peraWallet, accountAddress } = useWallet();
  const [grant, setGrant] = useState<any>(null);
  const [voters, setVoters] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Add voter form
  const [voterAddress, setVoterAddress] = useState('');
  const [voterName, setVoterName] = useState('');
  
  // Add milestone form
  const [milestoneAmount, setMilestoneAmount] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  
  // Fund form
  const [fundAmount, setFundAmount] = useState('');

  useEffect(() => {
    fetchGrantDetails();
  }, [params.id]);

  const fetchGrantDetails = async () => {
    try {
      const [grantsRes, votersRes, milestonesRes] = await Promise.all([
        fetch(`/api/grants?_id=${params.id}`),
        fetch(`/api/voters?grantId=${params.id}`),
        fetch(`/api/milestones?grantId=${params.id}`)
      ]);

      const grantsData = await grantsRes.json();
      const votersData = await votersRes.json();
      const milestonesData = await milestonesRes.json();

      if (grantsData.grants && grantsData.grants.length > 0) {
        setGrant(grantsData.grants[0]);
      }
      setVoters(votersData.voters || []);
      setMilestones(milestonesData.milestones || []);
    } catch (err) {
      console.error('Failed to fetch grant details:', err);
    }
  };

  const handleAddVoter = async () => {
    if (!peraWallet || !accountAddress || !voterAddress) return;

    try {
      setLoading(true);
      setError('');

      // Initialize voter on blockchain
      const txid = await initVoter(peraWallet, accountAddress, voterAddress);

      // Store in database
      await fetch('/api/voters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantId: params.id,
          voterAddress,
          voterName,
        }),
      });

      alert(`Voter added! TX: ${txid}`);
      setVoterAddress('');
      setVoterName('');
      fetchGrantDetails();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!peraWallet || !accountAddress || !milestoneAmount) return;

    try {
      setLoading(true);
      setError('');

      const milestoneId = milestones.length;
      const amountInMicroAlgos = parseFloat(milestoneAmount) * 1000000;

      // Initialize milestone on blockchain
      const txid = await initMilestone(
        peraWallet,
        accountAddress,
        milestoneId,
        amountInMicroAlgos
      );

      // Store in database
      await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantId: params.id,
          milestoneId,
          amount: parseFloat(milestoneAmount),
          description: milestoneDesc,
        }),
      });

      alert(`Milestone created! TX: ${txid}`);
      setMilestoneAmount('');
      setMilestoneDesc('');
      fetchGrantDetails();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFundContract = async () => {
    if (!peraWallet || !accountAddress || !fundAmount) return;

    try {
      setLoading(true);
      setError('');

      const amountInMicroAlgos = parseFloat(fundAmount) * 1000000;
      const txid = await fundContract(peraWallet, accountAddress, amountInMicroAlgos);

      // Update the grant's total funded amount in database
      await fetch('/api/grants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantId: params.id,
          totalFunded: parseFloat(fundAmount),
        }),
      });

      alert(`Contract funded with ${fundAmount} ALGO! TX: ${txid}`);
      setFundAmount('');
      fetchGrantDetails();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!grant) return <div className="p-8 text-gray-800">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/sponsors')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-xl font-bold text-gray-800">Grant Details</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Grant Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Grant Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Team Address</p>
              <p className="font-mono text-sm text-gray-800">{grant.teamAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium text-gray-800">{grant.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Required Votes</p>
              <p className="font-medium text-gray-800">{grant.requiredVotes}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Milestone Count</p>
              <p className="font-medium text-gray-800">{grant.milestoneCount}</p>
            </div>
          </div>
        </div>

        {/* Fund Contract */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Fund Contract</h3>
          <div className="flex gap-4">
            <input
              type="number"
              step="0.1"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              placeholder="Amount in ALGO"
              className="flex-1 px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleFundContract}
              disabled={loading || !fundAmount}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              Fund
            </button>
          </div>
        </div>

        {/* Add Voter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Add Voter</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              placeholder="Voter Name"
              className="w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400"
            />
            <input
              type="text"
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              placeholder="Voter Wallet Address"
              className="w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleAddVoter}
              disabled={loading || !voterAddress}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add Voter
            </button>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">Registered Voters ({voters.length})</h4>
            <div className="space-y-2">
              {voters.map((voter) => (
                <div key={voter._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-800">{voter.voterName || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600 font-mono">{voter.voterAddress}</p>
                  </div>
                  <span className="text-sm text-green-600">{voter.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Milestone */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Add Milestone</h3>
          <div className="space-y-4">
            <input
              type="number"
              step="0.1"
              value={milestoneAmount}
              onChange={(e) => setMilestoneAmount(e.target.value)}
              placeholder="Amount in ALGO"
              className="w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400"
            />
            <textarea
              value={milestoneDesc}
              onChange={(e) => setMilestoneDesc(e.target.value)}
              placeholder="Milestone Description"
              className="w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400"
              rows={3}
            />
            <button
              onClick={handleAddMilestone}
              disabled={loading || !milestoneAmount}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
            >
              Create Milestone
            </button>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">Milestones ({milestones.length})</h4>
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div key={milestone._id} className="p-4 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">Milestone #{milestone.milestoneId}</p>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">{milestone.amount} ALGO</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-800">Approvals: {milestone.approvals}</span>
                    <span className={milestone.paid ? 'text-green-600' : 'text-gray-600'}>
                      {milestone.paid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
