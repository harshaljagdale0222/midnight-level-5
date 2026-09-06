# Midnight Contract Deployment 🚀

This directory contains the REAL Midnight ZK Contract for PrivacyGuard, along with the actual deployment scripts for the **Midnight Preprod Network**.

## Why this is here
For the Level 4 Hackathon Submission, you need to prove that you can write, compile, and deploy a real Zero-Knowledge contract on Midnight. This folder provides everything you need to do exactly that, replacing any dummy/simulated data.

## Prerequisites
To deploy this yourself, you MUST install:
1. **Docker Desktop** (Required to run the Midnight `compactc` compiler image).
2. **Node.js v18+**.
3. A **Midnight 1AM or Lace Wallet** funded with testnet `tNIGHT` and `DUST`.

## Step-by-Step Deployment

### 1. Install Dependencies
Open your terminal in this folder and install the official Midnight SDKs:
```bash
cd midnight
npm install
```

### 2. Add your Wallet Seed
Create a `.env` file in this folder and add your Midnight Wallet seed phrase:
```
MIDNIGHT_WALLET_SEED="word1 word2 word3 ... word24"
```
*(Never share this seed phrase. Do not commit `.env` to GitHub.)*

### 3. Compile the Contract
Run the compiler using the Docker command we configured in `package.json`:
```bash
npm run compile
```
This will compile `PrivacyGuard.compact` and generate the JavaScript wrappers inside a new `/dist` folder.

### 4. Run the Deployment
Open `deploy.ts`. Uncomment the deployment logic block (Lines 37-47), then run:
```bash
npm run deploy
```

Once successful, the console will output your **Contract Address**. 
Copy this address and paste it into the main `README.md` for your Hackathon Submission!
