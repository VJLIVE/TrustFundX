'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  Shield,
  BarChart3,
  Bell,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  FileText,
  Lock,
  Eye,
  Users,
  Award,
  Activity
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const Navbar = () => {
  const { accountAddress, isConnected } = useWallet();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      if (accountAddress && isConnected) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: accountAddress }),
          });
          const data = await res.json();
          if (res.ok && data.user) setUserRole(data.user.role);
        } catch (err) {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, [accountAddress, isConnected]);

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-transparent sticky top-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-black text-white w-7 h-7 flex items-center justify-center font-bold text-lg rounded-sm transform -rotate-6">
            X
          </div>
          <span className="font-semibold text-2xl tracking-tight text-black ml-2 -mt-1">TrustFundX</span>
        </Link>
        <div className="h-8 w-[1px] bg-gray-300 mx-2" />
        <div className="hidden md:flex gap-8 text-[15px] font-medium text-gray-800">
          <Link href="/how-it-works" className="hover:text-black transition-colors">How It Works</Link>
          <Link href="/sponsors-info" className="text-blue-600 transition-colors">Sponsors</Link>
          <Link href="/governance" className="hover:text-black transition-colors">Governance</Link>
          <Link href="/faqs" className="hover:text-black transition-colors">FAQs</Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isConnected && userRole ? (
          <Link href={`/${userRole}s`}>
            <button className="flex items-center gap-2 bg-[#214A9D] text-white text-[15px] font-medium px-5 py-2 rounded-lg hover:bg-[#1A3B81] transition-all shadow-md">
              <Activity size={18} strokeWidth={2} />
              Dashboard
            </button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <button className="text-[15px] font-medium px-5 py-2 border border-gray-200 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all text-gray-800">
                Log In
              </button>
            </Link>
            <Link href="/signup">
              <button className="flex items-center gap-2 bg-[#214A9D] text-white text-[15px] font-medium px-5 py-2 rounded-lg hover:bg-[#1A3B81] transition-all shadow-md">
                <Wallet size={18} strokeWidth={2} />
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const BenefitCard = ({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: any, color: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative p-7 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all group overflow-hidden"
  >
    <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_10%_10%,rgba(34,197,94,0.1)_0%,transparent_40%)]" />
    
    <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={26} className="text-white" strokeWidth={2} />
    </div>
    
    <h3 className="text-lg font-semibold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 text-[14px] leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

const StatCard = ({ value, label, icon: Icon }: { value: string, label: string, icon: any }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center"
  >
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white mx-auto mb-3">
      <Icon size={24} strokeWidth={2} />
    </div>
    <div className="text-3xl font-bold text-green-900 mb-1">{value}</div>
    <div className="text-sm text-green-700 font-medium">{label}</div>
  </motion.div>
);

const ProcessStep = ({ number, title, desc }: { number: number, title: string, desc: string }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-md">
      {number}
    </div>
    <div className="flex-1 pb-8">
      <h4 className="text-lg font-semibold text-slate-900 mb-2">{title}</h4>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 selection:bg-blue-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            For Sponsors & Organizations
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1C1E] tracking-tight mb-6">
            Fund Innovation,<br />Track Impact
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Empower student projects with transparent, milestone-based funding.
            See exactly how your investment drives real-world innovation.
          </p>
          <Link href="/signup">
            <button className="bg-[#22C55E] text-white text-[16px] font-semibold px-8 py-3.5 rounded-lg hover:bg-[#16A34A] transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 inline-flex items-center gap-2">
              Become a Sponsor
              <ArrowRight size={20} />
            </button>
          </Link>
        </motion.section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard value="100%" label="Transparency" icon={Eye} />
            <StatCard value="0" label="Hidden Fees" icon={Lock} />
            <StatCard value="24/7" label="Live Tracking" icon={TrendingUp} />
            <StatCard value="∞" label="Impact Potential" icon={Award} />
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Sponsor on TrustFundX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Traditional grants lack transparency. TrustFundX gives you complete visibility and control.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BenefitCard
              title="Blockchain-Verified Funding"
              desc="Every ALGO token is tracked on-chain. No middlemen, no hidden costs. See exactly where your money goes in real-time."
              icon={Shield}
              color="bg-blue-600"
            />
            
            <BenefitCard
              title="Milestone-Based Releases"
              desc="Funds are released only when students complete milestones. Your investment is protected until results are delivered."
              icon={CheckCircle}
              color="bg-green-600"
            />
            
            <BenefitCard
              title="Real-Time Analytics"
              desc="Monitor grant progress, milestone completions, and fund utilization through comprehensive dashboards."
              icon={BarChart3}
              color="bg-purple-600"
            />
            
            <BenefitCard
              title="Community Governance"
              desc="Voters review and approve milestones, ensuring quality and accountability at every step of the project."
              icon={Users}
              color="bg-orange-600"
            />
            
            <BenefitCard
              title="Instant Notifications"
              desc="Get real-time updates when milestones are submitted, approved, or achieved via your dashboard."
              icon={Bell}
              color="bg-pink-600"
            />
            
            <BenefitCard
              title="Comprehensive Reports"
              desc="Download detailed reports showing fund allocation, milestone progress, and impact metrics for stakeholders."
              icon={FileText}
              color="bg-indigo-600"
            />
          </div>
        </section>

        {/* How to Sponsor Process */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">How to Sponsor a Project</h2>
            
            <div className="max-w-2xl mx-auto">
              <ProcessStep
                number={1}
                title="Connect Your Pera Wallet"
                desc="Sign up as a sponsor and connect your Algorand wallet securely—no passwords needed."
              />
              
              <ProcessStep
                number={2}
                title="Create a Grant"
                desc="Specify the student's wallet address, define milestones (e.g., 5 phases), and set required approvals per milestone."
              />
              
              <ProcessStep
                number={3}
                title="Fund the Smart Contract"
                desc="Transfer ALGO tokens to the grant's smart contract. Funds are locked on-chain until milestones are approved."
              />
              
              <ProcessStep
                number={4}
                title="Monitor Progress"
                desc="Track student submissions, voter approvals, and automatic fund releases—all from your dashboard."
              />
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white shadow-md">
                  <CheckCircle size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Impact Achieved</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Projects completed, students empowered, innovation funded—all with complete transparency.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-12 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Start Funding Innovation Today</h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Create your first grant in minutes. Track every milestone. See your impact grow.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <button className="bg-white text-green-600 text-[15px] font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2">
                  Get Started
                  <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="border-2 border-white text-white text-[15px] font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-all">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </motion.section>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 TrustFundX. All rights reserved. | <Link href="/" className="hover:text-gray-700">Home</Link></p>
        </footer>
      </main>
    </div>
  );
}
