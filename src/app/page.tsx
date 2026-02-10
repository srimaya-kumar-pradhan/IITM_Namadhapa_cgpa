'use client';

import React from 'react';
import { useCGPA } from '@/components/shared/CGPAProvider';
import CurrentCGPADashboard from '@/components/current-cgpa/CurrentCGPADashboard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Trophy, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const {
    domain, setDomain,
    level, setLevel,
    userGrades, updateGrade,
    isInitialized
  } = useCGPA();

  if (!isInitialized) return null;

  return (
    <div className="space-y-20 pb-20">
      {/* Namdapha Style Hero Section */}
      <section className="relative pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Academic Excellence Hub</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tighter">
              Precision <span className="text-primary italic">Planning</span> for your BS Degree.
            </h1>

            <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
              Unlock the power of predictive analytics for your IITM BS journey.
              Track your current standing and simulate future terms with 100% policy accuracy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full px-10 py-7 h-auto bg-primary hover:bg-primary/90 text-white font-black text-base shadow-2xl shadow-primary/30 group"
              >
                Track Your CGPA <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link href="/predict">
                <Button
                  variant="outline"
                  className="rounded-full px-10 py-7 h-auto border-2 border-slate-200 hover:border-primary hover:bg-primary/5 text-slate-700 font-black text-base transition-all"
                >
                  Predict Next Term
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-slate-100 dark:border-white/10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm relative">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Join <span className="text-slate-800 dark:text-white">500+ Students</span> planning their success.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:block hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            <div className="relative bg-slate-900 rounded-[3rem] p-10 shadow-3xl shadow-slate-900/40 border border-slate-800 overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>

              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-black text-xl">House Stats</h3>
                  <Zap className="text-primary w-6 h-6 fill-primary" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-2 group-hover:bg-white/10 transition-colors">
                    <Trophy className="text-yellow-500 w-5 h-5" />
                    <p className="text-3xl font-black text-white">8.42</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Avg House CGPA</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-2 group-hover:bg-white/10 transition-colors">
                    <Shield className="text-primary w-5 h-5" />
                    <p className="text-3xl font-black text-white">96%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">In-house Accuracy</p>
                  </div>
                </div>

                <div className="bg-primary p-8 rounded-[2rem] space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Live Forecast</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">10.0</span>
                    <span className="text-white/60 font-bold">Goal</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="scroll-mt-32">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Academic <span className="text-primary italic">Status</span></h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Log your official grades to see your validated standing in the BS Curriculum.
            All data remains private in your browser.
          </p>
        </div>

        <CurrentCGPADashboard
          domain={domain}
          level={level}
          userGrades={userGrades}
          updateGrade={updateGrade}
          setDomain={setDomain}
          setLevel={setLevel}
        />
      </section>

      {/* Feature Cards Section (Namdapha Style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Smart Prediction", desc: "Machine Learning model based on curriculum difficulty and cluster performance.", icon: Zap, color: "bg-blue-500" },
          { title: "House Leaderboard", desc: "Coming soon: Compare your standing with house averages and milestones.", icon: Trophy, color: "bg-yellow-500" },
          { title: "Privacy First", desc: "100% Client-side. We never store or transmit your grades to any server.", icon: Shield, color: "bg-emerald-500" },
        ].map((feat, i) => (
          <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-default group">
            <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-inherit`}>
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-3">{feat.title}</h3>
            <p className="text-sm text-muted-foreground dark:text-slate-400 leading-relaxed font-medium">
              {feat.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
