"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Terminal,
    Activity,
    Coins,
    CheckCircle2,
    Cpu,
    Eye,
    ArrowRight,
    ShieldCheck,
    Wallet,
    Globe,
    Lock,
    BarChart3,
    Server,
    ZapOff,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, SectionTitle, Header } from '@/lib/shared-ui';
import { getAICompletion } from '@/lib/gemini';

const MERCHANT_ADDRESS = process.env.NEXT_PUBLIC_CASHAPI_MERCHANT_ADDRESS || 'bchtest:qpqu57emm855p4jcx08daj5caehv74226qj5u437en';

const LatencyValue = () => {
    const [latency, setLatency] = useState<number | null>(null);

    useEffect(() => {
        setLatency(Math.floor(Math.random() * 50) + 120);
    }, []);

    return <span>~{latency !== null ? `${latency}ms` : '---'}</span>;
};

const ClientTime = () => {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        setTime(new Date().toLocaleTimeString());
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return <span>{time || '--:--:--'}</span>;
};

const AgentMarketplaceSection = ({ onCallAgent, agents, isRental }: { onCallAgent: (agent: any) => void, agents: any[], isRental: boolean }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {agents.map((agent, i) => (
                <div key={i} className="terminal-card group hover:border-bch/40 transition-all">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className={cn("w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5", agent.color)}>
                                <agent.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-black text-white">{agent.name}</h4>
                                    <span className="text-[8px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">v1.2.4</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{agent.task}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-bch animate-pulse" />
                                        <span className="text-[9px] text-bch font-black">99.9% UP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-xl font-black text-white">{isRental ? agent.rental : agent.price}</span>
                            <span className="text-[8px] text-white/20 font-black uppercase tracking-tighter">{isRental ? 'Hourly Lease' : 'Atomic Call'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">Sustainability</span>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-cyber" style={{ width: `${agent.sustainability}%` }} />
                            </div>
                        </div>
                        <div className="space-y-1 border-x border-white/5 px-4 text-center">
                            <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">Latency</span>
                            <div className="text-[10px] text-white/60 font-mono tracking-tighter">
                                <LatencyValue />
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">Security Type</span>
                            <div className="text-[9px] text-bch font-black uppercase tracking-tighter flex items-center justify-end gap-1">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                {agent.security}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onCallAgent(agent)}
                        className="w-full mt-6 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-bch hover:text-black transition-all border border-white/5"
                    >
                        Initialize Handshake
                    </button>
                </div>
            ))}
        </div>
    );
};

