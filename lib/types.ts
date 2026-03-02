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
