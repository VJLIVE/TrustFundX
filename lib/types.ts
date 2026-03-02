export type UserRole = 'student' | 'sponsor' | 'voter';

export interface User {
  _id?: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  walletAddress: string;
  createdAt?: Date;
}

export interface Grant {
  _id?: string;
  sponsorAddress: string;
  teamAddress: string;
  requiredVotes: number;
  milestoneCount: number;
  appId: number;
  txId: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt?: Date;
}

export interface Milestone {
  _id?: string;
  grantId: string;
  milestoneId: number;
  amount: number;
  approvals: number;
  paid: boolean;
  createdAt?: Date;
}
