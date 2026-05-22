# Valkyrie Archery Performance
**Professional Archery Suite with AI-powered Form Analysis and Equipment Tuning.**

---

## 🚀 Rubric Requirements Index
As per the CS180 Final Project guidelines, here are the paths to the required materials:

*   **Source Code Directory:** [`/src`](./src)
*   **Test Directory:** [`/tests`](./tests)
*   **Requirement Spec & Design Document:** [`REQUIREMENTS_AND_DESIGN.md`](./REQUIREMENTS_AND_DESIGN.md)
*   **Demo Video Link:** [Link to Demo Video (Replace with your YouTube/Drive Link)]
*   **Lab 5 Worksheet:** [`LAB5_WORKSHEET.md`](./LAB5_WORKSHEET.md)

---

## 🛠️ Setup & Execution Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### Installation
1.  Clone this repository locally.
2.  Install all dependencies:
    ```bash
    npm install
    ```

### Running the Application
To start the development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Running Tests
To execute the engine unit tests:
```bash
npm run test
```

---

## 🎯 Major Features
1.  **Smart Arrow Calculator:** Dynamic spine analysis based on archery physics.
2.  **Performance Dashboard:** Real-time data visualization of your training sessions.
3.  **Form Intel:** AI-driven coaching and form checks (Camera permissions required).
4.  **Bento-style UI:** A modern, technical interface with Day/Night operations.

## 🏛️ Architecture Highlights
*   **Engine:** Pure TypeScript logic for archery calculations (vibration nodes, spine deflections).
*   **Storage:** Firebase Firestore integration for persistent technical logging.
*   **Interface:** React + Framer Motion for a fluid, professional user experience.
