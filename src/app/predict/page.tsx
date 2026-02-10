'use client';

import React from 'react';
import { useCGPA } from '@/components/shared/CGPAProvider';
import PredictiveCGPADashboard from '@/components/predictive-cgpa/PredictiveCGPADashboard';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, ArrowDown } from 'lucide-react';

export default function PredictPage() {
    const {
        domain,
        userGrades,
        overrides,
        updateOverride,
        clearOverrides,
        isInitialized
    } = useCGPA();

    if (!isInitialized) return null;

    return (
        <div className="space-y-20 pb-20 pt-12">
            {/* Predictive Page Hero */}
            <section className="text-center space-y-8 relative overflow-hidden py-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,oklch(0.45_0.15_25_/_0.05)_0%,transparent_70%)] -z-10"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <Sparkles className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Strategic Analysis Engine</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter max-w-4xl mx-auto leading-tight">
                        Predict Your <span className="text-primary italic">Trajectory</span>.
                    </h1>

                    <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        Simulate future terms with our curriculum-aware intelligence model.
                        Adjust confidence levels and override predictions to create your custom academic roadmap.
                    </p>

                    <div className="pt-8">
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-slate-50 dark:bg-white/5 dark:border-white/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-slate-100 shadow-sm"
                        >
                            <ArrowDown className="text-primary w-5 h-5" />
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Main Predictive Dashboard */}
            <section className="relative">
                <PredictiveCGPADashboard
                    domain={domain}
                    userGrades={userGrades}
                    overrides={overrides}
                    updateOverride={updateOverride}
                    clearOverrides={clearOverrides}
                />
            </section>

            {/* Help Section / Tooltips (Optional style) */}
            <section className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black tracking-tight leading-none italic text-primary">How the Engine works.</h2>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                            Our model analyzes your past performance across different subject clusters (Mathematics, Programming, etc.)
                            and applies weightage based on the target course's difficulty and curriculum level.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-[10px] font-black uppercase text-primary mb-2">Cluster Weight</p>
                                <p className="text-xs text-slate-300 font-bold">Similar subjects like Calculus and Stats have stronger correlation in your forecast.</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-[10px] font-black uppercase text-primary mb-2">Trend Bias</p>
                                <p className="text-xs text-slate-300 font-bold">Recent performance trends contribute significantly to next-term estimations.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 aspect-video rounded-[3rem] border border-white/20 relative group cursor-pointer overflow-hidden">
                        <Image
                            src="/intelligence-v4-bg.png"
                            alt="Intelligence Model Graphics"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            priority
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
