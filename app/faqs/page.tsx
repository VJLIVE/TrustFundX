'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ChevronDown,
  Search,
  ArrowRight,
  HelpCircle,
  Shield,
  Zap,
  Users,
  CreditCard,
  Lock,
  FileText,
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
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-black text-white w-7 h-7 flex items-center justify-center font-bold text-lg rounded-sm transform -rotate-6">
            X
          </div>
          <span className="font-semibold text-2xl tracking-tight text-black ml-2 -mt-1">TrustFundX</span>
        </Link>
        <div className="h-8 w-[1px] bg-gray-300 mx-2" />
        <div className="hidden md:flex gap-8 text-[15px] font-medium text-gray-800">
          <Link href="/how-it-works" className="hover:text-black transition-colors">How It Works</Link>
          <Link href="/sponsors-info" className="hover:text-black transition-colors">Sponsors</Link>
          <Link href="/governance" className="hover:text-black transition-colors">Governance</Link>
          <Link href="/faqs" className="text-blue-600 transition-colors">FAQs</Link>
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

interface FAQItemProps {
  question: string;
  answer: string;
  icon: any;
  category: string;
}

const FAQItem = ({ question, answer, icon: Icon, category }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-start gap-4 hover:bg-gray-50 transition-colors"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-blue-600 mb-1">{category}</div>
              <h3 className="text-lg font-semibold text-slate-900">{question}</h3>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ChevronDown size={24} className="text-gray-400" />
            </motion.div>
          </div>
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-20">
              <p className="text-slate-600 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CategoryCard = ({ title, icon: Icon, count, color }: { title: string, icon: any, count: number, color: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-6 rounded-xl ${color} text-white shadow-lg cursor-pointer`}
  >
    <Icon size={32} className="mb-3 opacity-90" strokeWidth={2} />
    <h3 className="text-xl font-semibold mb-1">{title}</h3>
    <p className="text-sm opacity-90">{count} questions</p>
  </motion.div>
);

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      icon: HelpCircle,
      question: 'What is TrustFundX?',
      answer: 'TrustFundX is a blockchain-based grant management platform built on Algorand. It enables transparent, milestone-based funding for student projects with DAO-style governance. Sponsors fund projects, students complete milestones, and community voters approve each phase before funds are released.'
    },
    {
      category: 'Getting Started',
      icon: Wallet,
      question: 'How do I get started with TrustFundX?',
      answer: 'First, download the Pera Wallet app on your mobile device. Then visit the TrustFundX signup page, select your role (student, sponsor, or voter), and scan the QR code with Pera Wallet to connect. Your wallet address becomes your login—no passwords needed!'
    },
    {
      category: 'Getting Started',
      icon: Users,
      question: 'What are the different user roles?',
      answer: 'TrustFundX has three roles: (1) Students receive grants and complete milestones, (2) Sponsors create and fund grants for projects, and (3) Voters review milestone submissions and approve payments. Each role has a customized dashboard for their specific needs.'
    },
    {
      category: 'Wallet & Security',
      icon: Shield,
      question: 'Is my wallet secure?',
      answer: 'Absolutely. TrustFundX uses Pera Wallet, a trusted Algorand wallet with industry-standard encryption. We never store your private keys—all transactions are signed directly in your wallet app. Your funds remain under your complete control at all times.'
    },
    {
      category: 'Wallet & Security',
      icon: Lock,
      question: 'What blockchain does TrustFundX use?',
      answer: 'TrustFundX is built on Algorand, a carbon-negative, high-speed blockchain known for low fees and instant finality. We use Algorand\'s Testnet for development and demos, with mainnet deployment for production use.'
    },
    {
      category: 'Wallet & Security',
      icon: CreditCard,
      question: 'Do I need ALGO tokens to use TrustFundX?',
      answer: 'Students and voters need minimal ALGO for transaction fees (usually <0.01 ALGO per transaction). Sponsors need ALGO to fund grants. For testing, you can get free test ALGO from the Algorand Testnet Dispenser at bank.testnet.algorand.network.'
    },
    {
      category: 'Grants & Funding',
      icon: FileText,
      question: 'How do sponsors create a grant?',
      answer: 'Sponsors connect their wallet, navigate to "Create Grant," enter the student\'s wallet address, set the number of milestones (e.g., 5), and specify required votes per milestone (e.g., 3). After signing the transaction, they fund the grant\'s smart contract with ALGO tokens.'
    },
    {
      category: 'Grants & Funding',
      icon: Zap,
      question: 'When are funds released to students?',
      answer: 'Funds are released automatically when a milestone receives the required number of voter approvals. The smart contract executes instantly once the approval threshold is met—no manual processing or delays. Students receive funds directly to their wallet.'
    },
    {
      category: 'Grants & Funding',
      icon: Shield,
      question: 'What happens if a milestone is not approved?',
      answer: 'If a milestone doesn\'t receive enough approvals, funds remain locked in the smart contract. The student can resubmit improved work, or the sponsor can work with the student to address issues. Funds are never at risk of being lost or stolen.'
    },
    {
      category: 'Voting & Governance',
      icon: Users,
      question: 'Who can be a voter?',
      answer: 'Voters are trusted community members registered by sponsors when creating grants. They might be professors, industry experts, mentors, or other stakeholders. Voters need a Pera Wallet and must be added to the grant during creation.'
    },
    {
      category: 'Voting & Governance',
      icon: Lock,
      question: 'Can voters vote multiple times?',
      answer: 'No. Smart contracts prevent double-voting. Each wallet address can only vote once per milestone. This is enforced at the blockchain level—attempts to vote twice will fail automatically.'
    },
    {
      category: 'Voting & Governance',
      icon: FileText,
      question: 'What do voters review before approving?',
      answer: 'Voters see the student\'s submission note and any uploaded files (PDFs, images, documents). They evaluate whether the milestone deliverables meet the project requirements before casting their blockchain vote.'
    },
    {
      category: 'Technical',
      icon: Shield,
      question: 'How does the smart contract work?',
      answer: 'The smart contract is written in TEAL (Transaction Execution Approval Language) and deployed on Algorand. It manages grant creation, fund storage, milestone tracking, vote counting, and automatic fund release. All logic is transparent and verifiable on-chain.'
    },
    {
      category: 'Technical',
      icon: Zap,
      question: 'Are transactions instant?',
      answer: 'Yes! Algorand has ~4.5 second block times and instant finality. When you vote or receive funds, the transaction is confirmed in seconds and cannot be reversed. No waiting for confirmations like other blockchains.'
    },
    {
      category: 'Technical',
      icon: HelpCircle,
      question: 'What happens if I lose my wallet?',
      answer: 'If you lose access to your Pera Wallet, you\'ll need your recovery phrase (seed phrase) to restore it. TrustFundX cannot recover your wallet—we never have access to your private keys. Always backup your recovery phrase securely!'
    },
    {
      category: 'Features',
      icon: FileText,
      question: 'Can I upload files with milestone submissions?',
      answer: 'Yes! Students can upload proof-of-work files (PDFs, images, code, etc.) via Filestack integration. Files are stored securely and voters can review them before approving. This feature requires the NEXT_PUBLIC_FILESTACK_API_KEY environment variable.'
    },
    {
      category: 'Features',
      icon: Users,
      question: 'Can I track multiple grants?',
      answer: 'Absolutely. Students can have multiple grants from different sponsors. Sponsors can create and track multiple grants simultaneously. The dashboard shows all your active grants with real-time status updates.'
    },
    {
      category: 'Features',
      icon: Shield,
      question: 'Is my data private?',
      answer: 'Wallet addresses and transaction data are public on the blockchain (that\'s what makes it transparent). However, personal information like your name and email is stored in our private database and never shared without permission.'
    }
  ];

  const filteredFAQs = searchQuery
    ? faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const categories = [
    { title: 'Getting Started', icon: HelpCircle, count: 3, color: 'bg-gradient-to-br from-blue-600 to-blue-700' },
    { title: 'Wallet & Security', icon: Shield, count: 3, color: 'bg-gradient-to-br from-purple-600 to-purple-700' },
    { title: 'Grants & Funding', icon: CreditCard, count: 3, color: 'bg-gradient-to-br from-green-600 to-green-700' },
    { title: 'Voting & Governance', icon: Users, count: 3, color: 'bg-gradient-to-br from-orange-600 to-orange-700' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 selection:bg-blue-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            Help Center
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1C1E] tracking-tight mb-6">
            Frequently Asked<br />Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about TrustFundX, blockchain grants, and transparent funding.
          </p>
        </motion.section>

        {/* Search Bar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
            />
          </div>
          {searchQuery && (
            <p className="text-center text-sm text-gray-600 mt-3">
              Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
            </p>
          )}
        </motion.section>

        {/* Category Cards */}
        {!searchQuery && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, idx) => (
                <CategoryCard key={idx} {...cat} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ List */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, idx) => (
                <FAQItem key={idx} {...faq} />
              ))
            ) : (
              <div className="text-center py-16">
                <HelpCircle size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No questions found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <motion.section
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <HelpCircle size={64} className="text-white/80 mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="text-4xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our community is here to help.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <button className="bg-white text-blue-600 text-[15px] font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2">
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
