'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Heart, Instagram, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function Footer() {
    const handleDiscordClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toast.info("Coming soon, hold your breath!", {
            description: "We are currently setting up the community server.",
            duration: 4000,
        });
    };

    return (
        <footer className="bg-slate-900 text-white rounded-t-[5rem] pt-24 pb-12 mt-20 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mb-48"></div>

            <div className="max-w-7xl mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative w-14 h-14 group-hover:scale-110 transition-transform" style={{ width: '3.5rem', height: '3.5rem', position: 'relative' }}>
                                <Image
                                    src="/house-logo.png"
                                    alt="Namdapha House Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div>
                                <span className="text-2xl font-black tracking-tight block">NAMDAPHA</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block -mt-1">Academic Hub</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
                            Empowering IITM BS students with statistical insights and predictive tools
                            to master their academic journey. Built for the community, by the community.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Github, href: "https://github.com/Namdapha-House-IITM" },
                                { Icon: Instagram, href: "https://www.instagram.com/namdapha_iitm" },
                                { Icon: MessageCircle, href: "https://namdapha.iitmbs.org/whatsapp" },
                                { Icon: Linkedin, href: "https://www.linkedin.com/company/namdapha-iitm/" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-primary hover:scale-110 transition-all border border-white/5"
                                >
                                    <social.Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Resources</h4>
                        <ul className="space-y-4 font-bold text-slate-300">
                            <li><Link href="/" className="hover:text-white transition-colors">Home Dashboard</Link></li>
                            <li><Link href="/predict" className="hover:text-white transition-colors">Predictive CGPA</Link></li>
                            <li><Link href="https://namdapha.iitmbs.org/resources" className="hover:text-white transition-colors">Resource Website</Link></li>

                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Support</h4>
                        <ul className="space-y-4 font-bold text-slate-300">
                            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Report an Issue</Link></li>
                            <li>
                                <Link
                                    href="#"
                                    onClick={handleDiscordClick}
                                    className="hover:text-white transition-colors"
                                >
                                    Join Discord
                                </Link>
                            </li>
                            <li><Link href="https://namdapha.iitmbs.org/" className="hover:text-white transition-colors">House Website</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-slate-500 font-bold text-sm">
                        &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Namdapha House Academic Hub. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm whitespace-nowrap">
                        Made with <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" /> for IITM BS Students
                    </div>
                </div>
            </div>
        </footer>
    );
}
