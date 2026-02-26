"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    Shield,
    RefreshCcw,
    ArrowRightLeft,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Activity,
    Lock,
    Cpu,
    Database,
    Fingerprint
} from 'lucide-react';
import { Card, SectionTitle, Header } from '@/lib/shared-ui';
import { Wallet as BCHWallet, TestNetWallet, DefaultProvider } from 'mainnet-js';
import { cn } from '@/lib/utils';
import { Copy, Eye, EyeOff, Import } from 'lucide-react';

export default function WalletPage() {
    const [wallet, setWallet] = useState<any>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [address, setAddress] = useState<string>('');
    const [mnemonic, setMnemonic] = useState<string>('');
    const [seedInput, setSeedInput] = useState<string>('');
    const [showSeed, setShowSeed] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);

    // Initialize custom RPC provider
    useEffect(() => {
        DefaultProvider.servers['chipnet'] = ['wss://chipnet.bch.ninja:50004'];
    }, []);

    const connectWallet = async () => {
        setLoading(true);
        try {
            const myWallet = await TestNetWallet.newRandom();
            const addr = (myWallet as any).cashaddr || (myWallet as any).address;
            const seed = (myWallet as any).mnemonic;

            setWallet(myWallet);
            setAddress(addr);
            setMnemonic(seed);

            const bal = await (myWallet as any).getBalance('sats');
            setBalance(Number(bal));
            setConnected(true);

            // Persist for Dashboard
            localStorage.setItem('cashapi_wallet_addr', addr);
            localStorage.setItem('cashapi_wallet_bal', String(bal));
            localStorage.setItem('cashapi_wallet_seed', seed);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const importWallet = async () => {
        if (!seedInput.trim()) return;
        setLoading(true);
        try {
            // mainnet-js format for chipnet: seed:testnet:mnemonic...
            const testWallet = await TestNetWallet.fromId(`seed:testnet:${seedInput.trim()}`);

            const addr = (testWallet as any).cashaddr || (testWallet as any).address;
            const seed = seedInput.trim();

            setWallet(testWallet);
            setAddress(addr);
            setMnemonic(seed);

            const bal = await (testWallet as any).getBalance('sats');
            setBalance(Number(bal));
            setConnected(true);
            setIsImporting(false);

            localStorage.setItem('cashapi_wallet_addr', addr);
            localStorage.setItem('cashapi_wallet_bal', String(bal));
            localStorage.setItem('cashapi_wallet_seed', seed);
        } catch (err) {
            console.error(err);
            alert("Failed to import wallet. Check your seed phrase.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedSeed = localStorage.getItem('cashapi_wallet_seed');

        // Guard against stale "undefined" strings from previous bug
        if (savedSeed && savedSeed !== 'undefined' && !connected) {
            const wordCount = savedSeed.trim().split(/\s+/).length;
            if (wordCount !== 12 && wordCount !== 24) {
                console.warn("Invalid seed found in storage, clearing...");
                localStorage.removeItem('cashapi_wallet_seed');
                return;
            }

            setSeedInput(savedSeed);
            // Auto-reconnect if seed exists
            const reconnect = async () => {
                try {
                    const testWallet = await TestNetWallet.fromId(`seed:testnet:${savedSeed}`);
                    const addr = (testWallet as any).cashaddr || (testWallet as any).address;
                    setWallet(testWallet);
                    setAddress(addr);
                    setMnemonic(savedSeed);
                    const bal = await (testWallet as any).getBalance('sats');
                    setBalance(Number(bal));
                    setConnected(true);
                } catch (e) {
                    console.error("Auto-reconnect failed", e);
                    localStorage.removeItem('cashapi_wallet_seed');
                }
            };
            reconnect();
        } else if (savedSeed === 'undefined') {
            localStorage.removeItem('cashapi_wallet_seed');
        }
    }, []);

    const refreshBalance = async () => {
        if (!wallet) return;
        setLoading(true);
        const bal = await (wallet as any).getBalance('sats');
        setBalance(Number(bal));
        localStorage.setItem('cashapi_wallet_bal', String(bal));
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-mesh selection:bg-bch/30 relative font-sans">
            <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
            <div className="scanline" />
            <Header />

            <div className="max-w-7xl mx-auto py-28 px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Panel: Wallet Control */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="terminal-card bg-black/40 p-12">
                            {!connected ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-[32px] bg-bch/10 flex items-center justify-center mb-8 border border-bch/20 shadow-glow shadow-bch/10">
                                        <Wallet className="w-12 h-12 text-bch" />
                                    </div>
                                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Initialize Vault</h2>
                                    <p className="text-white/40 max-w-md mb-10 leading-relaxed text-xs font-bold uppercase tracking-widest">
                                        Secure Chipnet Asset Management <br /> for Autonomous Agent Commerce
                                    </p>

                                    {isImporting ? (
                                        <div className="w-full max-w-md space-y-6">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                                                    <span>Mnemonic Input</span>
                                                    <span>BIP-39 Standard</span>
                                                </div>
                                                <textarea
                                                    value={seedInput}
                                                    onChange={(e) => setSeedInput(e.target.value)}
                                                    placeholder="Enter your 12 or 24 word mnemonic phrase..."
                                                    className="w-full bg-black/60 border border-white/5 rounded-2xl p-6 text-sm text-center font-mono focus:border-bch outline-none transition-all h-32 leading-loose tracking-tight"
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={importWallet}
                                                    className="flex-1 py-4 bg-bch text-black font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-glow shadow-bch/20"
                                                >
                                                    Secure Import
                                                </button>
                                                <button
                                                    onClick={() => setIsImporting(false)}
                                                    className="px-8 py-4 bg-white/5 text-white/40 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] border border-white/5"
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                                            <button
                                                onClick={connectWallet}
                                                disabled={loading}
                                                className="py-6 bg-bch text-black font-black rounded-2xl hover:scale-105 transition-all flex flex-col items-center gap-3 disabled:opacity-50 border-b-4 border-bch-dark shadow-glow shadow-bch/20"
                                            >
                                                {loading ? <RefreshCcw className="animate-spin w-6 h-6" /> : <Fingerprint className="w-6 h-6" />}
                                                <span className="text-[10px] uppercase tracking-[0.2em]">Generate Vault</span>
                                            </button>
                                            <button
                                                onClick={() => setIsImporting(true)}
                                                className="py-6 glass text-white font-black rounded-2xl border border-white/10 hover:bg-white/5 transition-all flex flex-col items-center gap-3"
                                            >
                                                <Import className="w-6 h-6 text-cyber" />
                                                <span className="text-[10px] uppercase tracking-[0.2em]">Import Seed</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                                        <div className="flex items-center gap-6 text-left">
                                            <div className="relative">
                                                <div className="w-20 h-20 rounded-3xl bg-cyber/10 flex items-center justify-center border border-cyber/20 shadow-glow shadow-cyber/10">
                                                    <Shield className="w-10 h-10 text-cyber" />
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-bch border-2 border-background flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">CyberVault <span className="text-cyber italic">v1</span></h3>
                                                    <div className="flex items-center gap-1.5 bg-bch/10 text-bch text-[8px] font-black px-2 py-0.5 rounded-full uppercase border border-bch/20">
                                                        Active
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-mono text-[11px] text-white/20 break-all select-all hover:text-white transition-colors cursor-pointer">{address}</p>
                                                    <button onClick={() => { navigator.clipboard.writeText(address); alert("Address copied!"); }} className="text-white/10 hover:text-white"><Copy className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={refreshBalance} className="p-4 glass rounded-2xl border-white/5 text-white/40 hover:text-bch transition-all">
                                                <RefreshCcw className={cn("w-5 h-5", loading && "animate-spin")} />
                                            </button>
                                            <a href="/dashboard" className="px-8 py-4 bg-bch text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                                                HUB <ArrowRightLeft className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="terminal-card bg-black/60 border-white/5 p-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Vault Availability</span>
                                                <Activity className="w-3 h-3 text-bch" />
                                            </div>
                                            <div className="text-5xl font-black text-white tabular-nums mb-1">{balance?.toLocaleString() || '0'}</div>
                                            <div className="text-[10px] font-black text-bch uppercase tracking-[0.3em]">CHIPNET SATS</div>

                                            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                                                <div>
                                                    <div className="text-[8px] text-white/10 font-bold uppercase mb-1">Value (BCH)</div>
                                                    <div className="text-xs font-mono text-white/60">{(balance || 0) / 100000000}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[8px] text-white/10 font-bold uppercase mb-1">Asset Status</div>
                                                    <div className="text-xs font-mono text-cyber">Verified</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="terminal-card bg-black/60 border-white/5 p-8 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-6">
                                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Seed Protection</span>
                                                    <Lock className="w-3 h-3 text-cyber" />
                                                </div>
                                                <p className="text-[10px] text-white/40 leading-relaxed uppercase font-bold tracking-widest">
                                                    Your seed phrase is stored locally. <br /> Never share it with anyone.
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setShowSeed(!showSeed)}
                                                className="w-full mt-6 py-4 border border-dashed border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-cyber hover:border-cyber/40 transition-all"
                                            >
                                                {showSeed ? 'Encrypt Access' : 'Reveal Secret Phrase'}
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {showSeed && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-8 bg-cyber/5 border border-cyber/20 rounded-3xl relative group">
                                                    <div className="absolute top-2 right-4 text-[8px] font-black text-cyber/40 uppercase tracking-widest">Master Key</div>
                                                    <p className="font-mono text-xs text-cyber font-bold leading-loose pr-12 select-all tracking-tight">{mnemonic}</p>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(mnemonic);
                                                            alert("Seed copied to clipboard!");
                                                        }}
                                                        className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-cyber/10 flex items-center justify-center text-cyber hover:bg-cyber hover:text-white transition-all shadow-glow shadow-cyber/20"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                if (confirm("Disconnect CyberVault? This will clear local session storage.")) {
                                                    localStorage.clear();
                                                    window.location.reload();
                                                }
                                            }}
                                            className="text-[9px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-[0.25em] flex items-center gap-2 transition-colors"
                                        >
                                            <AlertCircle className="w-3 h-3" />
                                            Terminate Session
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: 'M2M-Ready', desc: 'Protocol-level handshake v2.1', icon: Shield },
                                { title: 'E2EE Powered', desc: 'Standard ECIES Encryption', icon: Lock },
                                { title: 'No Gatekeepers', desc: 'Direct p2p settlements', icon: Cpu },
                            ].map((feat, i) => (
                                <div key={i} className="terminal-card bg-black/40 p-6 flex flex-col items-center text-center gap-4">
                                    <feat.icon className="w-6 h-6 text-white/20" />
                                    <div>
                                        <h4 className="font-black text-white text-[10px] uppercase tracking-widest mb-1">{feat.title}</h4>
                                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-tighter">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Technical Specs */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="terminal-card bg-black/40">
                            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
                                <Database className="w-3.5 h-3.5 text-cyber" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Ledger Telemetry</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-black/60 rounded-xl border border-white/5 font-mono text-[9px] space-y-2 relative overflow-hidden h-[300px]">
                                    <div className="scanline" />
                                    <div className="text-bch/40 select-none">// REAL-TIME MONITOR</div>
                                    <div className="text-white/40">➜ SESSION_INIT: {new Date().toISOString()}</div>
                                    <div className="text-white/40">➜ CONNECTING_TO_CHIPNET...</div>
                                    <div className="text-bch">➜ CHIPNET_HANDSHAKE: SUCCESS</div>
                                    <div className="text-white/40">➜ PROTOCOL: x402-v2_BIP145</div>
                                    <div className="text-white/40">➜ DERIVATION: m/44'/145'/0'/0/0</div>
                                    <div className="text-white/40 italic">➜ FETCHING_UTXOS...</div>
                                    <div className="text-cyber">➜ ADDR_MONITOR: ACTIVE_SECURE</div>
                                    <div className="text-white/20 animate-pulse mt-4">_</div>
                                </div>
                            </div>
                        </div>

                        <div className="terminal-card bg-black/40">
                            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                                <Shield className="w-3.5 h-3.5 text-white/40" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Security Metadata</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[9px] font-black text-black/40 uppercase bg-white/5 px-2 py-0.5 rounded">Entropy</span>
                                    <span className="text-[10px] font-mono text-white/60 tracking-tighter">256-bit</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[9px] font-black text-black/40 uppercase bg-white/5 px-2 py-0.5 rounded">Keygen</span>
                                    <span className="text-[10px] font-mono text-white/60 tracking-tighter">BIP-39 / BIP-44</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[9px] font-black text-black/40 uppercase bg-white/5 px-2 py-0.5 rounded">Enc-Standard</span>
                                    <span className="text-[10px] font-mono text-white/60 tracking-tighter">AES-256-GCM</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[9px] font-black text-black/40 uppercase bg-white/5 px-2 py-0.5 rounded">Verification</span>
                                    <span className="text-[10px] font-mono text-white/60 tracking-tighter">secp256k1</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
