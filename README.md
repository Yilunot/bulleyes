# Valkyrie Archery Performance Suite
**An Elite, Full-Stack Archery Analytical Suite featuring Physics-Engine Arrow Tuning, Biomechanical Form Analysis, and Live AI Coaching.**

Welcome to the **Valkyrie Archery Performance Suite** (v4.2). Designed for competitive archers, coaches, and evaluators, this application combines the deterministic precision of localized physical equations with the cutting-edge insights of our server-side Gemini AI model. All training records, equipment settings, and biomechanical parameters are seamlessly synchronized through a secure Firebase database.

---

## 🎯 Evaluator Quickstart: Testing the AI Coach

To make evaluation simple and instantaneous for players, teachers, and graders, we have bundled three high-quality test images within the workspace directory at the root project level:

```
📁 TestImages/
├── SLWU2465.jpg                              # Recurve Archer (Outdoor target Field Form)
├── Recurve-Drawing-Technique-Im-Dong-Hyun.png # Olympic champion draw line details
└── Recurve-Archery-Drills-Finger-Holds.jpg   # Focus-view on split-finger finger hold and hook-torque
```

### How to test the AI Coach in the app:
1. Locate the **`/TestImages`** directory in your explorer (or download the files to your local device).
2. Inside the app, navigate to the **AI Coach** tab using the left-hand workspace navigation rail.
3. Click or drag any of the files in the **`/TestImages`** folder into the dotted upload region.
4. Select **`Compute Analysis`** to let our server-side neural model grade the form, diagnose alignment faults, check shoulder tension lines, and render a personalized coaching card with actionable improvements.

---

## 🚀 Rubric Requirements & Navigation Index
As per the CS180/Project Guidelines, here are the paths to all vital repository components:

*   **Source Code Directory:** [`/src`](./src) — Contains all components, state providers, utilities, and assets.
*   **Engine & Physics Utility:** [`/src/lib/archerUtils.ts`](./src/lib/archerUtils.ts) — Holds pure, unit-tested calculations for draw length, spine dynamic deflection, and bow brace heights.
*   **Requirement Spec & Design Document:** [`REQUIREMENTS_AND_DESIGN.md`](./REQUIREMENTS_AND_DESIGN.md) — Comprehensive technical specs, schemas, and design constraints.
*   **Database Schema representation:** Check [`firebase-blueprint.json`](./firebase-blueprint.json) to inspect initial firestore setups and constraints.
*   **Security Access Policies:** Look into [`firestore.rules`](./firestore.rules) to check role-based document access.

---

## 🛠️ Step-by-Step Guide: How to Use the Application

This application handles step-by-step registration, custom arrow calculations, physical score sheets, and real-time guidance. Here is how to complete each workflow:

### 1. Registration & User Creation
*   **Creating an Account:** When you launch the app, you will be greeted by a dark, high-contrast **Login Screen**. To create a new user, click **"Sign Up"** underneath the input form. Enter your email and choose a secure password.
*   **Under the Hood:** Authentication is managed directly by Firebase Auth. It yields a unique cryptographic user verification ID (`UID`) mapped in Firestore, securing your user data profile.

### 2. Biometric Onboarding & Setup
*   **Step-by-step Setup:** Following a successful sign-up, the system automatically redirects you to the multi-step **Tactical Biometrics Onboarding screen**. 
*   **Inputs Required:** 
    *   *Wingspan (Inches):* Used to deterministically calculate your ideal physical Draw Length.
    *   *Bow Type:* Select Recurve, Compound, or Barebow (governs the target tension metrics).
    *   *Draw Weight (lbs):* The holding resistance peak.
*   **Physical Calculations:**
    *   `Draw Length` = Wingspan / 2.5
    *   `Ideal Brace Height` = Governed by bow geometry selection (e.g., Recurve targets 8.25", Compound targets 7.0").
*   Once saved, your profile document is locked in `users/{UID}/` in Firestore, and your user dashboard is unlocked!

