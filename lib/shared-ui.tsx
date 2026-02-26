"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Coins, Zap, Wallet, User } from 'lucide-react';

export const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
    <div className="space-y-2 mb-12">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">{children}</h2>
        {subtitle && <p className="text-white/40 font-bold uppercase tracking-widest text-xs">{subtitle}</p>}
    </div>
);

export const Header = () => {
    const [walletAddr, setWalletAddr] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        const addr = localStorage.getItem('cashapi_wallet_addr');
        const bal = localStorage.getItem('cashapi_wallet_bal');
        setWalletAddr(addr);
        setBalance(bal);

        // Listen for storage changes (for sync across tabs/pages)
        const handleStorage = () => {
            setWalletAddr(localStorage.getItem('cashapi_wallet_addr'));
            setBalance(localStorage.getItem('cashapi_wallet_bal'));
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass h-20 flex items-center px-8 border-b border-white/5">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <a href="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 rounded-2xl bg-bch flex items-center justify-center border-glow group-hover:rotate-12 transition-transform">
                        <Coins className="text-black w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">
                        Cash<span className="text-bch">Api</span>
                        <span className="ml-2 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-black tracking-widest text-white/40 uppercase">Ai Hub</span>
                    </span>
                </a>

                <nav className="hidden md:flex items-center gap-10 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                    <a href="/#vision" className="hover:text-bch transition-colors">Vision</a>
                    <a href="/dashboard" className="hover:text-cyber transition-colors">Dashboard</a>

                    {walletAddr ? (
                        <a href="/wallet" className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group">
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] text-white/40 font-black mb-0.5">{walletAddr.slice(0, 10)}...{walletAddr.slice(-4)}</span>
                                <span className="text-[10px] text-bch font-black tracking-normal">{Number(balance).toLocaleString()} SATS</span>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-bch/10 flex items-center justify-center text-bch group-hover:bg-bch group-hover:text-black transition-colors">
                                <User className="w-4 h-4" />
                            </div>
                        </a>
                    ) : (
                        <a href="/wallet" className="flex items-center gap-2 px-4 py-2 rounded-full border border-bch/40 text-bch hover:bg-bch/10 transition-all font-black text-[10px]">
                            <Wallet className="w-3 h-3" /> Connect Wallet
                        </a>
                    )}
                </nav>
            </div>
        </header>
    );
};

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("glass rounded-3xl border-white/5 p-8 hover:border-bch/20 transition-colors group", className)}>
        {children}
    </div>
);
