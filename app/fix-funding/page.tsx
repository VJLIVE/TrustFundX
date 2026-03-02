'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FixFundingPage() {
  const router = useRouter();
  const [grantId, setGrantId] = useState('');
  const [fundedAmount, setFundedAmount] = useState('10');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFix = async () => {
    if (!grantId || !fundedAmount) {
      setError('Please enter both Grant ID and funded amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await fetch('/api/fix-grant-funding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantId,
          fundedAmount: parseFloat(fundedAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update grant');
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push('/sponsors');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Fix Grant Funding</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grant ID
            </label>
            <input
              type="text"
              value={grantId}
              onChange={(e) => setGrantId(e.target.value)}
              placeholder="Enter Grant ID (e.g., 507f1f77bcf86cd799439011)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can find this in the URL when viewing a grant or in the grant list
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Funded Amount (ALGO)
            </label>
            <input
              type="number"
              step="0.1"
              value={fundedAmount}
              onChange={(e) => setFundedAmount(e.target.value)}
              placeholder="Enter amount in ALGO"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the total amount you've funded to this grant (e.g., 10)
            </p>
          </div>

          <button
            onClick={handleFix}
            disabled={loading || !grantId || !fundedAmount}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Updating...' : 'Update Grant Funding'}
          </button>

          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              {message}
              <br />
              <span className="text-xs">Redirecting to dashboard...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={() => router.push('/sponsors')}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a one-time fix for existing grants that were funded before the tracking system was implemented. After running this, all future funding will be tracked automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
