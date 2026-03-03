'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Users,
  CircleDollarSign,
  Vote,
  ArrowRight,
  Wallet,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import architectureImage from '../assests/unnamed.jpg';

// --- Blockchain Network Data ---
const nodes = [
  // Left side
  [5, 10], [20, 15], [35, 20], [10, 35], [25, 45],
  [5, 60], [20, 75], [35, 85], [15, 95],
  // Right side
  [65, 10], [80, 20], [95, 15], [75, 35], [90, 45],
  [65, 60], [80, 75], [95, 85], [70, 95]
];

const lines = [
  // Left side connections
  [5, 10, 20, 15], [20, 15, 35, 20], [5, 10, 10, 35],
  [20, 15, 25, 45], [35, 20, 25, 45], [10, 35, 25, 45],
  [10, 35, 5, 60], [25, 45, 20, 75], [5, 60, 20, 75],
  [20, 75, 35, 85], [5, 60, 15, 95], [20, 75, 15, 95],
  // Right side connections
  [65, 10, 80, 20], [80, 20, 95, 15], [65, 10, 75, 35],
  [80, 20, 90, 45], [80, 20, 75, 35], [75, 35, 90, 45],
  [75, 35, 65, 60], [90, 45, 80, 75], [65, 60, 80, 75],
  [80, 75, 95, 85], [65, 60, 70, 95], [80, 75, 70, 95],
  [90, 45, 95, 85]
];

// --- Packet Animation Hook ---
const usePackets = () =>
  useMemo(
    () =>
      lines.map(([x1, y1, x2, y2]) => ({
        x1,
        y1,
        x2,
        y2,
        speed: 2 + Math.random() * 2,
        delay: Math.random() * 4,
      })),
    []
  );

// --- Components ---

