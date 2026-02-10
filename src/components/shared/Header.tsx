'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Rocket, LayoutDashboard, Info, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        // Initial theme check
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const navLinks = [
        { name: 'Home', href: '/', icon: LayoutDashboard },
        { name: 'Current CGPA', href: '/', icon: LayoutDashboard },
        { name: 'Predictive model', href: '/predict', icon: Rocket },
        { name: 'About House', href: 'https://namdapha.iitmbs.org/', icon: Info },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/70 backdrop-blur-md shadow-sm border-b border-stone-200/50 dark:bg-slate-950/60 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-2xl py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 group-hover:scale-110 transition-transform" style={{ width: '3rem', height: '3rem', position: 'relative' }}>
                        <Image
                            src="/house-logo.png"
                            alt="Namdapha House Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tight block text-outline">NAMDAPHA</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block -mt-1">House Academic Hub</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-bold flex items-center gap-2 transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-slate-600 dark:text-white/80'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop CTA & Theme Toggle */}
                <div className="hidden lg:flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-2xl transition-all duration-300 ${isScrolled ? 'bg-slate-100 dark:bg-white/10' : 'bg-white/10 backdrop-blur-md'
                            } text-slate-900 dark:text-white hover:scale-110 active:scale-95`}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                    >
                        {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
                    </button>
                    <Link href="https://namdapha.iitmbs.org/">
                        <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20">
                            Join Community
                        </Button>
                    </Link>
                </div>

                <button
                    className="lg:hidden p-2 text-slate-900 dark:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl border-t border-slate-100 dark:border-white/10 p-6 flex flex-col gap-4 lg:hidden"
                    >
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold"
                                >
                                    <Icon className="w-5 h-5 text-primary" />
                                    {link.name}
                                </Link>
                            );
                        })}
                        <hr className="border-slate-100" />
                        <Link href="https://namdapha.iitmbs.org/" className="w-full">
                            <Button className="w-full rounded-2xl h-12 bg-primary text-white font-bold">
                                Join Namdapha House
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
