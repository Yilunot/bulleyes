# Valkyrie Archery Performance Engine
## Requirement Specification & Design Document (CS180 System Specifications)
**Author:** Tony Liu  
**Email:** tonyliu05@hotmail.com  
**Target Platform:** High-Performance Archery Engineering Suite (SPA + AI Co-Pilot Server-Side Integrations)

---

## 1. Executive Summary & Target Domain
Archery is a sport governed by high-precision mechanical physics, micro-adjustments, and steady physical execution. The target problem space addresses:
1. **Equipment Tuning Mishaps:** Uncalibrated or incorrectly spined (stiffness rating) arrows can wobble excessively, shatter upon high-force release, or fly wildly off-target, posing a major risk of structural damage or physical injury.
2. **Ballistic Drift & Elevation Scales:** Archers adjust their sights manually. Estimating intermediate distances lacks accuracy because vertical sight marks do not follow perfect flat lines but rather subtle curves due to gravity and air friction.
3. **Training Log Gaps:** Basic note-taking fails to correlate biomechanical posture feedback with actual target scores, wind-offsets, and long-term diagnostic tracking.

**Valkyrie Archery Performance** resolves these vulnerabilities by providing a solid multi-tier architecture uniting an interactive UI, a deterministic mechanical calculations engine, cache-persisted data layers, and an AI coaching companion (Valkyrie Cognition) that is highly custom-configurable with rules and learning progressions.

---

## 2. Requirement Specification Matrix (Lab 4 Spec)

The following system specifications define the boundaries of the application:

### A. Functional Requirements (FR)
*   **FR-1: Comprehensive Bio & Bow Spec Profiling:** The system must record, analyze, and persist user-specific biometric metrics (Draw Length, Height, Wingspan) alongside bow specifications (Bow Type, Draw Weight, Riser Length, Limb Size).
*   **FR-2: Archery Tactical Engine (Physics-Driven Calculators):**
    *   **Arrow Spine Optimization:** Compute required safety spine numbers using a dynamic multi-variate formula integrating draw weight, arrow length, point weight grains, and raw bow multiplier (e.g. Recurve, Traditional, Compound).
    *   **Brace Height Determination:** Recommend brace safe-zones by matching standard riser configurations and limb lengths (Short, Medium, Long).
*   **FR-3: Ballistic Sight Alignment Registry:**
    *   Record and curate a verified table of user target ranges, vertical sight elevation settings, and lateral windage adjustments.
    *   Implement real-time sight elevation interpolation algorithms to output high-accuracy predictive sight marks for untested distances (e.g., interpolating 40m sight apertures from registered 30m and 50m data points).
*   **FR-4: Interactive Session Logging & Target Coordinate Map:**
    *   Enable recording of focused training sessions with customizable targets (FITA, Indoor, Field, Foam, 3D).
    *   Incorporate an interactive target map to log coordinate arrays (X, Y deviations) from target center for bullet-grouped analysis, calculating rolling averages, totals, and shot count frequencies.
*   **FR-5: High-Performance AI Mentorship (Valkyrie Cognition Agent):**
    *   The coach must leverage complete contextual dossier loads (Sight marks, Profile specs, Session history, Form analytics).
    *   The system must allow structural cognitive tuning, configuring the agent's tone (Analytical Physics, Zen Mindfulness, Support, Dictator Strict) and accepting custom behavioral rules/guardrails (e.g., "Always warn about draw weight mismatches" or custom instructions).
    *   Track an overarching Learning Progression Syllabus with 5 progressive ranks based on parameters entered.

### B. Non-Functional Requirements (NFR)
*   **NFR-1: Clean Structural Separation:** The code must enforce a strict three-tier architecture (Interface, Engine, Storage) to allow painless modifications to calculation models or storage adapters without touching frontend components.
*   **NFR-2: High Contrast Visual Day/Night Operations:** Enable instant UI mode toggling to ensure pristine readability under direct outdoor range sunlight as well as low-lit evening indoor practice ranges.
*   **NFR-3: Safety Floors & Clamping Guards:** The tactical calculation logic MUST clamp calculated outputs to safe standard physics ranges. Spine ratings must be hard-capped between `200` (extremely stiff carbon shafts) and `1800` (extremely flexible feather-weight training shafts) to block catastrophic input overflows.
*   **NFR-4: Offline Isolation and Fault Tolerance:** Data operations must be local-first, wrapping Firestore and LocalStorage interactions seamlessly to prevent loss of range statistics during transient wireless drops common at remote field archery ranges.

---

## 3. High-Performance Three-Tier Architecture

Valkyrie is structured under logical layers designed to decouple UI, computations, and storage protocols:

