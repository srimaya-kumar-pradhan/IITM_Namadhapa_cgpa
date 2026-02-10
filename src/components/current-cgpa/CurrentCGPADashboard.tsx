'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, Circle, TrendingUp, Filter, BookOpen } from 'lucide-react';
import {
    Course,
    DegreeDomain,
    Grade,
    Level,
    CurriculumCourse,
    GRADE_POINTS,
    calculateCGPA,
    CURRICULUM
} from '@/utils/cgpa';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    domain: DegreeDomain;
    level: Level;
    userGrades: Record<DegreeDomain, Record<string, Grade>>;
    updateGrade: (courseName: string, grade: Grade) => void;
    setDomain: (domain: DegreeDomain) => void;
    setLevel: (level: Level) => void;
}

export default function CurrentCGPADashboard({
    domain,
    level,
    userGrades,
    updateGrade,
    setDomain,
    setLevel
}: Props) {
    const currentViewCourses = useMemo(() => {
        const officialList = CURRICULUM[domain][level];

        return officialList.map((c: CurriculumCourse) => ({
            id: `${domain}-${level}-${c.name}`,
            name: c.name,
            credits: c.credits,
            level: level,
            domain: domain,
            cluster: c.cluster,
            grade: userGrades[domain][c.name] ?? null
        }));
    }, [domain, level, userGrades]);

    const stats = useMemo(() => {
        const completed: Course[] = [];
        (['Foundation', 'Diploma', 'BSc Degree', 'BS Degree'] as Level[]).forEach((l: Level) => {
            CURRICULUM[domain][l].forEach((c: CurriculumCourse) => {
                const g = userGrades[domain][c.name];
                if (g && ['S', 'A', 'B', 'C', 'D', 'E'].includes(g)) {
                    completed.push({
                        id: `c-${c.name}`,
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
        return calculateCGPA(completed);
    }, [domain, userGrades]);

    return (
        <div className="space-y-12">
            {/* Stats Summary - Namdapha Crimson Theme */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card className="lg:col-span-2 border-none bg-primary text-white rounded-[3rem] shadow-2xl shadow-primary/20 overflow-hidden relative p-4">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -mr-24 -mt-24"></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Current Performance Index</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-10 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-4">
                                <span className="text-8xl font-black tracking-tighter">{stats.cgpa}</span>
                                <div className="space-y-1">
                                    <p className="text-xl font-bold text-white/90">CGPA</p>
                                    <p className="text-xs font-black uppercase tracking-widest text-white/50">{stats.courseCount} Subjects Logged</p>
                                </div>
                            </div>
                            <div className="hidden md:flex bg-white/10 p-4 rounded-[2rem] backdrop-blur-md border border-white/10 items-center gap-4">
                                <div className="text-right">
                                    <p className="text-2xl font-black">{stats.totalCredits}</p>
                                    <p className="text-[10px] font-black uppercase tracking-tight text-white/50">Total Credits</p>
                                </div>
                                <div className="w-px h-10 bg-white/20"></div>
                                <div className="text-left">
                                    <p className="text-2xl font-black">{stats.totalGradePoints}</p>
                                    <p className="text-[10px] font-black uppercase tracking-tight text-white/50">Points</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters / Selectors - Redesigned Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 space-y-4 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Filter className="w-4 h-4 text-primary" />
                            </div>
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Program Selection</Label>
                        </div>
                        <Select value={domain} onValueChange={(v: DegreeDomain) => setDomain(v)}>
                            <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:bg-white hover:border-primary/20 transition-all font-black text-sm px-6">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="Data Science" className="font-bold py-3">Data Science</SelectItem>
                                <SelectItem value="Electronic Systems" className="font-bold py-3">Electronic Systems</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 space-y-4 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <BookOpen className="w-4 h-4 text-primary" />
                            </div>
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Progress Stage</Label>
                        </div>
                        <Select value={level} onValueChange={(v: Level) => setLevel(v)}>
                            <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:bg-white hover:border-primary/20 transition-all font-black text-sm px-6">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="Foundation" className="font-bold py-3 text-sm italic">Foundation Level</SelectItem>
                                <SelectItem value="Diploma" className="font-bold py-3 text-sm italic">Diploma Level</SelectItem>
                                <SelectItem value="BSc Degree" className="font-bold py-3 text-sm italic">BSc Degree</SelectItem>
                                <SelectItem value="BS Degree" className="font-bold py-3 text-sm italic">BS Degree</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Course Table - Redesigned for Clarity and Impact */}
            <Card className="rounded-[3rem] border-none shadow-3xl shadow-slate-200/40 overflow-hidden bg-white">
                <CardHeader className="p-10 pb-6 border-b border-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-primary rounded-3xl shadow-xl shadow-primary/20">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">{level} Subject Registry</CardTitle>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Official Curricular Tracking</p>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-900">{Math.round((stats.courseCount / currentViewCourses.length) * 100)}%</span>
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${(stats.courseCount / currentViewCourses.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/70 border-b border-slate-100">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[450px] pl-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Curricular Course</TableHead>
                                    <TableHead className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Credits</TableHead>
                                    <TableHead className="text-right pr-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Record</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {currentViewCourses.map((course: Course, idx: number) => (
                                        <motion.tr
                                            key={course.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group border-b border-slate-50 hover:bg-slate-50/50 transition-all"
                                        >
                                            <TableCell className="pl-10 py-7">
                                                <div className="flex items-center gap-4">
                                                    {course.grade ? (
                                                        <div className="bg-emerald-100 p-2 rounded-xl">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-slate-100 p-2 rounded-xl">
                                                            <Circle className="w-4 h-4 text-slate-300" />
                                                        </div>
                                                    )}
                                                    <div className="space-y-1">
                                                        <span className={`block text-base font-black tracking-tight ${course.grade ? 'text-slate-900' : 'text-slate-400'}`}>
                                                            {course.name}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{course.cluster}</p>
                                                            {course.credits > 4 && <span className="bg-orange-100 text-orange-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">High Load</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-sm font-black text-slate-600">{course.credits}</span>
                                                <p className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">Points</p>
                                            </TableCell>
                                            <TableCell className="text-right pr-10">
                                                <Select
                                                    value={course.grade ?? "not_taken"}
                                                    onValueChange={(v: string) => updateGrade(course.name, v === "not_taken" ? null : v as Grade)}
                                                >
                                                    <SelectTrigger className={`w-40 h-12 ml-auto border-2 rounded-2xl focus:ring-4 focus:ring-primary/10 font-black text-xs transition-all ${course.grade ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'}`}>
                                                        <SelectValue placeholder="Not Taken" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-[2rem] border-slate-100 shadow-3xl p-2">
                                                        <SelectItem value="not_taken" className="text-slate-400 italic py-3 rounded-xl">Academic Pending</SelectItem>
                                                        <SelectGroup className="mt-2 space-y-1">
                                                            {['S', 'A', 'B', 'C', 'D', 'E'].map((g: string) => (
                                                                <SelectItem key={g} value={g} className="font-black py-3 rounded-xl hover:bg-slate-50">
                                                                    Grade {g} <span className="ml-2 text-[10px] font-bold opacity-40">({GRADE_POINTS[g as Exclude<Grade, null>]} Points)</span>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                        <hr className="my-2 border-slate-50" />
                                                        <SelectGroup className="space-y-1">
                                                            {['U', 'I', 'W'].map((g: string) => (
                                                                <SelectItem key={g} value={g} className="text-slate-400 italic py-3 rounded-xl hover:bg-slate-50">
                                                                    {g === 'U' ? 'Course Failed' : g === 'I' ? 'Incomplete' : 'Withdrawn'}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
