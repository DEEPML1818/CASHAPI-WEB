"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Terminal,
    Code2,
    ShieldAlert,
    Zap,
    ShieldCheck,
    CheckCircle2,
    Cpu,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header, Card } from '@/lib/shared-ui';

const SecurityMetrics = () => {
    const metrics = [
        { label: "Handshake Speed", value: "< 40ms", color: "text-bch" },
        { label: "Encryption", value: "AES-256-GCM", color: "text-cyber" },
        { label: "Auth Standard", value: "x402-v2.1", color: "text-white" },
        { label: "Chain Sync", value: "Real-time", color: "text-green-500" }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
                <div key={i} className="terminal-card bg-white/5 border-white/10 p-4 text-center">
                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{m.label}</div>
                    <div className={cn("text-xs font-mono font-black", m.color)}>{m.value}</div>
                </div>
            ))}
        </div>
    );
};

const TechnicalSchematic = () => {
    return (
        <section className="py-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-white/5 text-white/40">
                    <Cpu className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Protocol Stack</h2>
            </div>

            <div className="relative p-8 rounded-3xl border border-dashed border-white/10 bg-black/20 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-5" />

                <div className="relative z-10 flex flex-col items-center gap-8">
                    {/* Layer 1: Client */}
                    <div className="w-full max-w-md p-4 glass rounded-2xl border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-cyber" />
                            <span className="text-[10px] font-bold text-cyber uppercase tracking-widest">Client SDK</span>
                        </div>
                        <div className="h-2 w-24 bg-cyber/20 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="h-full w-1/2 bg-cyber"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 opacity-20">
                        <Zap className="w-4 h-4 text-white" />
                        <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
                    </div>

                    {/* Layer 2: Middleware */}
                    <div className="w-full max-w-lg p-6 terminal-card bg-bch/10 border-bch/40 flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-bch/20 pb-2">
                            <span className="text-[10px] font-black text-bch uppercase tracking-[0.3em]">x402 Verification Layer</span>
                            <ShieldCheck className="w-4 h-4 text-bch" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-black/40 rounded border border-white/5 text-[8px] text-white/40 font-mono">
                                <div className="text-white/60 mb-1">REQ_SCAN</div>
                                AUTH_X402?
                            </div>
                            <div className="p-2 bg-black/40 rounded border border-white/5 text-[8px] text-white/40 font-mono">
                                <div className="text-white/60 mb-1">CHALLENGE</div>
                                402_PAY_REQ
                            </div>
                            <div className="p-2 bg-black/40 rounded border border-white/5 text-[8px] text-white/40 font-mono">
                                <div className="text-white/60 mb-1">VALIDATE</div>
                                BCH_0CONF
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 opacity-20">
                        <div className="w-px h-8 bg-gradient-to-t from-white to-transparent" />
                        <Zap className="w-4 h-4 text-white rotate-180" />
                    </div>

                    {/* Layer 3: AI Service */}
                    <div className="w-full max-w-md p-4 glass rounded-2xl border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-5 h-5 text-white/60" />
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Target API / AI Service</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-green-500/50" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function MiddlewareDocsPage() {
    return (
        <div className="min-h-screen bg-mesh font-sans relative">
            <div className="noise-overlay" />
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
            <Header />

            <main className="pt-32 px-8 max-w-5xl mx-auto pb-40 relative z-10">
                <a href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-bch transition-colors text-xs font-bold uppercase tracking-widest mb-12">
                    <ArrowLeft className="w-4 h-4" /> Back to Terminal
                </a>

                <div className="space-y-24">
                    {/* Hero */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl font-black tracking-tighter text-white">
                            MIDDLEWARE <span className="text-glow text-bch italic text-glow">INTERNALS</span>
                        </h1>
                        <p className="text-lg text-white/40 leading-relaxed max-w-2xl">
                            Complete technical specification for the CashApi x402 enforcement layer.
                            Learn how to gate any API with instant on-chain verification.
                        </p>
                        <SecurityMetrics />
                    </motion.section>

                    {/* Schematic */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.2 }}
                    >
                        <TechnicalSchematic />
                    </motion.div>

                    {/* How it works */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-bch/10 text-bch">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">The x402 Lifecycle</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-bch/10 transition-colors">01</span>
                                    <h3 className="font-bold">Challenge Initiation</h3>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed leading-relaxed font-medium">
                                    When a request enters without a valid token, the middleware throws
                                    <code>402 Payment Required</code> and provides a BCH destination address
                                    and unique challenge token in the <code>WWW-Authenticate</code> header.
                                </p>
                            </Card>

                            <Card className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-bch/10 transition-colors">02</span>
                                    <h3 className="font-bold">Automated Fulfillment</h3>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed leading-relaxed font-medium">
                                    The Payer SDK detects the challenge, broadcasts a BCH transaction
                                    (0-conf enabled), and retries the request with the TXID as
                                    authorization.
                                </p>
                            </Card>

                            <Card className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-bch/10 transition-colors">03</span>
                                    <h3 className="font-bold">On-chain Verification</h3>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed leading-relaxed font-medium">
                                    The middleware verifies the TXID using Chipnet/Mainnet nodes.
                                    It validates the destination address, the amount, and the challenge
                                    linkage before granting access.
                                </p>
                            </Card>

                            <Card className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-bch/10 transition-colors">04</span>
                                    <h3 className="font-bold">Session Persistence</h3>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed leading-relaxed font-medium">
                                    Validated sessions can be persisted via secure tokens, allowing
                                    subsequent requests to bypass the payment flow until the session
                                    expires or resources are consumed.
                                </p>
                            </Card>
                        </div>
                    </motion.section>

                    {/* Roadmap/Future Plan */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.2 }}
                        className="terminal-card bg-bch/5 border-bch/20 p-10 space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldAlert className="w-32 h-32 text-bch" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bch/20 text-bch text-[10px] font-black uppercase tracking-widest">
                                Roadmap 2026
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">Future: Security-First Middleware</h2>
                            <p className="text-white/60 leading-relaxed max-w-xl">
                                The next evolution of CashApi focuses on safety. We are developing an
                                integrated Security Middleware layer that performs real-time checks
                                during the x402 handshake.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-bch">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[12px] font-bold">Encrypted Handshakes</span>
                                    </div>
                                    <p className="text-[10px] text-white/40">Mandatory E2EE using ECIES for all payment negotiations to prevent TX sniffing.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-bch">
                                        <Zap className="w-4 h-4" />
                                        <span className="text-[12px] font-bold">Threat Scoring</span>
                                    </div>
                                    <p className="text-[10px] text-white/40">Automated reputation scoring and threat detection for every participating agent node.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Implementation Example */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-6 h-6 text-white/40" />
                            <h2 className="text-2xl font-bold">Quick Integration</h2>
                        </div>
                        <div className="bg-black/60 rounded-3xl p-8 border border-white/5 font-mono text-[11px] leading-relaxed relative overflow-hidden group">
                            <div className="absolute top-4 right-6 text-white/10 group-hover:text-bch transition-colors">server.ts</div>
                            <pre className="text-white/80">
                                {`import { cashapi } from "cashapi-middleware";

// Secure your AI route in 3 lines
app.post("/api/generate", 
  cashapi({ price: 1200, address: "bitcoincash:..." }),
  (req, res) => {
    res.json({ data: "AI Response Unlocked!" });
  }
);`}
                            </pre>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center opacity-40">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em]">&copy; 2026 CashApi Protocol | Internal Tech Specs</p>
            </footer>
        </div>
    );
}
