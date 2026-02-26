"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  Cpu,
  Activity,
  Globe,
  Lock,
  Terminal,
  Coins,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, SectionTitle, Header } from '@/lib/shared-ui';

// --- Landing Sections ---

const VisionSection = () => (
  <section id="vision" className="py-24">
    <SectionTitle subtitle="The Mission">Revolutionizing AI Incentives</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
          <Lock className="text-purple-500 w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold mb-4">The Problem: AI Silos</h3>
        <p className="text-white/50 leading-relaxed">
          Current AI infrastructure is controlled by centralized gates. Payments require credit cards,
          Middle-men take 30% fees, and machine-to-machine commerce is blocked by KYC and slow legacy settlements.
        </p>
      </Card>
      <Card>
        <div className="w-12 h-12 rounded-2xl bg-bch/10 flex items-center justify-center mb-6">
          <Zap className="text-bch w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold mb-4">The Solution: CashApi</h3>
        <p className="text-white/50 leading-relaxed">
          CashApi leverages Bitcoin Cash to create a 0-conf, sub-penny payment layer for autonomous agents.
          We enable a Sovereign AI Economy where software buys services from other software instantly and permissionlessly.
        </p>
      </Card>
    </div>
  </section>
);

const ProtocolSection = () => {
  const steps = [
    { title: 'Discovery', desc: 'Agent finds /.well-known/402.json of the service.', icon: Globe },
    { title: 'Security', desc: 'E2EE handshake using Payer\'s public key (ECIES).', icon: ShieldCheck },
    { title: 'Settlement', desc: 'One-off payment or time-locked Rental Lease.', icon: Coins },
    { title: 'Fulfillment', desc: 'Private delivery of encrypted AI data.', icon: Lock },
  ];

  return (
    <section id="protocol" className="py-24">
      <SectionTitle subtitle="Deep Dive">The x402 Lifecycle</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <Card key={i} className="p-6">
            <step.icon className="w-6 h-6 text-bch mb-4" />
            <h4 className="font-bold mb-2">{step.title}</h4>
            <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

const UseCasesSection = () => {
  const cases = [
    { title: 'Pay-Per-Query AI', desc: 'Monetize every LLM inference instantly with sub-penny BCH settlements.', icon: Cpu },
    { title: 'Autonomous Data Markets', desc: 'Enable agents to buy and sell datasets trustlessly using 0-conf transactions.', icon: Globe },
    { title: 'Resource Rental Leases', desc: 'Rent GPU or compute power with time-locked covenants and automated refills.', icon: Zap },
    { title: 'Cross-Agent Arbitrage', desc: 'High-frequency machine-to-machine commerce with zero middle-man fees.', icon: Activity },
  ];

  return (
    <section id="use-cases" className="py-24 border-t border-white/5">
      <SectionTitle subtitle="Applied Strategy">Economic Ecosystems</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cases.map((item, i) => (
          <div key={i} className="terminal-card group hover:border-bch/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-bch/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <item.icon className="w-5 h-5 text-bch" />
            </div>
            <h4 className="font-bold text-white mb-3">{item.title}</h4>
            <p className="text-[11px] text-white/40 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const EvolutionSection = () => {
  // ... (rest of evolution section remains same)
  const versions = [
    { v: 'v1', title: 'Simple Vault', tech: 'x402-bch Standard', desc: 'Initial alignment with standard Payment-Required headers.', icon: ShieldCheck, color: 'text-white/40' },
    { v: 'v2', title: 'Trust Layer', tech: 'Covenants & Escrow', desc: 'CashScript Covenants to enforce destination trustlessly.', icon: Lock, color: 'text-white/40' },
    { v: 'v3', title: 'Security Design', tech: 'E2EE & Rentals', desc: 'Encrypted inference delivery and computational leases.', icon: ShieldCheck, color: 'text-bch' },
    { v: 'v4', title: 'Agent Economy', tech: 'Reputation & Longevity', desc: 'Self-funding gas tanks and reputation-based pricing.', icon: Zap, color: 'text-cyber' }
  ];

  return (
    <section id="evolution" className="py-24 border-t border-white/5">
      <SectionTitle subtitle="Technical Journey">Protocol Evolution</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {versions.map((ver, i) => (
          <Card key={i} className="flex flex-col items-start">
            <span className={cn("text-[8px] font-black uppercase tracking-widest mb-4 px-2 py-1 rounded bg-white/5", ver.color)}>
              {ver.v} Release
            </span>
            <ver.icon className={cn("w-8 h-8 mb-6", ver.color)} />
            <h3 className="text-xl font-bold mb-2">{ver.title}</h3>
            <p className="text-xs text-white/40 leading-relaxed">{ver.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

const TechnicalArchSection = () => (
  <section id="architecture" className="py-24 border-t border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <SectionTitle subtitle="Technical Spec">Protocol Architecture</SectionTitle>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      <div className="terminal-card bg-black/40">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <Terminal className="w-4 h-4 text-bch" />
          <span className="text-[10px] font-black uppercase tracking-widest text-bch">OP_CODE Handshake</span>
        </div>
        <div className="space-y-4 font-mono text-[10px]">
          <div className="p-3 bg-black/60 rounded border border-white/5">
            <div className="text-white/20 mb-1">// Initialization</div>
            <div className="text-bch">OP_HASH256 OP_PUSH_DATA(32)</div>
            <div className="text-bch">OP_EQUALVERIFY OP_CHECKSIG</div>
          </div>
          <p className="text-white/40 leading-relaxed italic">
            Covenants enforce that agents can only spend to addresses verified by the /.well-known/402.json discovery manifest.
          </p>
        </div>
      </div>

      <div className="terminal-card bg-black/40">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <ShieldCheck className="w-4 h-4 text-cyber" />
          <span className="text-[10px] font-black uppercase tracking-widest text-cyber">ECIES Encryption</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-white/40">Curve</span>
            <span className="text-white uppercase">secp256k1</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-white/40">Cipher</span>
            <span className="text-white uppercase">AES-256-GCM</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-white/40">KDF</span>
            <span className="text-white uppercase">PBKDF2-HMAC-SHA256</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-1/2 h-full bg-cyber shadow-glow shadow-cyber/50"
            />
          </div>
        </div>
      </div>

      <div className="terminal-card bg-black/40">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <Activity className="w-4 h-4 text-purple-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">M2M Telemetry</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[16px] font-black text-white">0-Conf</div>
            <div className="text-[8px] text-white/20 uppercase font-black">Settlement</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[16px] font-black text-white">402.js</div>
            <div className="text-[8px] text-white/20 uppercase font-black">Standard</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-bch/5 rounded-xl border border-bch/10">
          <div className="text-[8px] text-bch font-black uppercase mb-1">Covenant Output 2 (Longevity)</div>
          <div className="text-[10px] text-bch/60 font-mono italic">split(fee, 0.20) -&gt; GAS_TANK</div>
        </div>
      </div>
    </div>
  </section>
);

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const stats = [
    "NETWORK_STATUS: CHIPNET_ACTIVE",
    "TOTAL_AGENTS: 4,029 ONLINE",
    "LAST_HANDSHAKE: 0.04s AGO",
    "PROTOCOL_VERSION: x402-v2.1",
    "GLOBAL_LIQUIDITY: 142.8 BCH"
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTickerIndex(i => (i + 1) % stats.length), 3000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-mesh selection:bg-bch/30 font-sans relative">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="scanline" />
      <Header />

      {/* Ticker */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-y border-white/5 h-8 flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-8 flex items-center gap-8 overflow-hidden">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-bch animate-pulse" />
            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Live Pulse:</span>
          </div>
          <motion.div
            key={tickerIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-[9px] font-mono text-bch uppercase"
          >
            {stats[tickerIndex]}
          </motion.div>
        </div>
      </div>

      <main className="pt-48 px-8 max-w-7xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border-white/10 text-bch text-[10px] font-black uppercase tracking-[0.3em] bg-bch/5">
            <Zap className="w-3 h-3 fill-bch" /> x402-v2 Protocol Active
          </div>
          <h1 className="text-7xl md:text-[140px] font-black tracking-tighter leading-[0.85] text-white">
            THE AGENTIC <br /> <span className="text-glow text-bch italic">ECONOMY.</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-medium">
            The first permissionless settlement layer for autonomous machine-to-machine commerce.
            Empowering agents to discover, negotiate, and fulfill services instantly using Bitcoin Cash.
          </p>
          <div className="flex justify-center gap-6 pt-10">
            <a href="/dashboard" className="px-10 py-5 bg-bch text-black font-black rounded-3xl hover:scale-105 transition-transform flex items-center gap-3 shadow-glow shadow-bch/20 border-b-4 border-bch-dark">
              Launch Hub <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/wallet" className="px-10 py-5 glass text-white font-black rounded-3xl border border-white/10 hover:bg-white/5 transition-all flex items-center gap-3">
              CyberVault <Wallet className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        <div className="mt-40 space-y-32">
          <VisionSection />
          <UseCasesSection />
          <TechnicalArchSection />
          <ProtocolSection />
          <EvolutionSection />
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center bg-black/40 glass">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-bch flex items-center justify-center">
              <Coins className="text-white w-3 h-3" />
            </div>
            <span className="text-lg font-black tracking-tighter text-white">Cash<span className="text-bch">Api</span></span>
          </div>
          <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em]">&copy; 2026 CashApi Protocol | BCH-1 Hackcelerator | High-Frequency AI Commerce</p>
          <a href="/middleware" className="text-[8px] font-bold text-white/5 uppercase tracking-[0.4em] hover:text-bch/20 transition-colors">Protocol Specs</a>
        </div>
      </footer>
    </div>
  );
}