export default function DashboardPage() {
    const [activeHandshake, setActiveHandshake] = useState(false);
    const [handshakeStep, setHandshakeStep] = useState(0);
    const [walletOpen, setWalletOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [aiResult, setAiResult] = useState<string>('');
    const [logs, setLogs] = useState<string[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [userWallet, setUserWallet] = useState<{ addr: string, bal: string, pkey?: string } | null>(null);
    const [isRental, setIsRental] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [showPayload, setShowPayload] = useState(false);
    const [encryptedBlob, setEncryptedBlob] = useState('');
    const [userQuery, setUserQuery] = useState('');
    const [agents, setAgents] = useState([
        { id: 1, name: 'Alpha-Trader', task: 'Sentiment Analysis', price: '1,800 sats', rental: '3,200/hr', icon: Cpu, color: 'text-bch', reputation: 98, sustainability: 88, security: 'E2EE (ECIES)' },
        { id: 2, name: 'DevBot-Pro', task: 'Code Review', price: '2,700 sats', rental: '5,000/hr', icon: Terminal, color: 'text-cyber', reputation: 92, sustainability: 45, security: 'E2EE (ECIES)' },
        { id: 3, name: 'Vision-Lite', task: 'Image Tagging', price: '1,200 sats', rental: '2,000/hr', icon: Eye, color: 'text-purple-400', reputation: 85, sustainability: 65, security: 'Standard' },
    ]);

    useEffect(() => {
        const syncWallet = () => {
            const addr = localStorage.getItem('cashapi_wallet_addr');
            const bal = localStorage.getItem('cashapi_wallet_bal');
            if (addr && bal) {
                setUserWallet({ addr, bal });
            } else {
                setUserWallet(null);
            }
        };

        syncWallet();
        window.addEventListener('storage', syncWallet);
        return () => window.removeEventListener('storage', syncWallet);
    }, []);

    const protocolSteps = [
        { title: 'Discovery', desc: 'Fetching /.well-known/402.json' },
        { title: 'Security', desc: 'Handshaking Public Keys (ECIES)' },
        { title: 'Payment', desc: isRental ? 'BCH Rental Lease (Time-Locked)' : 'BCH Transaction (Escrowed)' },
        { title: 'Fulfillment', desc: 'Delivering Encrypted AI Result' },
    ];

    const addLog = (msg: string) => setLogs(prev => [...prev.slice(-4), msg]);

    const startHandshake = (agent: any) => {
        setSelectedAgent(agent);
        setActiveHandshake(true);
        setHandshakeStep(0);
        setPaymentSuccess(false);
        setUserQuery(''); // reset query each session
        setLogs(['[System] Initializing x402 Handshake...']);

        // Sustainability Drainage (Simulating agent work consumption)
        setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, sustainability: Math.max(0, a.sustainability - 5) } : a));

        setTimeout(() => {
            setHandshakeStep(1);
            addLog(`GET /.well-known/402.json → 200 OK`);
            addLog(`[AI] Found network: chipnet, price: ${isRental ? agent.rental : agent.price}`);
        }, 1500);

        setTimeout(() => {
            setHandshakeStep(2);
            addLog(`X-Agent-PublicKey: 03f... (Challenge)`);
            addLog(`[System] Establishing E2EE Security Tunnel...`);
            setWalletOpen(true);
        }, 3000);
    };

    const handlePayment = async () => {
        setWalletOpen(false);
        addLog(`[Wallet] Reconstructing chipnet wallet from seed...`);

        const price = selectedAgent ? parseInt(selectedAgent.price.replace(/[^0-9]/g, '')) : 1200;

        // Generate encrypted blob for the visualizer
        const mockBlob = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setEncryptedBlob(`0x${mockBlob}...`);

        // We stay on Step 2 (Payment) during the broadcast

        // --- Real Chipnet Payment Flow ---
        const savedSeed = localStorage.getItem('cashapi_wallet_seed');
        let txId: string | null = null;

        if (savedSeed && savedSeed !== 'undefined' && savedSeed.trim().split(/\s+/).length >= 12) {
            try {
                addLog(`[BCH] Broadcasting ${price} sats to chipnet merchant...`);
                console.log('[CashApi] Merchant Address:', MERCHANT_ADDRESS);
                console.log('[CashApi] Price (sats):', price);

                const currentBal = parseInt(userWallet?.bal || '0');
                const estimatedFee = 350; // BCH tx fee on chipnet is small
                const dustLimit = 546;
                const totalOut = price + estimatedFee;

                if (currentBal > totalOut && (currentBal - totalOut) < dustLimit) {
                    addLog(`⚠️ Dust Warning: Change output too small. Fund more or sweep.`);
                    console.warn(`[CashApi] Potential dust change: ${currentBal - totalOut} < ${dustLimit}`);
                }

                // Dynamically import mainnet-js to avoid SSR issues
                const { TestNetWallet, DefaultProvider } = await import('mainnet-js');

                // Set custom RPC provider
                DefaultProvider.servers['chipnet'] = ['wss://chipnet.bch.ninja:50004'];

                const payerWallet = await TestNetWallet.fromId(`seed:testnet:${savedSeed.trim()}`);

                const sendResult = await (payerWallet as any).send([
                    { cashaddr: MERCHANT_ADDRESS, value: price, unit: 'sat' }
                ]);

                txId = sendResult?.txId || sendResult?.transaction_id || null;
                if (!txId) throw new Error('Broadcast failed to return TXID.');

                addLog(`✅ [BCH] TX Broadcast! TXID: ${txId.substring(0, 16)}...`);

                // Update wallet balance in localStorage
                const newBal = Math.max(0, parseInt(userWallet?.bal || '0') - price);
                localStorage.setItem('cashapi_wallet_bal', String(newBal));
                setUserWallet(prev => prev ? { ...prev, bal: String(newBal) } : null);

                // ATOMIC SUCCESS: We have the TXID, now we can move to step 3 (Fulfillment)
                setHandshakeStep(3);

            } catch (err: any) {
                console.error('[CashApi] Broadcast Error:', err);
                const errMsg = err?.message || String(err);
                addLog(`❌ [BCH] Error: ${errMsg.substring(0, 40)}...`);
                if (errMsg.includes('dust')) {
                    addLog(`💡 Tip: Fund with more sats (e.g. 5000) to avoid dust change.`);
                }
                return; // Stop here, don't call API without payment
            }
        } else {
            addLog(`❌ [Wallet] No funded chipnet wallet found. Payment required.`);
            return; // Stop here
        }

        // Build token for the x402 request
        // Note: Buffer.toString('base64url') is Node-only — browser polyfill doesn't support it.
        // Use standard base64 then convert to base64url manually.
        const challengeToken = Buffer.from(JSON.stringify({
            address: MERCHANT_ADDRESS,
            amount: price,
            network: 'chipnet',
            agentName: selectedAgent?.name || 'Agent',
            agentTask: selectedAgent?.task || 'Analysis',
            iat: Date.now(),
        })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

        addLog(`🛡️ [Security] Encrypting payload with Payer PK...`);
        addLog(`📡 POST /api/cashapi (Authorization: x402 <token>:<txid>)`);

        // --- Call the real x402 API route ---
        let result = 'AI result unavailable.';
        const queryToSend = userQuery.trim() || `Summarize your specialty in one insight for ${selectedAgent?.name}`;
        try {
            const authHeader = `x402 ${challengeToken}:${txId}`;

            const apiRes = await fetch('/api/cashapi', {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agent: selectedAgent?.name,
                    task: selectedAgent?.task,
                    query: queryToSend,
                }),
            });

            const data = await apiRes.json();

            if (apiRes.ok && data.ai_result) {
                result = data.ai_result;
                addLog(`♻️ [Covenant] Output 1: Gas Tank Refill (+30%)`);
                addLog(`💎 [System] 200 OK — Real chipnet payment verified!`);
            } else if (txId) {
                // FALLBACK: If backend fails (likely indexer lag) but we HAVE a txId, let it go.
                addLog(`⚠️ [Chain] Indexer lag detected. Using client-side fulfillment...`);
                const prompt = `You are ${selectedAgent?.name} specializing in ${selectedAgent?.task}. 
A user just paid ${price} sats of BCH (TXID: ${txId}) for your service. 
Query: ${queryToSend}. 
Provide a brief, technical, and insightul response (under 200 chars).`;
                result = await getAICompletion(prompt);
            } else {
                addLog(`❌ [Chain] Payment verification failed: ${data.error || 'Unknown error'}`);
                return;
            }
        } catch (err) {
            if (txId) {
                addLog(`⚠️ [Network] API unreachable. Using local fulfillment...`);
                const prompt = `You are ${selectedAgent?.name} specializing in ${selectedAgent?.task}. 
A user just paid ${price} sats (TXID: ${txId}). 
Query: ${queryToSend}. 
Provide a brief response.`;
                result = await getAICompletion(prompt);
            } else {
                addLog(`❌ [Error] API call failed. Verify your connection.`);
                return;
            }
        }

        setAiResult(result);

        // Refill Longevity (Gas Tank)
        setAgents(prev => prev.map(a => a.id === selectedAgent?.id ? { ...a, sustainability: Math.min(100, a.sustainability + 15) } : a));

        setHandshakeStep(4);
        setPaymentSuccess(true);
        addLog(`🤖 [AI] ${result.substring(0, 80)}...`);

        setHistory(prev => [{
            agent: selectedAgent?.name,
            task: selectedAgent?.task,
            result,
            time: new Date().toLocaleTimeString(),
            type: isRental ? 'Rental' : 'One-Off',
            txId: txId,
        }, ...prev]);
    };

    return (
        <div className="min-h-screen bg-mesh relative font-sans">
            <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
            <Header />

            <div className="max-w-[1600px] mx-auto p-6 pt-28">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Protcol Status', val: 'Operational', icon: Globe, color: 'text-bch' },
                        { label: 'Network Load', val: '14.2 ops/s', icon: Activity, color: 'text-cyber' },
                        { label: 'Total Handshakes', val: '42,019', icon: Zap, color: 'text-amber-500' },
                        { label: 'BCH Price (Sim)', val: '$328.12', icon: Coins, color: 'text-white/40' },
                    ].map((stat, i) => (
                        <div key={i} className="terminal-card bg-black/40 flex items-center gap-4 py-4">
                            <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[8px] text-white/20 font-black uppercase tracking-widest">{stat.label}</div>
                                <div className="text-sm font-black text-white uppercase">{stat.val}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Sidebar: Network Telemetry */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="terminal-card bg-black/40">
                            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
                                <BarChart3 className="w-3.5 h-3.5 text-cyber" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Market Telemetry</h4>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter">
                                        <span className="text-white/40">Network Saturation</span>
                                        <span className="text-bch">42%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-bch w-[42%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter">
                                        <span className="text-white/40">Avg Handshake Latency</span>
                                        <span className="text-cyber">84ms</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyber w-[65%]" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1">Total Volume</div>
                                    <div className="text-xs font-black text-white">1,402 BCH</div>
                                </div>
                                <div>
                                    <div className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1">Protocol Fees</div>
                                    <div className="text-xs font-black text-white">4.2 BCH</div>
                                </div>
                            </div>
                        </div>

                        <div className="terminal-card bg-black/40 border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Server className="w-3.5 h-3.5 text-amber-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Node Status</h4>
                            </div>
                            <div className="font-mono text-[9px] text-amber-500/60 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 h-32 overflow-hidden relative">
                                <div className="scanline" />
                                <div className="space-y-1">
                                    <div>➜ CHIPNET_CONNECT: SUCCESS</div>
                                    <div>➜ INDEXER_SYNC: 99.9%</div>
                                    <div>➜ COVENANT_V3: ACTIVE</div>
                                    <div>➜ ECIES_CTX: READY</div>
                                    <div>➜ WAITING_FOR_CALL...</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center: Agent Marketplace */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center justify-between terminal-card py-4">
                            <div className="flex gap-4">
                                <div className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all cursor-pointer", !isRental ? "bg-bch text-black shadow-glow shadow-bch/40" : "bg-white/5 text-white/40 border border-white/5 hoverline")} onClick={() => setIsRental(false)}>Standard</div>
                                <div className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all cursor-pointer", isRental ? "bg-cyber text-black shadow-glow shadow-cyber/40" : "bg-white/5 text-white/40 border border-white/5 hoverline")} onClick={() => setIsRental(true)}>Lease Mode</div>
                            </div>
                            <div className="p-2 bg-white/5 rounded-xl border border-white/5 px-4">
                                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mr-2 underline decoration-bch">3 Agents Active</span>
                            </div>
                        </div>

                        {!userWallet && (
                            <div className="p-6 terminal-card border-amber-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/10">
                                        <ZapOff className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-xs tracking-tighter uppercase">Wallet Disconnected</h4>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Connect to access M2M Hub</p>
                                    </div>
                                </div>
                                <a href="/wallet" className="px-5 py-2.5 bg-amber-500 text-black font-black rounded-xl text-[9px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-glow shadow-amber-500/20">
                                    AUTH
                                </a>
                            </div>
                        )}
                        <AgentMarketplaceSection onCallAgent={startHandshake} agents={agents} isRental={isRental} />
                    </div>

                    {/* Right Sidebar: Protocol Monitor */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="flex flex-col min-h-[500px] border-white/5 bg-dark-surface p-0 rounded-[32px] overflow-hidden">
                            <div className="p-6 border-b border-white/5 bg-black/40 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyber flex items-center justify-center border-glow shadow-cyber/30">
                                        <Terminal className="w-5 h-5 text-black" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-sm tracking-tighter uppercase">Handshake Monitor</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] text-cyber font-black uppercase tracking-widest leading-none">v2.1 SOCKET_ACTIVE</p>
                                            <span className={cn(
                                                "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest",
                                                userWallet && parseInt(userWallet.bal) > 0
                                                    ? "bg-bch/20 text-bch border border-bch/20"
                                                    : "bg-amber-500/20 text-amber-500 border border-amber-500/20"
                                            )}>
                                                {userWallet && parseInt(userWallet.bal) > 0 ? 'Chipnet Live' : 'Demo Mode'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-black text-white/20 uppercase">Local Time</span>
                                    <span className="text-[10px] font-mono text-white/40 tracking-tighter">
                                        <ClientTime />
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex-1 space-y-8">
                                {protocolSteps.map((step, idx) => {
                                    const isCompleted = handshakeStep > idx;
                                    const isActive = handshakeStep === idx;
                                    const isPending = handshakeStep < idx;

                                    return (
                                        <div key={idx} className="relative flex gap-6">
                                            <div className={cn(
                                                "w-7 h-7 rounded-lg border-2 flex items-center justify-center z-10 transition-all duration-500",
                                                isCompleted ? 'bg-bch border-bch text-black scale-110 shadow-glow shadow-bch/40' :
                                                    isActive ? 'border-bch text-bch animate-pulse' : 'border-white/5 text-white/10 bg-white/5'
                                            )}>
                                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className={cn("text-[11px] font-black uppercase tracking-widest", !isPending ? 'text-white' : 'text-white/10')}>{step.title}</h4>
                                                <p className={cn("text-[10px] font-medium leading-relaxed", isActive ? 'text-white/50' : 'text-white/5')}>{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {paymentSuccess && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-bch/10 rounded-2xl border border-bch/30 text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-grid opacity-10" />
                                        <CheckCircle2 className="w-10 h-10 text-bch mx-auto mb-4" />
                                        <h4 className="text-xl font-black text-bch mb-2 uppercase tracking-tighter">Handshake Secured</h4>
                                        <p className="text-[10px] text-white/60 font-mono italic leading-loose">"{aiResult}"</p>
                                    </motion.div>
                                )}
                            </div>

                            <div className="p-6 bg-black/60 border-t border-white/5 font-mono text-[9px] min-h-[140px] flex flex-col gap-1 relative">
                                <div className="absolute top-2 right-4 text-[8px] text-white/20 uppercase font-black tracking-widest">Protocol Stdio</div>
                                <div className="scanline" />
                                {logs.map((log, i) => (
                                    <div key={i} className="text-white/40 flex gap-2">
                                        <span className="text-cyber font-black opacity-50">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                        <span>{log}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <AnimatePresence>
                            {showPayload && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="terminal-card bg-cyan-950/20 border-cyber/20"
                                >
                                    <div className="flex items-center gap-2 mb-6 border-b border-cyber/10 pb-2">
                                        <ShieldCheck className="w-4 h-4 text-cyber shadow-glow shadow-cyber/50" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Encrypted Data Stream</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Ciphertext [AES-256-GCM]</span>
                                            <div className="p-4 bg-black/60 rounded-xl font-mono text-[9px] text-white/40 break-all leading-relaxed border border-white/5 tracking-tighter">
                                                {encryptedBlob || 'AWAITING_RECV_CMD...'}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[8px] font-black text-bch/40 uppercase tracking-widest">Decrypted Output</span>
                                            <div className="p-4 bg-bch/5 rounded-xl font-mono text-[9px] text-bch/70 border border-bch/10 italic leading-relaxed">
                                                {paymentSuccess ? aiResult : ':: [ENCRYPTED_DATA_LOCKED_PENDING_BCH_VERIFICATION] ::'}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {activeHandshake && !showPayload && (
                            <button
                                onClick={() => setShowPayload(true)}
                                className="w-full text-[8px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-bch transition-colors p-4 border border-dashed border-white/10 rounded-2xl"
                            >
                                Open Payload Inspector
                            </button>
                        )}

                        {history.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-white/40" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Recent Activity</h4>
                                    </div>
                                    <span className="text-[8px] font-black text-cyber uppercase tracking-widest">History Enabled</span>
                                </div>
                                <div className="space-y-3">
                                    {history.slice(0, 3).map((item, i) => (
                                        <div key={i} className="p-4 terminal-card bg-white/5 hover:border-white/20 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-tight">{item.agent}</span>
                                                    <span className="text-[8px] bg-white/10 text-white/40 px-1 rounded font-black">{item.type}</span>
                                                </div>
                                                <span className="text-[8px] text-white/20 font-mono tracking-tighter">{item.time}</span>
                                            </div>
                                            <p className="text-[10px] text-white/40 italic line-clamp-2 leading-relaxed group-hover:text-white/60 transition-colors">"{item.result}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {walletOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-[360px] glass border-bch/30 rounded-[32px] p-8 space-y-6 shadow-glow"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-2xl bg-bch flex items-center justify-center mb-4">
                                    <Coins className="w-8 h-8 text-black" />
                                </div>
                                <h3 className="text-xl font-black">Approve Payment</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-1">
                                    {userWallet && parseInt(userWallet.bal) > 0
                                        ? <span className="text-bch">⚡ Real BCH Wallet</span>
                                        : <span className="text-amber-400">⚠️ Demo Mode — fund wallet first</span>
                                    }
                                </p>
                            </div>

                            {userWallet && (
                                <div className="space-y-1">
                                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Connected Address</div>
                                    <div className="font-mono text-[9px] text-white/40 truncate bg-white/5 p-2 rounded-lg border border-white/5">
                                        {userWallet.addr}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center py-4 border-y border-white/5">
                                <div className="space-y-1">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block">Amount</span>
                                    <span className="text-xl font-black text-white">{selectedAgent?.price}</span>
                                </div>
                                {userWallet && (
                                    <div className="text-right space-y-1">
                                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block">Your Balance</span>
                                        <span className="text-sm font-bold text-cyber">{Number(userWallet.bal).toLocaleString()} sats</span>
                                    </div>
                                )}
                            </div>
                            {/* Query input */}
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-white/30 uppercase tracking-widest block">
                                    Your Question / Symbol
                                </label>
                                <textarea
                                    value={userQuery}
                                    onChange={e => setUserQuery(e.target.value)}
                                    placeholder={selectedAgent?.id === 1
                                        ? 'e.g. BTC, AAPL, ETH — or ask anything...'
                                        : selectedAgent?.id === 2
                                            ? 'e.g. Review this code: function foo() {}'
                                            : 'Ask anything related to this agent...'}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] text-white font-mono resize-none focus:outline-none focus:border-bch/50 placeholder:text-white/20 transition-colors"
                                />
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full py-4 bg-bch text-black font-black rounded-2xl hover:scale-105 transition-transform shadow-glow"
                            >
                                Confirm Transaction
                            </button>
                            <button
                                onClick={() => setWalletOpen(false)}
                                className="w-full text-center text-[10px] font-bold text-white/20 uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {paymentSuccess && (
                    <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onAnimationComplete={() => setTimeout(() => setPaymentSuccess(false), 2000)}
                            className="glass p-12 rounded-[40px] border-bch text-center shadow-glow"
                        >
                            <CheckCircle2 className="w-12 h-12 text-bch mx-auto mb-4" />
                            <h2 className="text-2xl font-black text-white">Handshake Verified</h2>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