### 3. Smart Arrow Spine Calculator (Arrow Tool)
*   **Purpose:** Arrow spine defines the stiffness or structural flex of an arrow shaft. Shooting an arrow with incorrect spine profile degrades accuracy and poses extreme safety hazards.
*   **How to Use:**
    *   Select the **"Arrow Tool"** from the navigation sidebar.
    *   Refine your specific variables: Draw Weight, Shaft Length (the physical cut of your arrows), and Point Weight (grains on the tip insert).
    *   Adjust sliders to see real-time updates of the **Target Spine Value**.
*   **The Physics Engine:** The calc calculates deflection nodes using localized ASTM standard conversions. It provides visual, color-coded status checks:
    *   🟢 **Green Range (Perfect Fit):** Shaft deflection holds an exact balance to brace vibration nodes.
    *   🟡 **Yellow Range (Sub-optimal):** Playable, but introduces drag and finger release sensitivity.
    *   🔴 **Red Range (Dangerous):** Extreme torque profile. Immediate equipment correction mandated.

### 4. Interactive Active Session Logger & Tally Cards
*   **How to Use:**
    *   Click **"Log Session"** in the navigation sidebar.
    *   Select your shooting distance (e.g., 18 Meters, 30 Meters, 50 Meters, or 70 Meters).
    *   The session is organized into "Ends" (sub-rounds of 3 or 6 arrows). For each arrow shot, tap on the circular target-colored scoring buttons (9, 10, X, and lower values) to log the point values value.
    *   An interactive digital scoresheet tallies your running total, average arrow score, and calculates standard accuracy ratios.
    *   Click **"Complete & Lock Ends"** to save to Firestore. Your logged training sheet is archived in `users/{UID}/sessions/{SessionID}` and instantly updates your historical dashboard charts!

### 5. Sight Calibration Archive
*   **Purpose:** Target archers manipulate elevation & windage on their bow sights depending on distance and atmospheric drag.
*   **How to Use:**
    *   Select **"Sight Settings"** in the navigation menu.
    *   Add Calibration: Select a distance (e.g. 18m, 30m, 50m) and log your exact vertical measurement setting mark (e.g., `4.2 mm`) and horizontal setting mark (e.g., `Left 1.5`).
    *   Now, whenever you return to shoot a specific distance, check your sight card table to instantly dial in your hardware.

### 6. Interactive AI Coach Chat Assistant
*   **How to Use:** 
    *   Navigate to **"Ask Coach"** (the AI Assistant tab).
    *   This is a highly situational chat agent powered by Gemini. You do not need to copy/paste your stats into the prompt! 
    *   The coach already possesses full secure context of your profile, calculated draw lengths, logged trainings, target sets, and sight calibrations.
    *   Ask questions like: *"How does my 18m session scores correlate with my compound draw weight?"* or *"Analyze my overall progression and suggest a weekly drill schedule."*
    *   Receive crisp, custom, professional guidance immediately.

---

## 📂 Project Architecture

```
/
├── TestImages/               # 🎯 Bundled Recurve Shooter Photographs for easy teacher evaluation
├── src/
│   ├── components/           # UI Elements (Layout, Dashboard, AI Assistant, Form Checks)
│   ├── context/              # Context Providers (Theme Mode, custom CSS theme tokens)
│   ├── lib/                  # Utilities (Biocodes, archerUtils formulas, Firestore adapters)
│   ├── services/             # API services (Gemini Integration, AI Form Evaluation engines)
│   ├── App.tsx               # Main runtime router and view state controller
│   └── index.css             # Unified tailwind stylesheet
└── REQUIREMENTS_AND_DESIGN.md # Detailed design principles, entity models, and schemas
```

---

## 🛠️ Local Development & Installation Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### Installation
1.  Clone this repository locally.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application
To start the standard vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Running Tests
To execute the unit tests verifying our archer mechanics, calculations, and formulas:
```bash
npm run test
```
