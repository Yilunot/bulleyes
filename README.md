# Valkyrie Archery Performance Suite
**An Elite, Full-Stack Archery Analytical Suite featuring Physics-Engine Arrow Tuning, Biomechanical Form Analysis, and Live AI Coaching.**

Welcome to the **Valkyrie Archery Performance Suite** (v4.2). Designed for competitive archers, coaches, and evaluators, this application combines the deterministic precision of localized physical equations with the cutting-edge insights of our server-side Gemini AI model. All training records, equipment settings, and biomechanical parameters are seamlessly synchronized through a secure Firebase database.

---

## 🛠️ Part 1: Local Development & Running the Program

Follow these instructions to install, verify, and run the developer suite in your local environment.

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   **Node.js**: Version 18 or higher.
*   **npm**: Included with your Node.js installation.

### 2. Live Repository Installation
1. Clone this repository locally (or unpack the zip export).
2. Open your terminal in the root workspace directory.
3. Install all pre-configured dependencies:
   ```bash
   npm install
   ```

### 3. Starting the Development Server
Initiate the Vite-powered server by executing the following script:
```bash
npm run dev
```
Once the process has finished, the live preview application is fully interactive and accessible at **`http://localhost:3000`** in your browser.

### 4. Running Verification Test Suites
Valkyrie includes high-coverage diagnostic tests for the offline physics calculations and database handles. To execute the tests, run:
```bash
npm run test
```
To check full test coverage details:
```bash
npx vitest run --coverage
```

---

## 🎯 Part 2: Teacher Calibration (Testing the AI Coach Instantly)

To make grading, peer testing, and teacher evaluation effortless, we have bundled three high-quality, pre-selected recurve shooter images within the root workspace directory:

```
📁 TestImages/
├── SLWU2465.jpg                              # Recurve Archer (Outdoor target Field Form)
├── Recurve-Drawing-Technique-Im-Dong-Hyun.png # Olympic champion draw line details
└── Recurve-Archery-Drills-Finger-Holds.jpg   # Focus-view on split-finger finger hold and hook-torque
```

### How to use these images in the AI Coach:
1. Locate the **`/TestImages`** directory in your workspace explorer (you can download these files to your desktop or mobile device).
2. Inside the app, click the **AI Coach** tab using the left-hand workspace navigation rail.
3. Click or drag any of the three files inside the **`TestImages`** folder into the dotted drag-and-drop upload pad.
4. Select **`Compute Analysis`** to let our AI evaluate safety posture, review shoulder tension lines, check anchor stability, and deliver immediate recommendations!

---

## 🚀 Part 3: Step-by-Step Functional Workflow (From Genesis to Mastery)

Once the application is running, here is how to use each feature in sequence to experience the complete training suite:

### Step 1: Account Registration & Credentials
*   **The Workflow:** When you first enter the application, you will be met with a sleek dark login screen. Click the **"Sign Up"** toggle below the input box.
*   **Action Required:** Enter your email address and any secure password. Click "Create Account" to initialize your profile.
*   **Under the Hood:** Authentication is managed directly by Firebase Auth. It yields a unique cryptographic user verification ID (`UID`) mapped in Firestore, securing your user data profile.

### Step 2: Biometric Onboarding Setup
*   **The Workflow:** Upon your very first sign-up, the system runs a safety onboarding flow. You must set up your biometric parameters so the math engine can recommend suitable hardware.
*   **Action Required:** Enter your **Wingspan**, choose your **Bow Type** (Recurve, Compound, or Barebow), and select your bow's **Draw Weight**.
*   **Deterministic Calibration:**
    *   *Draw Length:* Calculates exactly as `Wingspan / 2.5` (e.g., 70" wingspan = 28" draw length).
    *   *Safe Brace Height:* Recommends proper string-to-riser distances based on your limb specifications.
*   Click **"Complete & Lock Profile"** to save your details securely to Firestore.