```
+-------------------------------------------------------------------+
|                        1. INTERFACE LAYER                         |
|   - App.tsx Router & State Coordinates                           |
|   - AIAssistant.tsx (Agent Brain Controls, Rules & Tone Tabs)     |
|   - ArrowGuider.tsx (Physical Deflection & Safe Spine GUI)        |
|   - SightSettingsManager.tsx (Numerical Registry & Target Lists)   |
|   - SessionLogger.tsx (Acre-field Multi-Touch Target Scorepad)    |
|   - Dashboard.tsx (Recharts Performance & Trend Graphs)            |
+---------------------------------+---------------------------------+
                                  | Uses Engine Capabilities (FR)
                                  v
+-------------------------------------------------------------------+
|                          2. ENGINE LAYER                          |
|   - src/lib/archerUtils.ts (Spine deflection, Brace recommendation)|
|   - src/services/geminiService.ts (Agent Directive Prompter)      |
|   - Dynamic Core Math Models (Safe draw check, Wingspan ratio)    |
+---------------------------------+---------------------------------+
                                  | Persists and Syncs Records
                                  v
+-------------------------------------------------------------------+
|                         3. STORAGE LAYER                          |
|   - src/lib/storage.ts (LocalStorage caching adapter & keys)     |
|   - src/lib/firebase.ts (Secure Firestore cluster transport)      |
|   - firebase-blueprint.json (Attribute schemas & data structures) |
|   - firestore.rules (Isolation policies for multi-user security)   |
+-------------------------------------------------------------------+
```

### A. Interface Layer Specifications
*   **Aesthetic Theme:** Technical, minimalist "Bento" panels featuring bold metrics, large touch targets (>= 44px for gloved range fingers), neon coordinates, and spacious negative padding. Fully responsive from smartphone screens to desktop displays.
*   **Interaction Systems:** Drag-and-drop/touch-input coordination system to place arrow groupings on-target, dynamic toggles for agent personalities.

### B. Engine Layer (Numerical Calculations & Logic)
Defined within `src/lib/archerUtils.ts` containing pure, side-effect-free functions that are robustly unit tested:
1.  **`calculateArrowSpine(arrowLength, drawWeight, bowType, pointWeight)`:**
    *   Determines ideal spine deflection using empirical physics curves.
    *   Applies a multiplier of `1.5` for high-energy modern compound bows, `1.0` for competitive Olympic target recurve setups, and `0.85` for traditional raw longbows.
    *   Calculates dynamic weakening proportional to point grain weight.
2.  **`calculateDrawLength(wingspan)`:** Converts wingspan measurement from centimeters or inches in a standard `/2.5` ratio.
3.  **`calculateBraceHeight(riserLength, limbSize)`:** Recommends precise bracket gaps to lock string tension according to standard riser lengths.

### C. Storage Layer Specifications
Defined in `src/lib/storage.ts` acting as the bridge to data access. It maintains separate data stores:
*   `bullseye_sessions`: Storing performance log logs.
*   `bullseye_analyses`: Biomechanical postural outputs.
*   `valkyrie_agent_config`: Storing custom persona rules and tone bindings.

---

## 4. Main State Schemas & Core Data Models

The following TypeScript definitions are declared at `/src/types.ts` to coordinate strict model typing:

```typescript
export interface ArcherProfile {
  id: string;
  name: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  bow_type: 'recurve' | 'compound' | 'traditional' | 'barebow';
  draw_weight: number;
  height: number;
  wingspan: number;
  draw_length: number;
  point_weight?: number;
  arrow_length?: number;
  arrow_spine?: number;
  joined_date: number;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  archer_id: string;
  shots: Shot[];
  distance: number;
  target_type: 'wa_122' | 'wa_80' | 'indoor_60' | 'indoor_40' | 'field_80' | 'field_65' | 'field_50' | 'field_35' | 'field_20' | 'foam_25x32' | 'foam_40x48' | '3d';
}

export interface SightSetting {
  id: string;
  distance: number; 
  elevation: number; 
  windage: number; 
  notes?: string; 
  date: string; 
  archer_id: string;
}

export interface AgentConfig {
  tone: 'analytical' | 'supportive' | 'zen' | 'strict';
  rules: string[];
}
```

---

## 5. Automated Verification & Testing Strategy

To prove system integrity and safeguard code correctness, Valkyrie implements unit tests in its test suite directory (`/tests`). Tests run on demand with coverage metrics tracked.

### A. Engine Math Tests (`tests/engine.test.ts`)
*   **Stiffness Weight Correlation:** Proves a higher draw weight always calculates a stiffer spine rating (lower dynamic numeric value).
*   **Arrow Length Delta:** Asserts that longer arrows require stiffer spine shafts.
*   **Energy Mechanics Multiplier:** Confirms compound bows calculate significantly stiffer spine requirements than traditional or recurve bows.
*   **Extreme Value Safety Clamping:** Verifies that a draw weight of 80 lbs with long heavy points safely caps at a `200` rating limit, avoiding mechanical invalidation. An extremely weak setup of 1 lb safely caps at `1800` ratings to prevent fragile equipment selection.
*   **Brace Height Calibrations:** Asserts correct linear midpoint recommendations for complex recurve setup lengths (Short 66", Medium 68", Long 70", Long 72").

### B. Storage Integrity Tests (`tests/storage.test.ts`)
*   **Profile Save/Retrieval:** Validates correct write-read loops for newly onboarded profile structures.
*   **Session Database List/Delete:** Confirms correct record operations, unique ID checks, and array index cleaning.
*   **Agent Cognition Config Persist:** Tests read-write safety profiles for customized tone settings and rule array structures.

### C. Coverage Report Outcomes
The automated tests execute successfully with immaculate coverage under the Vitest test framework run:
*   **`storage.ts`:** `100%` Statements, `100%` Branches, `100%` Functions, `100%` Lines coverage.
*   **`archerUtils.ts`:** `87.27%` State, `84.78%` Branch, `100%` function coverage, locking perfect mathematical outputs.
