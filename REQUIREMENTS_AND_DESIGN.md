# Requirement Specification & Design
**Project:** Valkyrie Archery Performance (CS180 Final Project)
**Author:** Tony Liu

## 1. Project Overview
Valkyrie Archery Performance is a technical training suite for competitive archers. It provides precision toolsets for equipment tuning (Arrow Spine Calculator) and performance tracking (Session Logging).

## 2. Architectural Design
The application follows a strict separation of concerns as required by the CS180 guidelines.

### A. Interface Layer (The Front-End)
*   **Technologies:** React 18, Tailwind CSS, Lucide Icons, Framer Motion.
*   **Components:** 
    *   `Dashboard.tsx`: Data visualization and session history overview.
    *   `ArrowGuider.tsx`: The primary interaction engine for equipment tuning.
    *   `Layout.tsx`: Handles navigation, theme switching (Light/Dark), and user state.
*   **Responsiveness:** Fluid layout designed for both field use (mobile) and post-session analysis (tablet/desktop).

### B. Engine Layer (The Logic)
*   **Technologies:** TypeScript, `archerUtils.ts`.
*   **Core Logic:** 
    *   **Dynamic Spine Calculation:** A complex multi-variate formula that adjusts base shaft stiffness based on draw weight, shaft length, point weight, and bow efficiency (Traditional vs Recurve vs Compound).
    *   **Safety Guards:** Logic checks to ensure arrow lengths are safe for specific draw lengths.
    *   **Trend Analysis:** Calculation of rolling averages and accuracy trends.

### C. Storage Layer (The Data)
*   **Technologies:** Firebase Firestore, Firebase Auth.
*   **Implementation:**
    *   `firebase-blueprint.json`: Defines the data schema for User Profiles and Training Sessions.
    *   `firestore.rules`: Implement Attribute-Based Access Control (ABAC) to ensure archers can only read/write their own tactical data.
    *   **Persistence:** Local caching combined with Firestore synchronization for offline-first reliability.

## 3. Requirement Specification
1.  **User Authentication:** Secure Google-based login.
2.  **Equipment Tuning:** Precise calculation of arrow spine requirements to prevent equipment failure.
3.  **Technical Logging:** Ability to log shot counts, averages, and environmental factors.
4.  **Visual Analytics:** Recharts integration for tracking performance over time.
5.  **Theme Adaptation:** Day/Night mode toggles for different lighting conditions at the range.