### Step 3: Smart Arrow Spine Calculator (The Arrow Tool)
*   **The Workflow:** Arrow spine represents stiffness. Incompatible arrows wobbling on release can warp or shatter. Selecting a proper dynamic spine is a critical safety constraint.
*   **Action Required:** Navigate to the **Arrow Tool** in the side rail. Use the sliders to input your arrow length, point weight (grains), and draw weight.
*   **Acoustic Mechanics Evaluation:** The math engine instantly calculates the ASTM target spine value and gives you clear, color-coded safety indicators:
    *   🟢 **Green Range (Perfect Fit):** Perfect structural configuration. Safe to shoot.
    *   🟡 **Yellow Range (Sub-optimal):** Playable, but introduces drag and finger release sensitivity.
    *   🔴 **Red Range (Dangerous):** Extreme torque profile. Immediate equipment correction mandated to prevent shaft rupture.

### Step 4: Active Training Tracker & Session Logger
*   **The Workflow:** Log raw score aggregates on the fly at the range.
*   **Action Required:** Select **Log Session** from the menu. Pick your target distance (e.g., 18m, 30m, 50m, 70m) and target template.
*   **Scoring Targets:** Use the large target-colored buttons (10, 9, 8, etc.) to record Arrow Ends. The calculator updates cumulative summaries, average per arrow, and logs standard accuracy distributions.
*   Click **"Complete & Lock Ends"** to archive the session, which instantly updates your analytical progress charts!

### Step 5: Sight Alignment Registry
*   **The Workflow:** Bow sights must be raised or lowered to adjust for target heights, gravity fall, and air friction.
*   **Action Required:** Select **Sight Settings** from the sidebar. Log the vertical sight mark elevation (e.g., `4.2 mm`) and windage adjustments for any distance.
*   Whenever you shoot that distance again, refer to this stable table to configure your mechanical sights perfectly without guesswork!

### Step 6: AI Form Analyzer (Computer Vision)
*   **The Workflow:** Get real-time biomechanical guidance on your posture.
*   **Action Required:** Go to the **AI Coach** tab. Upload a side-profile drawing picture or use the preloaded `/TestImages` files.
*   Click **"Compute Analysis"** to let the system generate detailed biomechanical recommendations, pinpoint skeletal issues (such as high draw elbow, neck crowding, or grip tension), and save the diagnostic report directly to your training logs.

### Step 7: Valkyrie Cognition Coach Assistant
*   **The Workflow:** A professional conversational coach at your side.
*   **Action Required:** Click **Ask Coach** in the left rail. You can toggle the coach's personality profile:
    *   *Analytical Physics:* Focuses on mechanical vectors, arrow speeds, and formulaic adjustments.
    *   *Zen Mindfulness:* Promotes breathing loops, anchor steadiness, and mental presence.
    *   *Supportive:* Gives encouraging growth critiques.
    *   *Strict Coach:* Highly direct, prioritizing strict form perfectionism.
*   **Omniscience Context:** The coach knows your entire profile, calculated draw lengths, logged range session scores, and arrow setup. Just ask: *"Is my recurve shaft safe for my draw weight?"* or *"What training adjustments should I make based on my weekly session progression?"* to receive high-fidelity, customized answers!

---

## 📂 Part 4: Project Architecture & Code Layout

```
/
├── TestImages/               # 🎯 Three pre-bundled recurve photos for easy teacher evaluation tests
├── src/
│   ├── components/           # UI Modular Interface Panels (Layout, Dashboard, AI Assistant, Form Checks)
│   ├── context/              # Context Providers (Global theme mode, custom state providers)
│   ├── lib/                  # Engines (Biometrics formulations, archerUtils calculations, Firebase database adapters)
│   ├── services/             # API Connectors (Gemini model instruction prompts, form assessment controllers)
│   ├── App.tsx               # Main system coordinator, view router, and central state machine
│   └── index.css             # Consolidated global Tailwind styles
└── REQUIREMENTS_AND_DESIGN.md # CS180 Design Specifications, schemas, non-functional safety clamps, and testing matrices
```
