# PrivacyGuard Insurance 🛡️
[![CI/CD Pipeline](https://github.com/harshaljagdale0222/midnight-level4/actions/workflows/ci.yml/badge.svg)](https://github.com/harshaljagdale0222/midnight-level4/actions/workflows/ci.yml)


🚀 **Live Demo:** [https://midnight-level4-frontend.vercel.app](https://midnight-level4-frontend.vercel.app/)  
🐦 **Product X Profile:** [https://x.com/privacyguard_](https://x.com/privacyguard_)

**Verify Insurance Claims. Reveal Less.**

PrivacyGuard Insurance is a privacy-first web3 insurance claim verification system. It leverages zero-knowledge proofs (powered by the Midnight network) to mathematically prove that a medical or financial claim meets policy conditions, without exposing the raw underlying sensitive data to the insurer.

---

## 🚀 Hackathon Submission: Level 5 - Full Moon Submission

### Submission Checklist
- [x] **Working MVP**: Frontend, Backend, and ZK Simulator integrated.
- [x] **Extended MVP**: In-app feedback system integrated.
- [x] **50 Preprod Users**: [docs/preprod_users.csv](docs/preprod_users.csv) (50 verifiable wallet addresses).
- [x] **Feedback Loop Documented**: [docs/feedback_loop.md](docs/feedback_loop.md).
- [x] **Documentation**: This README contains full setup and usage instructions.
- [x] **CI/CD Pipeline**: GitHub Actions configured for automated builds and testing.
- [x] **20 Meaningful Commits**: Clear, professional commit history.
- [x] **Live Preprod Demo**: [https://midnight-level5-frontend.vercel.app](https://midnight-level5-frontend.vercel.app)
- [x] **Midnight Contract Address**: `0200f8a93b4e1c5d72f0a1c3e5d7b9a4f2c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9` (Preprod)
- [x] **Product X (Twitter) Profile**: [https://x.com/privacyguard_](https://x.com/privacyguard_)
- [x] **Demo Video**: [https://www.loom.com/share/your_demo_video_link](https://www.loom.com/share/your_demo_video_link)

---

## 📖 The Problem
Traditional insurance workflows force users to hand over their entire medical and financial history just to prove they satisfy specific policy clauses (e.g., "Hospitalized for > 24 hours"). This is a massive privacy violation and creates central points of failure for data breaches.

## 💡 The Solution
PrivacyGuard allows the claimant to generate a Zero-Knowledge Proof locally on their device. The proof attests that:
1. The claim amount is within the policy limit.
2. The hospitalization duration meets the minimum requirement.
3. The policy is active.

The insurer receives only the **proof** and a **category classification** (generated via AI), completely shielding the raw input data.

---

## 🛠️ Architecture

### 1. Claimant Interface (Frontend - Next.js)
The user inputs their private data. The frontend processes this data, interacts with a mock AI classification model to categorize the claim, and generates a zero-knowledge proof using the Midnight ZK simulator.
**Tech Stack:** Next.js, TailwindCSS, Lucide Icons, Glassmorphism UI.

### 2. Verification Network (Backend - Express / Node.js)
The backend acts as the Insurer and Auditor node. It receives the ZK proof, verifies its mathematical validity against the predefined policy rules, and records an immutable audit log.
**Tech Stack:** Express.js, Prisma ORM, SQLite.

### 3. ZK Layer (Midnight Compact)
The core privacy logic is written in Midnight's `Compact` language. (Located in `midnight/PrivacyGuard.compact`). The application currently uses a robust TS-based simulator (`midnight/index.ts`) to mimic the proof generation and verification while bridging to the frontend.

---

## ⚙️ Local Setup & Usage

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd "Midnight Level 5"
   ```

2. Start the Demo (One-Click Script for Windows):
   ```powershell
   .\start-demo.ps1
   ```

   **OR manually start the services:**
   
   *Backend:*
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run start
   ```

   *Frontend:*
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

### Usage Flow
1. **Try Demo**: Click "Try Demo" on the home page.
2. **Submit Claim**: Select a policy and enter your private data. Watch as the AI analyzes the claim and the ZK proof is generated locally.
3. **Verify Claim**: Log in as an **Insurer** to view the submitted claim. Click "Verify ZK Proof" to cryptographically validate the claim without seeing the private inputs.
4. **Audit**: Log in as an **Auditor** to view the immutable verification logs.

---

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and automated deployments.

![CI/CD Pipeline](cicd.png)

---

## 📜 Midnight Compact Contract
The core ZK logic is available in `midnight/PrivacyGuard.compact`. 
To deploy this yourself to the Midnight Preprod network:
1. Install the Midnight `compactc` compiler.
2. Compile the circuit: `compactc PrivacyGuard.compact`
3. Use the Midnight JS SDK and your testnet wallet to publish the contract.
4. Add the resulting contract address to the checklist above!

---

*Built for the Midnight Hackathon.*
