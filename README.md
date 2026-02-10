# IITM BS CGPA Calculator & Planner

A precision academic planning tool designed exclusively for students of the **IIT Madras BS Degree Program**. This application empowers students in both **Data Science & Applications** and **Electronic Systems** to accurately track their current academic standing, predict future performance, and simulate various grading scenarios to optimize their degree trajectory.

## 🎯 Problem Statement
Managing academic performance in a flexible, credit-based system like the IITM BS degree can be complex. Students often struggle with:
*   **Weighted Calculations**: Manually calculating CGPA across different credit weights (4 vs. 3 vs. 2 credits) is prone to error.
*   **Future Planning**: Understanding exactly what grades are needed in future terms to reach a target CGPA (e.g., >9.0 for Senate) is difficult without simulation.
*   **Grade Impact**: Visualizing how a single 'S' vs. 'A' grade affects the overall cumulative average is not intuitive.

This tool solves these problems by providing a rigorously tested, curriculum-aware calculator that handles the complexities of the grading system instantly and locally.

## ✨ Key Features

### 📊 Current CGPA Tracking
*   **Program Support**: Full curriculum support for both **BS in Data Science** and **BS in Electronic Systems**.
*   **Level Awareness**: Organize grades by **Foundation**, **Diploma**, **BSc Degree**, and **BS Degree** levels.
*   **Instant Calculation**: Real-time updates of CGPA, Total Credits, and Grade Points as you input grades.
*   **Official Grading**: Supports all official grades (S, A, B, C, D, E) and handles non-contributing statuses (U, I, W).

### 🔮 Predictive Modeling & "What-If" Analysis
*   **Scenario Simulation**: Select future subjects and interactively test how different grades will impact your final CGPA.
*   **Baseline Prediction**: Uses a weighted algorithm based on course difficulty clusters (Math, Programming, etc.) to suggest realistic grade outcomes.
*   **Target Setting**: See exactly how much your CGPA can rise (or fall) based on your next term's performance.

### 🎨 User Experience
*   **Privacy First**: **100% Client-Side**. No data is ever sent to a server. Your grades stay in your browser's local storage.
*   **Namdapha Theme**: A premium, "Glassmorphism" UI design inspired by the Namdapha House identity.
*   **Responsive**: Fully optimized for mobile phones, tablets, and desktops.
*   **Dark Mode**: Native support for both light and dark themes with high-contrast text.

## 🛠 Tech Stack & Constraints
This project was built with a strict focus on performance, type safety, and portability.

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Version 4)
*   **Animation**: Framer Motion
*   **State Management**: React Context API
*   **Architecture**:
    *   **No Backend**: Logic runs entirely in the browser.
    *   **No Database**: Persistence via `localStorage`.

## 📐 Calculation Logic
Calculations adhere strictly to the official IIT Madras BS Degree grading guidelines:
1.  **Credit Weighting**: `Sum(Grade Points * Course Credits) / Sum(Course Credits)`
2.  **Grade Points**:
    *   S = 10
    *   A = 9
    *   B = 8
    *   C = 7
    *   D = 6
    *   E = 4
    *   U/W/I = 0 (Excluded from CGPA calculation)
3.  **Course Exclusion**: Ungraded courses or those with 'Incomplete' status are automatically excluded from the denominator.

## 🚀 How to Run Locally

### Prerequisites
*   Node.js 18.17 or later
*   npm or yarn

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/srimaya-kumar-pradhan/IITM_Namadhapa_cgpa.git
    cd IITM_Namadhapa_cgpa
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment
The project is optimized for static deployment on **Vercel**.
*   **Live Demo**: [View Deployment](https://iitm-namadhapa-cgpa-c88nxk5vy-25f2008279-7142s-projects.vercel.app)
*   **CI/CD**: Automatic builds triggered via GitHub Actions on push to `main`.

## ⚠️ Disclaimer
This is a **student-built community tool** and is **not** an official application of IIT Madras.
*   While every effort has been made to ensure accuracy with the curriculum, official results should always be verified via the student portal.
*   Predictions are statistical estimates and do not guarantee future academic performance.

## 🤝 Contribution & License
This project is open-source under the **MIT License**.
Contributions are welcome! If you find a bug or want to add a feature (e.g., new electives), please open an issue or submit a pull request.
