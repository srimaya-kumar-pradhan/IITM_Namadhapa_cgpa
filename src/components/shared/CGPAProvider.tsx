'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DegreeDomain, Grade, Level } from '@/utils/cgpa';

type UserGrades = Record<DegreeDomain, Record<string, Grade>>;
type ManuelOverrides = Record<DegreeDomain, Record<string, Grade>>;

interface CGPAContextType {
    domain: DegreeDomain;
    setDomain: (domain: DegreeDomain) => void;
    level: Level;
    setLevel: (level: Level) => void;
    userGrades: UserGrades;
    updateGrade: (courseName: string, grade: Grade) => void;
    overrides: ManuelOverrides;
    updateOverride: (courseName: string, grade: Grade) => void;
    clearOverrides: () => void;
    isInitialized: boolean;
}

const CGPAContext = createContext<CGPAContextType | undefined>(undefined);

export function CGPAProvider({ children }: { children: ReactNode }) {
    const [domain, setDomain] = useState<DegreeDomain>('Data Science');
    const [level, setLevel] = useState<Level>('Foundation');
    const [userGrades, setUserGrades] = useState<UserGrades>({
        'Data Science': {},
        'Electronic Systems': {}
    });
    const [overrides, setOverrides] = useState<ManuelOverrides>({
        'Data Science': {},
        'Electronic Systems': {}
    });
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('iitm-cgpa-v16');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.userGrades) setUserGrades(parsed.userGrades);
                if (parsed.overrides) setOverrides(parsed.overrides);
                if (parsed.domain) setDomain(parsed.domain);
                if (parsed.level) setLevel(parsed.level);
            } catch (e) {
                console.error('Failed to load storage', e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('iitm-cgpa-v16', JSON.stringify({ userGrades, overrides, domain, level }));
        }
    }, [userGrades, overrides, domain, level, isInitialized]);

    const updateGrade = (courseName: string, grade: Grade) => {
        setUserGrades(prev => ({
            ...prev,
            [domain]: { ...prev[domain], [courseName]: grade }
        }));
    };

    const updateOverride = (courseName: string, grade: Grade) => {
        setOverrides(prev => ({
            ...prev,
            [domain]: { ...prev[domain], [courseName]: grade }
        }));
    };

    const clearOverrides = () => {
        setOverrides(prev => ({
            ...prev,
            [domain]: {}
        }));
    };

    return (
        <CGPAContext.Provider value={{
            domain, setDomain,
            level, setLevel,
            userGrades, updateGrade,
            overrides, updateOverride,
            clearOverrides,
            isInitialized
        }}>
            {children}
        </CGPAContext.Provider>
    );
}

export function useCGPA() {
    const context = useContext(CGPAContext);
    if (context === undefined) {
        throw new Error('useCGPA must be used within a CGPAProvider');
    }
    return context;
}
