# HoneyChain - Complete Firebase Backend Production Setup Guide

This guide provides end-to-end instructions for deploying, configuring, and maintaining the production-ready Firebase backend for **HoneyChain**.

---

## 🌟 1. System Architecture Overview

```
                                  +-----------------------+
                                  |   HoneyChain Web App  |
                                  |   (React Single Page) |
                                  +-----------+-----------+
                                              |
                     +------------------------+------------------------+
                     |                        |                        |
            +--------v---------+    +---------v--------+    +----------v---------+
            |  Firebase Auth   |    |  Cloud Firestore |    |  Firebase Storage  |
            | (Phone OTP/Admin)|    |   (5 Collections)|    |  (QR Codes/Reports)|
            +------------------+    +---------+--------+    +--------------------+
                                              |
                                    +---------v--------+
                                    | Cloud Functions  |
                                    |  (Node.js 18)    |
                                    +------------------+
```

### User Roles & Permissions

| Role | Auth Method | Capabilities |
|---|---|---|
| **Beekeeper** | Phone Number + OTP | Register profile, create harvest batches, generate SHA-256 hash & QR code, view own batches |
| **Distributor** | Email / Phone | Log cold-chain transit, quality inspections, warehouse arrivals |
| **Retailer** | Email / Phone | Log retail store shelf placement, stock audits |
| **Customer** | **No Login Required** (Public) | Scan QR / enter batch ID, verify cryptographic provenance, inspect supply chain custody |
| **Admin** | Email + Password / Master Auth | View global dashboard metrics, manage actors and user roles, audit verification logs |

---

## 🗄️ 2. Cloud Firestore Database Collections

1. **`users`** (`userId` as doc ID):
   - `userId` *(string)*: Unique UID from Firebase Auth.
   - `name` *(string)*: Full name of the user.
   - `phone` *(string)*: Mobile number.
   - `role` *(string)*: `'beekeeper'` | `'distributor'` | `'retailer'` | `'customer'` | `'admin'`.
   - `createdAt` *(timestamp)*: Creation timestamp.

2. **`beekeepers`** (`beekeeperId` as doc ID, e.g. `BK-1042`):
   - `beekeeperId` *(string)*: Formatted Beekeeper ID.
   - `userId` *(string)*: Reference to `users/{userId}`.
   - `name` *(string)*: Beekeeper full name.
   - `farmLocation` *(string)*: Village or apiary geographical location.
   - `certification` *(string)*: Organic/FSSAI certification level.
   - `aadhaarMasked` *(string)*: Masked Aadhaar identifier.
   - `createdAt` *(timestamp)*: Timestamp.

3. **`honeyBatches`** (`batchId` as doc ID, e.g. `HC-8842`):
   - `batchId` *(string)*: Unique batch code.
   - `beekeeperId` *(string)*: Reference to Beekeeper.
   - `beekeeperName` *(string)*: Name of harvesting beekeeper.
   - `harvestDate` *(string)*: Date of harvest (`YYYY-MM-DD`).
   - `quantity` *(number)*: Kilograms harvested.
   - `qualityGrade` *(string)*: `'Good'` | `'Average'` | `'Retest'`.
   - `location` *(string)*: Apiary location.
   - `previousHash` *(string)*: SHA-256 hash of the previous batch (blockchain chain link).
   - `blockchainHash` *(string)*: Computed SHA-256 hash of this batch.
   - `qrCodeUrl` *(string)*: High-resolution QR code data URL.
   - `status` *(string)*: `'sealed'` | `'in-transit'` | `'retail'` | `'recalled'`.
   - `createdAt` *(timestamp)*: Server timestamp.

4. **`supplyChain`** (`eventId` as doc ID):
   - `eventId` *(string)*: e.g. `EVT-1001`.
   - `batchId` *(string)*: Reference to `honeyBatches`.
   - `actor` *(string)*: Actor or organization name.
   - `actorRole` *(string)*: `'beekeeper'` | `'distributor'` | `'retailer'` | `'admin'`.
   - `action` *(string)*: Milestone (e.g. `'Cold-Chain Transit Dispatched'`, `'Placed on Retail Shelf'`).
   - `location` *(string)*: Inspection / warehouse location.
   - `notes` *(string)*: Temperature, moisture test, seal numbers.
   - `timestamp` *(timestamp)*: Event timestamp.

