'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, Zap, Info, RotateCcw } from 'lucide-react';
import {
    Course,
    DegreeDomain,
    Grade,
    Level,
    CurriculumCourse,
    SkillCluster,
    calculateCGPA,
    CURRICULUM,
    predictCoursePerformance,
    PredictionResult
} from '@/utils/cgpa';
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

    const completedCourses = useMemo(() => {
        const completed: Course[] = [];
        (['Foundation', 'Diploma', 'BSc Degree', 'BS Degree'] as Level[]).forEach((l: Level) => {
            CURRICULUM[domain][l].forEach((c: CurriculumCourse) => {
                const g = userGrades[domain][c.name];
                if (g && ['S', 'A', 'B', 'C', 'D', 'E'].includes(g)) {
                    completed.push({
                        id: `ctx-${c.name}`,
                        name: c.name,
                        credits: c.credits,
                        level: l,
                        domain: domain,
                        cluster: c.cluster,
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
            CURRICULUM[domain][l].forEach((c: CurriculumCourse) => {
                if (!userGrades[domain][c.name]) {
                    results[c.name] = predictCoursePerformance(
                        { ...c, level: l, domain: domain },
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
            CURRICULUM[domain][l].forEach((c: CurriculumCourse) => {
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
                            cluster: c.cluster,
                            grade: override ?? pred.grade
                        });
                    }
                }
            });
        });
        return calculateCGPA([...completedCourses, ...predictedResults]);
    }, [domain, completedCourses, allPredictions, overrides]);

    const targetViewCourses = useMemo(() => {
        return CURRICULUM[domain][targetLevel].map((c: CurriculumCourse) => ({
            ...c,
            grade: userGrades[domain][c.name] ?? null,
            prediction: allPredictions[c.name],
            override: overrides[domain][c.name]
        }));
    }, [domain, targetLevel, userGrades, allPredictions, overrides]);

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none bg-slate-900 text-white rounded-[2.5rem] shadow-2xl overflow-hidden relative p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 py-4">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Projected CGPA</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-7xl font-black tracking-tighter">{projectedStats.cgpa}</span>
                                <span className="text-slate-500 font-bold">Goal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-blue-500">+{Math.max(0, projectedStats.cgpa - currentStats.cgpa).toFixed(2)} Potential Gain</span>
                                <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${projectedStats.cgpa * 10}%` }}
                                        className="h-full bg-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-sm">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Baseline (Current)</p>
                                <p className="text-2xl font-black">{currentStats.cgpa}</p>
                            </div>
                            <div className="bg-blue-500 text-white p-4 rounded-3xl shadow-lg shadow-blue-500/20">
                                <p className="text-[10px] font-bold opacity-80 uppercase mb-1">Next Term Estimate</p>
                                <p className="text-2xl font-black font-mono">{(projectedStats.cgpa + 0.1).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-4">
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden h-full">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-blue-600" /> Model Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</Label>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                                        {confidence < 1.0 ? 'Conservative' : confidence > 1.0 ? 'Optimistic' : 'Realistic'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.8"
                                    max="1.2"
                                    step="0.1"
                                    value={confidence}
                                    onChange={(e) => setConfidence(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-[8px] font-bold text-slate-300 uppercase">
                                    <span>Cautious</span>
                                    <span>Neutral</span>
                                    <span>Growth</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearOverrides}
                                className="w-full rounded-xl text-xs font-bold border-slate-100 text-slate-500 hover:bg-slate-50"
                            >
                                <RotateCcw className="w-3 h-3 mr-2" /> Reset Hypotheticals
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="rounded-[2.5rem] border-slate-50 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                <CardHeader className="p-8 flex flex-row items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            Next Stage <Zap className="w-6 h-6 text-blue-500 fill-blue-500" />
                        </CardTitle>
                        <p className="text-sm font-medium text-slate-500">ML Predictions + Manual &quot;What-If&quot; Simulation</p>
                    </div>
                    <div className="w-48 bg-slate-50 p-1 rounded-2xl flex border border-slate-100">
                        {(['Foundation', 'Diploma', 'BSc Degree', 'BS Degree'] as Level[]).map((l: Level) => (
                            <button
                                key={l}
                                onClick={() => setTargetLevel(l)}
                                className={`flex-1 py-2 text-[8px] font-black rounded-xl transition-all uppercase tracking-tighter ${targetLevel === l ? 'bg-white shadow-sm text-blue-600 border border-slate-100' : 'text-slate-400 opacity-60'
                                    }`}
                            >
                                {l.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-slate-50">
                                <TableHead className="pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Future Course</TableHead>
                                <TableHead className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline Prediction</TableHead>
                                <TableHead className="text-right pr-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Modified Target</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {targetViewCourses.map((c) => (
                                <TableRow key={c.name} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                    <TableCell className="pl-8 py-6">
                                        <div className="space-y-1">
                                            <p className={`font-black tracking-tight ${c.grade ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                {c.name} {c.grade && '✓'}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{c.cluster}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{c.credits} CC</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {c.grade ? (
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Already Completed</span>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 group/tip relative">
                                                <span className="text-xl font-black text-blue-600">{c.prediction?.predictedGP}</span>
                                                <div className="flex items-center gap-1.5 opacity-40">
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">Est. Grade {c.prediction?.grade}</span>
                                                    <Info className="w-3 h-3" />
                                                </div>
                                                <div className="absolute bottom-full mb-2 w-48 p-3 bg-slate-900 text-white rounded-2xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:scale-100 transition-all z-50">
                                                    <p className="text-[8px] font-black text-blue-400 uppercase mb-2 leading-none tracking-widest">Key Influencers</p>
                                                    {c.prediction?.influencers.map((inf: { name: string; weight: number }, i: number) => (
                                                        <div key={i} className="flex justify-between text-[8px] mb-1">
                                                            <span className="truncate w-32 opacity-60 text-left">{inf.name}</span>
                                                            <span className="font-bold">{inf.weight}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Select
                                            disabled={!!c.grade}
                                            value={c.override ?? (c.grade ?? "use_prediction")}
                                            onValueChange={(v: string) => updateOverride(c.name, v === "use_prediction" ? null : v as Grade)}
                                        >
                                            <SelectTrigger className={`w-36 h-10 ml-auto border-none rounded-xl font-black text-xs ${c.override ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-400'}`}>
                                                <SelectValue placeholder="Using AI Prediction" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl shadow-2xl">
                                                <SelectItem value="use_prediction" className="text-blue-600 font-bold italic">AI Baseline</SelectItem>
                                                <SelectGroup>
                                                    {['S', 'A', 'B', 'C', 'D', 'E'].map((g: string) => (
                                                        <SelectItem key={g} value={g} className="font-black">Target Grade {g}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
