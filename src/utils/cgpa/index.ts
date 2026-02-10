export type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'U' | 'W' | 'I' | 'I_OP' | 'I_PR' | null;

export type Level = 'Foundation' | 'Diploma' | 'BSc Degree' | 'BS Degree';
export type DegreeDomain = 'Data Science' | 'Electronic Systems';

export type SkillCluster =
    | 'English'
    | 'Mathematics'
    | 'Statistics'
    | 'Programming'
    | 'Database'
    | 'ML'
    | 'Business'
    | 'Electronics'
    | 'Systems'
    | 'Project'
    | 'General';

export const GRADE_POINTS: Record<Exclude<Grade, null>, number> = {
    'S': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6,
    'E': 4,
    'U': 0,
    'W': 0,
    'I': 0,
    'I_OP': 0,
    'I_PR': 0,
};

export interface Course {
    id: string;
    name: string;
    credits: number;
    level: Level;
    domain: DegreeDomain;
    cluster: SkillCluster;
    grade: Grade;
}

export type CurriculumCourse = { name: string; credits: number; cluster: SkillCluster };

export const CURRICULUM: Record<DegreeDomain, Record<Level, CurriculumCourse[]>> = {
    'Data Science': {
        'Foundation': [
            { name: 'English I', credits: 4, cluster: 'English' },
            { name: 'Mathematics for Data Science I', credits: 4, cluster: 'Mathematics' },
            { name: 'Statistics for Data Science I', credits: 4, cluster: 'Statistics' },
            { name: 'Computational Thinking', credits: 4, cluster: 'Programming' },
            { name: 'English II', credits: 4, cluster: 'English' },
            { name: 'Mathematics for Data Science II', credits: 4, cluster: 'Mathematics' },
            { name: 'Statistics for Data Science II', credits: 4, cluster: 'Statistics' },
            { name: 'Programming in Python', credits: 4, cluster: 'Programming' },
        ],
        'Diploma': [
            { name: 'Database Management Systems', credits: 4, cluster: 'Database' },
            { name: 'Modern Application Development I', credits: 4, cluster: 'Programming' },
            { name: 'Programming in Java', credits: 4, cluster: 'Programming' },
            { name: 'Machine Learning Foundations', credits: 4, cluster: 'ML' },
            { name: 'Business Data Management', credits: 4, cluster: 'Business' },
            { name: 'Modern Application Development II', credits: 4, cluster: 'Programming' },
            { name: 'Machine Learning Techniques', credits: 4, cluster: 'ML' },
            { name: 'Machine Learning Practice', credits: 4, cluster: 'ML' },
            { name: 'Diploma Project I (Programming)', credits: 4, cluster: 'Project' },
            { name: 'Diploma Project II (Data Science)', credits: 4, cluster: 'Project' },
        ],
        'BSc Degree': [
            { name: 'Software Engineering', credits: 4, cluster: 'Programming' },
            { name: 'Strategies for Professional Growth', credits: 4, cluster: 'Business' },
            { name: 'BSc Elective I', credits: 4, cluster: 'General' },
            { name: 'BSc Elective II', credits: 4, cluster: 'General' },
            { name: 'BSc Project', credits: 4, cluster: 'Project' },
        ],
        'BS Degree': [
            { name: 'BS Elective I', credits: 4, cluster: 'General' },
            { name: 'BS Elective II', credits: 4, cluster: 'General' },
            { name: 'BS Elective III', credits: 4, cluster: 'General' },
            { name: 'BS Elective IV', credits: 4, cluster: 'General' },
            { name: 'Capstone Project', credits: 6, cluster: 'Project' },
        ],
    },
    'Electronic Systems': {
        'Foundation': [
            { name: 'English I', credits: 3, cluster: 'English' },
            { name: 'Mathematics I for ES', credits: 4, cluster: 'Mathematics' },
            { name: 'Introduction to Electronic Systems', credits: 4, cluster: 'Electronics' },
            { name: 'Introduction to Programming', credits: 4, cluster: 'Programming' },
            { name: 'English II', credits: 3, cluster: 'English' },
            { name: 'Mathematics II for ES', credits: 4, cluster: 'Mathematics' },
            { name: 'Digital Systems', credits: 4, cluster: 'Electronics' },
            { name: 'Electrical Circuits', credits: 4, cluster: 'Electronics' },
        ],
        'Diploma': [
            { name: 'Electronic Circuits', credits: 4, cluster: 'Electronics' },
            { name: 'Signals and Systems', credits: 4, cluster: 'Systems' },
            { name: 'Microprocessors and Interfacing', credits: 4, cluster: 'Electronics' },
            { name: 'Control Systems', credits: 4, cluster: 'Systems' },
            { name: 'Embedded Systems', credits: 4, cluster: 'Systems' },
            { name: 'Digital Signal Processing', credits: 4, cluster: 'Systems' },
            { name: 'Diploma Project (Electronic Systems)', credits: 4, cluster: 'Project' },
        ],
        'BSc Degree': [
            { name: 'Electromagnetic Fields', credits: 4, cluster: 'Electronics' },
            { name: 'Communication Systems', credits: 4, cluster: 'Systems' },
            { name: 'BSc Elective I (ES)', credits: 4, cluster: 'General' },
            { name: 'BSc Project (ES)', credits: 4, cluster: 'Project' },
        ],
        'BS Degree': [
            { name: 'BS Elective I (ES)', credits: 4, cluster: 'General' },
            { name: 'BS Elective II (ES)', credits: 4, cluster: 'General' },
            { name: 'Advanced Embedded Systems', credits: 4, cluster: 'Systems' },
            { name: 'Capstone Project (ES)', credits: 6, cluster: 'Project' },
        ],
    },
};