const AnimatedBackground = () => {
  const packets = usePackets();

  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden flex justify-center items-center mt-[-80px]">
      <svg
        className="w-[120%] h-[120%] max-w-[1600px] min-w-[1200px]"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Lines */}
        <g stroke="#CBD5E1" strokeWidth="0.1">
          {lines.map(([x1, y1, x2, y2], idx) => (
            <motion.line
              key={`line-${idx}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: idx * 0.02 }}
            />
          ))}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map(([cx, cy], idx) => (
            <motion.g
              key={`node-${idx}`}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            >
              {/* Scale down the logo slightly so we can position it using cx,cy */}
              <g transform={`translate(${cx}, ${cy}) scale(0.1)`}>
                {/* Hexagon Border */}
                <polygon
                  points="0,-18 15.58,-9 15.58,9 0,18 -15.58,9 -15.58,-9"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Exact TrustFundX Logo */}
                <g transform="translate(-12, -12)">
                  <path
                    d="M13.874 0h3.673l1.61 5.963h3.789l-2.588 4.5 3.624 13.533h-3.757l-2.44-9.077-5.247 9.079H8.345l8.107-14.051-1.304-4.878L4.215 24H.018Z"
                    fill="#9CA3AF"
                  />
                </g>
              </g>
            </motion.g>
          ))}
        </g>

        {/* Packets */}
        <g>
          {packets.map((packet, idx) => (
            <motion.circle
              key={`packet-${idx}`}
              r="0.3"
              fill="#1C4186"
              animate={{
                cx: [packet.x1, packet.x2],
                cy: [packet.y1, packet.y2],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: packet.speed,
                delay: packet.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-3 bg-transparent sticky top-0 z-50">
    <div className="flex items-center gap-12">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          {/* Logo Replacement: A simple stylish X representing TrustFundX */}
          <div className="bg-black text-white w-7 h-7 flex items-center justify-center font-bold text-lg rounded-sm transform -rotate-6">
            X
          </div>
          <span className="font-semibold text-2xl tracking-tight text-black ml-2 -mt-1">TrustFundX</span>
        </div>
        <div className="h-8 w-[1px] bg-gray-300 mx-2" />
      </div>
      <div className="hidden md:flex gap-8 text-[15px] font-medium text-gray-800">
        <a href="#" className="hover:text-black transition-colors">How It Works</a>
        <a href="#" className="hover:text-black transition-colors">Sponsors</a>
        <a href="#" className="hover:text-black transition-colors">Governance</a>
        <a href="#" className="hover:text-black transition-colors">FAQs</a>
      </div>
    </div>
    <div className="flex items-center gap-3">
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
    </div>
  </nav>
);

const FeatureCard = ({ title, desc, icon: Icon, color, iconColor }: { title: string, desc: string, icon: any, color: string, iconColor: string }) => {
  // Map our border/bg colors to specific hexes for the glow effect
  const glowMap: Record<string, string> = {
    'bg-slate-400': 'rgba(148, 163, 184, 0.15)',
    'bg-[#22C55E]': 'rgba(34, 197, 94, 0.15)',
    'bg-blue-600': 'rgba(37, 99, 235, 0.15)'
  };
  const glowColor = glowMap[color] || 'rgba(0,0,0,0.05)';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative p-7 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all group overflow-hidden"
    >
      {/* Decorative radial gradient glow effect on Hover */}
      <div
        className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 10% 10%, ${glowColor} 0%, transparent 40%)`
        }}
      />

      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="w-[56px] h-[56px] flex flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} className={iconColor} strokeWidth={1.2} />
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 mt-2">
          <span className="relative flex h-[7px] w-[7px]">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`}></span>
            <span className={`relative inline-flex rounded-full h-[7px] w-[7px] ${color}`}></span>
          </span>
          Live
        </div>
      </div>
      <h3 className="text-[17px] font-semibold text-slate-900 mb-2 relative z-10">{title}</h3>
      <p className="text-slate-500 text-[14px] leading-relaxed relative z-10 w-full md:w-5/6">
        {desc}
      </p>
    </motion.div>
  );
};

export default function TrustFundX() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 selection:bg-blue-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-8 relative">
        <AnimatedBackground />

        {/* Hero Section */}
        <section className="text-center mb-8 relative mt-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-[#1A1C1E] tracking-tight mb-6"
          >
            Transparent Grant & Fund Tracking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            A blockchain-based system using TrustFundX to ensure transparent, milestone-based
            allocation and utilization of student project funds.
          </motion.p>
        </section>

        {/* Feature Grid */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <FeatureCard
            title="For Students"
            desc="Submit projects, track milestones, and receive funding transparently"
            icon={Users}
            color="bg-slate-400"
            iconColor="text-slate-400"
          />
          <FeatureCard
            title="For Sponsors"
            desc="Fund projects with confidence and track fund utilization in real-time"
            icon={CircleDollarSign}
            color="bg-[#22C55E]"
            iconColor="text-[#22C55E]"
          />
          <FeatureCard
            title="For Voters"
            desc="Participate in DAO-style governance and approve milestone completions"
            icon={Vote}
            color="bg-blue-600"
            iconColor="text-blue-600"
          />
        </section>

        {/* Bottom Banner Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group overflow-hidden rounded-2xl bg-[#E2E6ED] p-8 md:p-11 shadow-sm hover:shadow-[0_8px_40px_rgba(28,65,134,0.12)] mx-4 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 hover:-translate-y-1 border border-transparent hover:border-[#CBD5E1]/50"
        >
          {/* Decorative radial gradient glow effect on Hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_30%_50%,rgba(28,65,134,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex-1 max-w-md relative z-10">
            <span className="text-gray-500 text-[14px] font-normal mb-2 block group-hover:text-blue-600 transition-colors duration-300">TrustFundX Advantage</span>
            <h2 className="text-[32px] md:text-[36px] leading-tight font-bold text-[#1A1C1E] mb-4 tracking-tight">Built on TrustFundX<br />Blockchain</h2>
            <p className="text-[#334155] text-[15px] leading-relaxed mb-8 pr-4">
              Leveraging smart contracts for milestone-based fund disbursement,
              ensuring and transparency in grant management.
            </p>
            <button className="bg-[#1C4186] text-white text-[14px] font-semibold px-6 py-2.5 rounded shadow-sm hover:bg-[#15326A] hover:shadow-[0_0_20px_rgba(28,65,134,0.4)] hover:scale-105 active:scale-95 transition-all duration-300">
              Get Started
            </button>
          </div>

          {/* Diagram Representation */}
          <div className="flex-1 flex justify-end w-full md:w-auto h-[200px] md:h-[260px] relative z-10 transition-transform duration-500 group-hover:scale-105">
            <img
              src={architectureImage.src}
              alt="TrustFundX Architecture Diagram"
              className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </motion.section>

        <footer className="mt-8 text-center text-gray-500 text-[13px]">
          <p>© 2024 TrustFundX. All rights reserved. | Terms | Privacy</p>
        </footer>
      </main>
    </div>
  );
}
