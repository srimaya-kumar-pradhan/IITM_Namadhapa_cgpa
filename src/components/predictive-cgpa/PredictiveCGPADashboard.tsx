'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, Zap, Info, RotateCcw, Sparkles, TrendingUp, Target, Eye, Lock } from 'lucide-react';
import {
    Course,
    DegreeDomain,
    Grade,
    Level,
    calculateCGPA,
    CURRICULUM,
    predictCoursePerformance,
    PredictionResult
} from '@/lib/grading';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    domain: DegreeDomain;
    userGrades: Record<DegreeDomain, Record<string, Grade>>;
    overrides: Record<DegreeDomain, Record<string, Grade>>;
    updateOverride: (courseName: string, grade: Grade) => void;
    clearOverrides: () => void;
}

export default function PredictiveCGPADashboard({
    domain,
    userGrades,
    overrides,
    updateOverride,
    clearOverrides
}: Props) {
    const [confidence, setConfidence] = useState(1.0);
    const [targetLevel, setTargetLevel] = useState<Level>('Foundation');
    const [isPredicted, setIsPredicted] = useState(false);

    const completedCourses = useMemo(() => {
        const completed: Course[] = [];
        (['Foundation', 'Diploma', 'BSc Degree', 'BS Degree'] as Level[]).forEach((l: Level) => {
            CURRICULUM[domain][l].forEach((c: any) => {
                const g = userGrades[domain][c.name];
                if (g && ['S', 'A', 'B', 'C', 'D', 'E'].includes(g)) {
                    completed.push({
                        id: `ctx-${c.name}`,
                        name: c.name,
                        credits: c.credits,
                        level: l,
                        domain: domain,
                        cluster: c.cluster as any,
                        grade: g
                    });
                }
            });
        });
        return completed;
    }, [domain, userGrades]);

    const currentStats = useMemo(() => calculateCGPA(completedCourses), [completedCourses]);

    const allPredictions = useMemo(() => {
        const results: Record<string, PredictionResult> = {};
        (['Foundation', 'Diploma', 'BSc Degree', 'BS Degree'] as Level[]).forEach((l: Level) => {
            CURRICULUM[domain][l].forEach((c: any) => {
                if (!userGrades[domain][c.name]) {
                    results[c.name] = predictCoursePerformance(
                        { ...c, level: l, domain: domain, cluster: c.cluster as any } as any,
                        completedCourses,
                        confidence
                    );
                }
            });
        });
        return results;
    }, [domain, completedCourses, confidence, userGrades]);

    const projectedStats = useMemo(() => {
        const predictedResults: Course[] = [];
        (['Foundation', 'Diploma', 'BSc Degree', 'BS Degree'] as Level[]).forEach((l: Level) => {
            CURRICULUM[domain][l].forEach((c: any) => {
                if (!userGrades[domain][c.name]) {
                    const override = overrides[domain][c.name];
                    const pred = allPredictions[c.name];
                    if (override || pred) {
                        predictedResults.push({
                            id: `p-${c.name}`,
                            name: c.name,
                            credits: c.credits,
                            level: l,
                            domain: domain,
                            cluster: c.cluster as any,
                            grade: override ?? pred.grade
                        });
                    }
                }
            });
        });
        return calculateCGPA([...completedCourses, ...predictedResults]);
    }, [domain, completedCourses, allPredictions, overrides]);

    const targetViewCourses = useMemo(() => {
        return CURRICULUM[domain][targetLevel].map((c: any) => ({
            ...c,
            grade: userGrades[domain][c.name] ?? null,
            prediction: allPredictions[c.name],
            override: overrides[domain][c.name]
        }));
    }, [domain, targetLevel, userGrades, allPredictions, overrides]);

    return (
        <div className="space-y-12">
            {!isPredicted ? (
                <Card className="border-none bg-slate-50 rounded-[4rem] p-12 md:p-24 text-center space-y-8 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                    <div className="bg-white w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-slate-200 border border-slate-50">
                        <Lock className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-4 max-w-xl mx-auto">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Strategy <span className="text-primary italic">Engine</span> Ready.</h2>
                        <p className="text-slate-500 font-medium">Click below to initialize the predictive model and reveal your estimated trajectory based on current performance data.</p>
                    </div>
                    <Button
                        onClick={() => setIsPredicted(true)}
                        className="rounded-full px-12 py-8 h-auto bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-3xl shadow-primary/30 group"
                    >
                        Initialize Prediction <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                    </Button>
                </Card>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    {/* Prediction Summary Header */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 border-none bg-slate-900 text-white rounded-[3rem] shadow-3xl shadow-slate-900/30 overflow-hidden relative p-10">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12 py-4">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                                        <Sparkles className="w-3 h-3 text-primary fill-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Intelligence Forecast</span>
                                    </div>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-8xl font-black tracking-tighter">{projectedStats.cgpa}</span>
                                        <div className="space-y-1">
                                            <p className="text-xl font-bold text-white/50">PROJECTION</p>
                                            <p className="text-sm font-black text-primary">+{Math.max(0, projectedStats.cgpa - currentStats.cgpa).toFixed(2)} Target Gain</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex items-center gap-4">
                                        <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${projectedStats.cgpa * 10}%` }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Growth Potential</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 w-full md:w-64">
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-md">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Baseline Standing</p>
                                        <p className="text-3xl font-black">{currentStats.cgpa}</p>
                                    </div>
                                    <div className="bg-primary p-6 rounded-[2.5rem] shadow-2xl shadow-primary/30">
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Estimated Next Term</p>
                                        <p className="text-3xl font-black italic">{(projectedStats.cgpa + 0.1).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex flex-col gap-4">
                            <Card className="rounded-[2.5rem] border-slate-50 shadow-xl shadow-slate-200/50 overflow-hidden h-full">
                                <CardHeader className="bg-slate-50/70 border-b border-slate-50 pb-6 pt-8 px-8">
                                    <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-primary" /> Confidence Engine
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-8 px-8 space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center px-1">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Scenario Type</Label>
                                            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                {confidence < 1.0 ? 'Conservative' : confidence > 1.0 ? 'Optimistic' : 'Balanced'}
                                            </span>
                                        </div>
                                        <div className="px-1">
                                            <input
                                                type="range"
                                                min="0.8"
                                                max="1.2"
                                                step="0.1"
                                                value={confidence}
                                                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                                                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase mt-4 tracking-tighter">
                                                <span>Risk Averse</span>
                                                <span className="text-primary font-black">Stability</span>
                                                <span>Growth Bias</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={clearOverrides}
                                        variant="outline"
                                        className="w-full rounded-2xl h-14 border-2 border-slate-50 hover:border-primary hover:bg-primary/5 text-slate-600 font-bold transition-all gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Reset Simulations
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Predictive Course List */}
                    <Card className="rounded-[3.5rem] border-none shadow-3xl shadow-slate-200/40 overflow-hidden bg-white">
                        <CardHeader className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-50">
                            <div className="flex items-center gap-4 text-left mr-auto">
                                <div className="p-5 bg-primary rounded-[2rem] shadow-xl shadow-primary/20">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-4xl font-black text-slate-900 tracking-tighter">Target Simulator</CardTitle>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1 italic">What-if Scenarios for {targetLevel}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-1.5 rounded-[2rem] flex gap-1 border-2 border-slate-100/50 overflow-hidden min-w-fit">
                                {(['Foundation', 'Diploma', 'BSc Degree', 'BS Degree'] as Level[]).map((l: Level) => (
                                    <button
                                        key={l}
                                        onClick={() => setTargetLevel(l)}
                                        className={`px-5 py-3 text-[10px] font-black rounded-2xl transition-all uppercase tracking-tighter ${targetLevel === l
                                                ? 'bg-white shadow-xl text-primary border border-slate-100'
                                                : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {l.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/40">
                                        <TableRow className="hover:bg-transparent border-slate-50">
                                            <TableHead className="pl-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Futural Subject</TableHead>
                                            <TableHead className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Baseline Forecast</TableHead>
                                            <TableHead className="text-right pr-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Strategic Modifier</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {targetViewCourses.map((c: any, idx: number) => (
                                            <TableRow key={c.name} className="border-slate-50 hover:bg-slate-50/30 transition-all group">
                                                <TableCell className="pl-10 py-8">
                                                    <div className="space-y-1.5">
                                                        <p className={`text-lg font-black tracking-tight ${c.grade ? 'text-emerald-600' : 'text-slate-900 group-hover:text-primary transition-colors'}`}>
                                                            {c.name} {c.grade && <span className="ml-2 inline-flex items-center justify-center p-1 bg-emerald-100 rounded-full"><ShieldCheck className="w-3 h-3" /></span>}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{c.cluster}</span>
                                                            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.credits} Credits</span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    {c.grade ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Record Finalized</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 group/tip relative cursor-help py-2">
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="text-4xl font-black text-primary tracking-tighter leading-none">{c.prediction?.predictedGP}</span>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pts</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 transition-colors group-hover/tip:bg-primary/5 group-hover/tip:border-primary/20">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover/tip:text-primary">Est. Grade {c.prediction?.grade}</span>
                                                                <Info className="w-3 h-3 text-slate-300" />
                                                            </div>

                                                            {/* Tooltip Redesigned */}
                                                            <div className="absolute bottom-full mb-4 w-56 p-6 bg-slate-900 text-white rounded-[2.5rem] shadow-3xl opacity-0 scale-95 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:scale-100 transition-all z-50 shadow-primary/20">
                                                                <p className="text-[9px] font-black text-primary uppercase mb-4 tracking-[0.2em] opacity-80">Influencer Analysis</p>
                                                                <div className="space-y-3">
                                                                    {c.prediction?.influencers.map((inf: any, i: number) => (
                                                                        <div key={i} className="flex flex-col gap-1">
                                                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                                                <span className="truncate w-32 text-white/50">{inf.name}</span>
                                                                                <span className="text-primary">{inf.weight}%</span>
                                                                            </div>
                                                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                                                <div className="h-full bg-primary" style={{ width: `${inf.weight}%` }}></div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="mt-4 pt-4 border-t border-white/5 text-[8px] font-bold text-white/30 italic text-center">
                                                                    ML Confidence Index: {c.prediction?.confidence}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-right pr-10">
                                                    <Select
                                                        disabled={!!c.grade}
                                                        value={c.override ?? (c.grade ?? "use_prediction")}
                                                        onValueChange={(v: string) => updateOverride(c.name, v === "use_prediction" ? null : v as Grade)}
                                                    >
                                                        <SelectTrigger className={`w-44 h-14 ml-auto border-2 rounded-2xl font-black text-xs transition-all ${c.override ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-xl shadow-orange-100' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-primary/20'}`}>
                                                            <SelectValue placeholder="AI Baseline" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-[2.5rem] border-slate-100 shadow-3xl p-3">
                                                            <SelectItem value="use_prediction" className="font-bold py-4 rounded-2xl text-primary bg-primary/5 hover:bg-primary/10 mb-2">
                                                                <span className="italic">Using AI Baseline</span>
                                                            </SelectItem>
                                                            <div className="px-2 pb-2">
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Simulate Performance</p>
                                                                <SelectGroup className="grid grid-cols-2 gap-2">
                                                                    {['S', 'A', 'B', 'C', 'D', 'E'].map((g: string) => (
                                                                        <SelectItem key={g} value={g} className="font-black py-3 rounded-xl hover:bg-slate-50 text-center border border-slate-50">
                                                                            Grade {g}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </div>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
