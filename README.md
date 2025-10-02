<h1 align="center">
  <br>
  <img src="https://media.discordapp.net/attachments/1105128667404849212/1423290455063527485/image-removebg-preview.png?ex=68dfc607&is=68de7487&hm=468322d894bde3cb6d4c4a67ece2e23d0e1e7622ca6b3c1988f89170a071c723&=&format=webp&quality=lossless&width=604&height=358" alt="Echo Logo" width="120">
  <br>
  Echo
  <br>
</h1>

<h4 align="center">Reimagining WiFi Sharing with Blockchain & DePIN, powered by <a href="https://u2u.xyz" target="_blank">U2U Network</a>.</h4>

<p align="center">
  <a href="https://github.com/echo-project/echo">
    <img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build Status">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="https://u2u.xyz">
    <img src="https://img.shields.io/badge/blockchain-U2U-purple.svg" alt="U2U Blockchain">
  </a>
</p>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#the-problem">The Problem</a> •
  <a href="#solution">Solution</a> •
  <a href="#impact">Impact</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#running-the-demo">Running the Demo</a> •
  <a href="#license">License</a>
</p>

---

## Introduction  
Echo is a **DePIN (Decentralized Physical Infrastructure Network) project** built on the **U2U blockchain**, transforming idle WiFi hotspots into a decentralized, incentivized global network.  

By combining on-chain transparency, smart-contract access, and reward distribution, Echo makes connectivity a **shared resource and a community-driven digital economy**.  

---

## The Problem ❌  
- **Trust & Transparency** → Users hesitate to connect to unknown hotspots due to security risks.  
- **No Incentives** → Hotspot owners gain nothing by sharing bandwidth.  
- **Fragmented Access** → Roaming fees and multiple accounts create friction.  
- **Centralization** → Telecom monopolies drive high costs with little benefit to end-users.  

---

## Solution ✅  
- **On-chain WiFi Registry** → Transparent hotspot registration.  
- **Voucher & Access Control** → Smart contract–based authentication.  
- **Incentivized Sharing** → Providers earn rewards for bandwidth usage.  
- **Seamless Global Access** → Borderless, low-cost WiFi.  

---

## Impact 🌍  
- **Digital Inclusion** → Affordable internet for underserved communities.  
- **New Income Streams** → Providers monetize unused bandwidth.  
- **DePIN Growth** → Strengthens decentralized infrastructure powered by U2U.  

---

## Key Features 🚀  
- Transparent **on-chain WiFi registry**.  
- **Voucher-based authentication** via smart contracts.  
- **Automatic reward distribution** to hotspot providers.  
- **Unified, borderless connectivity** for users.  

---

## Tech Stack 🛠  
- **Smart Contracts**: Solidity, Hardhat, U2U blockchain  
- **Frontend**: React, Vite, TailwindCSS, Wagmi, RainbowKit  
- **Backend**: Node.js, Express, Ethers.js  
- **Infrastructure**: OpenWRT routers, Captive Portal API, Voucher system  

---

## Getting Started ⚡

### Prerequisites

- **Node.js** (v16+)
- **npm** (v8+)
- **Git**
- **Hardhat** (for smart contract deployment)
- **MetaMask** (configured for U2U testnet)
- **OpenWRT-compatible router** (e.g., TP-Link, GL.iNet) for physical WiFi integration
- **MicroSD card** (optional, for router storage)

### Clone the Repository
```bash
git clone https://github.com/<your-username>/echo.git
cd echo
npm install
```

Project Structure 📂
```bash
echo/
 ├── backend/        # API & Captive Portal service
 ├── contract/       # Smart contracts (WifiRegistry.sol, deployment scripts)
 ├── frontend/       # Web application
 └── README.md       # Project documentation
 ```

## ⚡ Running the Demo  

### 🔹 Hotspot Providers  
1. **Register Hotspot** → Register your hotspot via the frontend or CLI.  
2. **Mint Vouchers** → Mint vouchers for WiFi access.  
3. **Earn Rewards** → Earn rewards automatically for shared bandwidth.  

### 🔹 WiFi Users  
1. **Connect** → Connect to an Echo-enabled WiFi network.  
2. **Enter Voucher** → Enter a voucher code in the captive portal.  
3. **Redeem** → Redeem the voucher for time-limited WiFi access.  

⚠️ **Note:** Make sure **MetaMask** is connected to the **U2U Testnet** before running the demo.  

---

## 🎥 Demo Video  
👉 Watch the full demo on YouTube:  
[**Echo Demo on YouTube**](https://youtu.be/U7cGpSsPu70)  

---

 License 📜

This project is licensed under the MIT License – see the LICENSE
 file for details.
