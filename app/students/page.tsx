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
  const [submissionNote, setSubmissionNote] = useState<{ [key: string]: string }>({});
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [submittingMilestone, setSubmittingMilestone] = useState<string | null>(null);

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

  const handleFileUpload = async (milestoneId: string, file: File) => {
    try {
      setUploadingFile(milestoneId);
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload via our backend API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const data = await response.json();
      
      if (!data.url) {
        throw new Error('No URL returned from upload');
      }
      
      return data.url;
    } catch (error: any) {
      console.error('File upload error:', error);
      
      if (error.message.includes('Filestack API key not configured')) {
        alert('File upload is not configured.\n\nTo enable file uploads:\n1. Sign up at https://www.filestack.com/\n2. Get your API key\n3. Add it to .env.local as NEXT_PUBLIC_FILESTACK_API_KEY\n4. Restart the server');
      } else {
        alert(`Failed to upload file: ${error.message}`);
      }
      
      return null;
    } finally {
      setUploadingFile(null);
    }
  };

  const handleSubmitMilestone = async (milestone: any) => {
    try {
      setSubmittingMilestone(milestone._id);
      
      const note = submissionNote[milestone._id] || '';
      const fileInput = document.getElementById(`file-${milestone._id}`) as HTMLInputElement;
      const file = fileInput?.files?.[0];
      
      if (!note && !file) {
        alert('Please provide either a note or upload a file');
        return;
      }
      
      let fileUrl = null;
      if (file) {
        fileUrl = await handleFileUpload(milestone._id, file);
        if (!fileUrl) return; // Upload failed
      }
      
      // Update milestone with submission
      const response = await fetch('/api/milestones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneDbId: milestone._id,
          submissionNote: note,
          submissionFileUrl: fileUrl,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit milestone');
      }
      
      alert('Milestone submitted successfully!');
      setSubmissionNote({ ...submissionNote, [milestone._id]: '' });
      if (fileInput) fileInput.value = '';
      fetchGrants();
    } catch (error) {
      console.error('Submit milestone error:', error);
      alert('Failed to submit milestone');
    } finally {
      setSubmittingMilestone(null);
    }
  };

  if (!user) return null;

  const totalMilestoneAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const totalReceived = milestones.filter(m => m.paid).reduce((sum, m) => sum + (m.amount || 0), 0);
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">My Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{grants.length}</p>
            <p className="text-sm text-gray-600 mt-2">Active projects</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Funding</h3>
            <p className="text-3xl font-bold text-green-600">{totalReceived.toFixed(2)} ALGO</p>
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
                  <div className="flex justify-between items-center text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Approvals: </span>
                      <span className="font-medium text-gray-800">{milestone.approvals}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      milestone.paid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {milestone.paid ? 'Paid' : 'Pending Approval'}
                    </span>
                  </div>
                  
                  {/* Submission Section */}
                  {!milestone.paid && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-semibold text-gray-800 mb-3">Submit Proof of Completion</h5>
                      
                      {milestone.submissionNote || milestone.submissionFileUrl ? (
                        <div className="bg-blue-50 p-4 rounded-lg mb-3">
                          <p className="text-sm font-medium text-blue-800 mb-2">✓ Submitted</p>
                          {milestone.submissionNote && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-600 mb-1">Note:</p>
                              <p className="text-sm text-gray-800">{milestone.submissionNote}</p>
                            </div>
                          )}
                          {milestone.submissionFileUrl && (
                            <div>
                              <p className="text-xs text-gray-600 mb-1">File:</p>
                              <a 
                                href={milestone.submissionFileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                View Uploaded Document
                              </a>
                            </div>
                          )}
                          {milestone.submittedAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Submitted: {new Date(milestone.submittedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Notes (Optional)
                            </label>
                            <textarea
                              value={submissionNote[milestone._id] || ''}
                              onChange={(e) => setSubmissionNote({ ...submissionNote, [milestone._id]: e.target.value })}
                              placeholder="Describe what you've completed for this milestone..."
                              className="w-full px-4 py-2 border rounded-lg text-gray-800 placeholder-gray-400"
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload PDF (Optional)
                            </label>
                            <input
                              id={`file-${milestone._id}`}
                              type="file"
                              accept=".pdf"
                              className="w-full px-4 py-2 border rounded-lg text-gray-800"
                              disabled={uploadingFile === milestone._id || submittingMilestone === milestone._id}
                            />
                          </div>
                          
                          <button
                            onClick={() => handleSubmitMilestone(milestone)}
                            disabled={uploadingFile === milestone._id || submittingMilestone === milestone._id}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                          >
                            {uploadingFile === milestone._id ? 'Uploading...' : 
                             submittingMilestone === milestone._id ? 'Submitting...' : 
                             'Submit Proof'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