5. **`verifications`** (`verificationId` as doc ID):
   - `verificationId` *(string)*: Unique verification log identifier.
   - `batchId` *(string)*: Batch code scanned or queried.
   - `verifiedAt` *(timestamp)*: Timestamp of customer verification.
   - `result` *(string)*: `'authentic'` | `'tampered'` | `'not_found'`.
   - `verificationMethod` *(string)*: `'qr_scan'` | `'manual_code'`.
   - `userAgent` *(string)*: Browser/device identifier for analytics.

---

## 🚀 3. Step-by-Step Deployment Instructions

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and enter project name (e.g. `honey-chain-production`).
3. Disable or enable Google Analytics according to your preference and click **Create Project**.

### Step 2: Enable Firebase Authentication
1. In the Firebase Console left menu, click **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - **Phone**: Click **Phone**, toggle **Enable**, and add test phone numbers (e.g. `+919876543210` with OTP `123456`) for testing without SMS charges.
   - **Email/Password**: Click **Email/Password**, toggle **Enable**, and save.

### Step 3: Create Cloud Firestore Database
1. Go to **Build > Firestore Database**.
2. Click **Create Database**.
3. Choose **Production mode** and select your closest cloud region (e.g. `asia-south1` for Mumbai or `us-central1`).
4. Click **Enable**.

### Step 4: Enable Firebase Storage
1. Go to **Build > Storage**.
2. Click **Get Started**, choose **Production mode**, and click **Done**.

### Step 5: Install Firebase CLI and Login
In your terminal (PowerShell / Command Prompt):
```powershell
npm install -g firebase-tools
firebase login
```

### Step 6: Link and Deploy the Backend
Navigate to your project directory:
```powershell
cd "c:\Users\Srinivas\OneDrive\Desktop\honey chain2"

# 1. Install Cloud Functions dependencies
cd functions
npm install
cd ..

# 2. Deploy Firestore Rules & Indexes
firebase deploy --only firestore

# 3. Deploy Storage Rules
firebase deploy --only storage

# 4. Deploy Cloud Functions
firebase deploy --only functions

# 5. Deploy Hosting (Optional / Production Web Deployment)
firebase deploy --only hosting
```

---

## ⚙️ 4. Connecting Your Frontend to Production Firebase

1. In the Firebase Console, click the **Settings Gear ⚙️ > Project settings**.
2. Under the **General** tab, scroll down to **Your apps** and click the **Web (</>)** icon.
3. Register your app (e.g. `HoneyChain Web`) and copy the `firebaseConfig` credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
4. You can connect it in two convenient ways:
   - **Option A (UI Modal)**: In the running HoneyChain website, click the **🔥 Firebase Ready** pill in the top header and paste your credentials.
   - **Option B (Direct Config)**: Open [services/firebaseConfig.js](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/services/firebaseConfig.js) and replace `DEFAULT_FIREBASE_CONFIG` with your production keys.

---

## 🔒 5. Production Security Verification

* **Firestore Security Rules** ([firestore.rules](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/firestore.rules)) strictly enforce:
  - Public read-only access for honey origin lookup and verification.
  - Authenticated write access for beekeepers to record batches.
  - Authorized write access for logistics actors to log supply chain milestones.
  - Public creation access for consumers to log verification audit events, with strict immutability (no one can delete or tamper with verification logs).
  - Admin-only access to user role management.

---

## 🧪 6. Local Testing with Firebase Emulators

To run and test the complete backend locally with full offline emulation:
```powershell
firebase emulators:start
```
The Firebase Emulator UI will be accessible at [http://localhost:4000](http://localhost:4000) with live Firestore, Auth, Functions, and Storage emulators.
