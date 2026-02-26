"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Terminal,
    Code2,
    ShieldAlert,
    Zap,
    ShieldCheck,
    Cpu,
    ArrowLeft
} from 'lucide-react';
import { Header, Card } from '@/lib/shared-ui';

export default function MiddlewareDocsPage() {
    return (
        <div className="min-h-screen bg-mesh font-sans relative">
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
            <Header />

            <main className="pt-32 px-8 max-w-5xl mx-auto pb-40">
                <a href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-bch transition-colors text-xs font-bold uppercase tracking-widest mb-12">
                    <ArrowLeft className="w-4 h-4" /> Back to Terminal
                </a>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-16"
                >
                    {/* Hero */}
                    <section className="space-y-6">
                        <h1 className="text-5xl font-black tracking-tighter text-white">
                            MIDDLEWARE <span className="text-bch italic">INTERNALS</span>
                        </h1>
                        <p className="text-lg text-white/40 leading-relaxed max-w-2xl">
                            Complete technical specification for the CashApi x402 enforcement layer.
                            Learn how to gate any API with instant on-chain verification.
                        </p>
                    </section>

                    {/* How it works */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-bch/10 text-bch">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">The x402 Lifecycle</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black">01</span>
                                    <h3 className="font-bold">Challenge Initiation</h3>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    When a request enters without a valid token, the middleware throws
                                    <code>402 Payment Required</code> and provides a BCH destination address
                                    and unique challenge token in the <code>WWW-Authenticate</code> header.
                                </p>
                            </Card>

                            <Card className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black">02</span>
                                    <h3 className="font-bold">Automated Fulfillment</h3>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    The Payer SDK detects the challenge, broadcasts a BCH transaction
                                    (0-conf enabled), and retries the request with the TXID as
                                    authorization.
                                </p>
                            </Card>

                            <Card className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black">03</span>
                                    <h3 className="font-bold">On-chain Verification</h3>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    The middleware verifies the TXID using Chipnet/Mainnet nodes.
                                    It validates the destination address, the amount, and the challenge
                                    linkage before granting access.
                                </p>
                            </Card>

                            <Card className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black">04</span>
                                    <h3 className="font-bold">Session Persistence</h3>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    Validated sessions can be persisted via secure tokens, allowing
                                    subsequent requests to bypass the payment flow until the session
                                    expires or resources are consumed.
                                </p>
                            </Card>
                        </div>
                    </section>

                    {/* Roadmap/Future Plan */}
                    <section className="terminal-card bg-bch/5 border-bch/20 p-10 space-y-8 relative overflow-hidden">
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
  cashapi({ price: 1000, address: "bitcoincash:..." }),
  (req, res) => {
    res.json({ data: "AI Response Unlocked!" });
  }
);`}
                            </pre>
                        </div>
                    </section>
                </motion.div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center opacity-40">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em]">&copy; 2026 CashApi Protocol | Internal Tech Specs</p>
            </footer>
        </div>
    );
}