export const RELATED_CLUSTERS: Record<SkillCluster, SkillCluster[]> = {
    'Mathematics': ['Statistics', 'ML', 'Electronics', 'Programming'],
    'Statistics': ['Mathematics', 'ML', 'Business'],
    'Programming': ['Database', 'ML', 'Systems', 'Mathematics'],
    'ML': ['Mathematics', 'Statistics', 'Programming', 'Database'],
    'Electronics': ['Mathematics', 'Systems', 'Programming'],
    'Systems': ['Electronics', 'Programming', 'Mathematics'],
    'Database': ['Programming', 'Business', 'ML'],
    'Business': ['Statistics', 'Database'],
    'English': ['General'],
    'Project': ['Programming', 'ML', 'Electronics', 'Systems'],
    'General': ['English']
};

export function calculateCGPA(courses: Course[]) {
    const validGrades: Exclude<Grade, null>[] = ['S', 'A', 'B', 'C', 'D', 'E'];
    const contributingCourses = courses.filter(c =>
        c.grade !== null && validGrades.includes(c.grade as Exclude<Grade, null>)
    );

    const totalGradePoints = contributingCourses.reduce((sum, c) => {
        const points = GRADE_POINTS[c.grade as Exclude<Grade, null>] || 0;
        return sum + (points * c.credits);
    }, 0);

    const totalCredits = contributingCourses.reduce((sum, c) => sum + c.credits, 0);
    const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    return {
        cgpa: Number(cgpa.toFixed(2)),
        totalCredits,
        totalGradePoints,
        courseCount: contributingCourses.length
    };
}

export interface PredictionResult {
    predictedGP: number;
    grade: Grade;
    confidence: number;
    influencers: { name: string; weight: number }[];
}

export const LEVEL_VALUE: Record<Level, number> = {
    'Foundation': 1,
    'Diploma': 2,
    'BSc Degree': 3,
    'BS Degree': 4
};

export function predictCoursePerformance(
    futureCourse: CurriculumCourse & { level: Level; domain: DegreeDomain },
    pastCourses: Course[],
    confidenceMode: number = 1.0
): PredictionResult {
    const completed = pastCourses.filter(c => c.grade !== null && ['S', 'A', 'B', 'C', 'D', 'E'].includes(c.grade as string));

    if (completed.length === 0) {
        return { predictedGP: 7.0, grade: 'C', confidence: 0, influencers: [] };
    }

    const weights = completed.map(p => {
        let cScore = 0.2;
        if (p.cluster === futureCourse.cluster) cScore = 1.0;
        else if (RELATED_CLUSTERS[futureCourse.cluster]?.includes(p.cluster)) cScore = 0.6;

        const pVal = LEVEL_VALUE[p.level];
        const fVal = LEVEL_VALUE[futureCourse.level];
        let lScore = 0.4;
        if (p.level === futureCourse.level) lScore = 1.0;
        else if (pVal < fVal) lScore = 1.0 - (fVal - pVal) * 0.2;
        else lScore = 0.4;

        const dScore = p.domain === futureCourse.domain ? 1.0 : 0.5;

        const w = (0.5 * cScore) + (0.3 * lScore) + (0.2 * dScore);
        return { p, w };
    });

    weights.sort((a, b) => b.w - a.w);
    const topInfluencers = weights.slice(0, 3);
    const totalW = weights.reduce((s, x) => s + x.w, 0);

    let predictedGP = weights.reduce((s, x) => s + (GRADE_POINTS[x.p.grade as Exclude<Grade, null>] * x.w), 0) / totalW;

    if (completed.length >= 4) {
        const firstHalf = completed.slice(0, Math.floor(completed.length / 2));
        const secondHalf = completed.slice(Math.floor(completed.length / 2));
        const avg1 = firstHalf.reduce((s, c) => s + GRADE_POINTS[c.grade as Exclude<Grade, null>], 0) / firstHalf.length;
        const avg2 = secondHalf.reduce((s, c) => s + GRADE_POINTS[c.grade as Exclude<Grade, null>], 0) / secondHalf.length;
        const trend = avg2 - avg1;
        predictedGP += 0.2 * trend;
    }

    predictedGP *= confidenceMode;
    predictedGP = Math.min(10, Math.max(4, predictedGP));

    const influencers = topInfluencers.map(i => ({
        name: i.p.name,
        weight: Math.round((i.w / topInfluencers.reduce((s, x) => s + x.w, 0)) * 100)
    }));

    return {
        predictedGP: Number(predictedGP.toFixed(2)),
        grade: mapGPToGrade(predictedGP),
        confidence: Math.min(100, Math.round((totalW / completed.length) * 100)),
        influencers
    };
}

function mapGPToGrade(gp: number): Grade {
    if (gp >= 9.5) return 'S';
    if (gp >= 8.5) return 'A';
    if (gp >= 7.5) return 'B';
    if (gp >= 6.5) return 'C';
    if (gp >= 5.5) return 'D';
    return 'E';
}
