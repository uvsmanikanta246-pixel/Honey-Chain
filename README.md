# HoneyChain Design System

A shared, accessible design system specifically created for rural beekeepers with low digital literacy.

---

## 🎨 Core Design Rules

1. **Strict 3-Tone Color Palette**:
   - Primary Background: **Milky White** (`#FDFBF7`)
   - Text & Core Lines: **Dark Charcoal Brown** (`#3A2E26`)
   - Accent & Action: **Warm Orange** (`#E8892B`)
   - *Rule*: Absolutely no blue, green, red, or multi-accent gradients.

2. **Typography Hierarchy**:
   - Single Sans-Serif Font: `Plus Jakarta Sans` (with system fallbacks)
   - Minimum Body Size: `18px` (`1.125rem`), default body `20px` (`1.25rem`)
   - Headings: `28px+` (H1: `36px`, H2: `28px`)
   - Line-height: `1.65` for body, `1.35` for headings

3. **Layout & Visual Simplicity**:
   - **One primary action per screen**.
   - **No cards, no boxes, no drop shadows**.
   - Generous whitespace as the primary visual organizer instead of container boxes.
   - Max content container width: `520px` for optimal field readability.

4. **Buttons & Touch Targets**:
   - Extra-large touch targets (min-height `64px`) for outdoor use.
   - Large, full-width (or near-full-width) rounded buttons (`border-radius: 20px`).
   - Only **one primary button** per screen. Secondary actions are quiet text links.

5. **Iconography**:
   - Simple line icons only (`stroke-width: 2.2`).
   - **Always paired with explicit text labels** (never standalone icon buttons).

---

## 📁 Files Included

| File | Description |
| :--- | :--- |
| [`hashChain.js`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/hashChain.js) | Standalone SHA-256 cryptographic chain module (`createBatchHash`, `verifyChain`). |
| [`app.js`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/app.js) | Single-Page React Application with React Context, step wizard, & client routing. |
| [`index.html`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/index.html) | Main HTML container with React 18, Babel standalone, and hashChain script. |
| [`theme.css`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/theme.css) | Core CSS design tokens, typography scale, resets, and utility classes. |
| [`theme.js`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/theme.js) | JavaScript/TypeScript export of all design tokens for front-end frameworks. |
| [`style-guide.html`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/style-guide.html) | Interactive visual preview and living style guide showcasing all components and rules. |
| [`start.bat`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/start.bat) | Double-clickable Windows launcher to start the server and open your browser. |
| [`start.ps1`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/start.ps1) | PowerShell startup script for the preview server. |
| [`server.ps1`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/server.ps1) | Lightweight static web server running on port `3000`. |

---

## 📱 App Pages & Architecture

1. **Top Navigation Bar**: Single simple bar with large text labels (`Home`, `Register Beekeeper`, `Record Harvest`, `Verify Honey`), no icon-only items.
2. **Landing Page**: 
   - Short one-line headline: *"Pure Honey Provenance"*
   - Single plain-language sub-line
   - Minimalist honey beehive line illustration
   - Two large buttons only: **"I'm a Beekeeper"** and **"I'm a Consumer"**
3. **Beekeeper Registration Wizard (One Question Per Screen)**:
   - **Step 1**: Full Name
   - **Step 2**: Phone Number (10 digits)
   - **Step 3**: Aadhaar Number (12 digits with helper: *"This links your identity to your honey batches"*)
   - **Step 4**: Simulated OTP (6 digits, accepts any 6 digits)
   - **Step 5**: Apiary Location
   - **Confirmation**: Large checkmark, *"You are verified ✅"*, new Beekeeper ID, masked Aadhaar, and *"Aadhaar verification simulated for demo purposes."*
4. **Batch Entry Wizard (One Field Per Screen)**:
   - **Step 1**: Harvest Date (Large date picker)
   - **Step 2**: Quantity in kg (Large number input)
   - **Step 3**: Quality test result (Dropdown: *Good / Average / Needs Retest*)
   - **Step 4**: Apiary location (Auto-filled from beekeeper profile, editable)
   - **Final Result**: Large scannable QR code, text *"Your honey batch is now traceable"*, and a single **"Download QR"** button. Calls `createBatchHash()` with the previous batch's hash.
5. **Consumer Lookup (Calm & Clean Provenance View)**:
   - Single large input box: *"Enter or scan batch code"*
   - Single button: **"Track My Honey"**
   - Simple vertical list (no cards, no boxes, generous whitespace):
     - Beekeeper name with *"Verified via Aadhaar ✅"*
     - Apiary location
     - Harvest date
     - Quantity (kg)
     - Quality result (*Good / Average / Needs Retest*)
     - Cryptographic verification line: **"Chain Verified ✅"** or **"Issue Detected ⚠️"** via `verifyChain()`.

## 🎨 Aesthetic & Decorative Polish (Preserving Design System Rules)

1. **Artisan Honeycomb Background**: Faint, organic amber honeycomb dot pattern giving the milky white background a warm, tactile paper texture without clutter.
2. **Micro-Animations & Keyframes**:
   - Floating organic bee line illustration on the landing page (`@keyframes hcFloatBee`).
   - Smooth entrance transitions on wizard step changes (`@keyframes hcFadeIn`, `@keyframes hcSlideUp`).
   - Animated checkmarks that draw smoothly into view on verification screens (`.hc-animated-check`).
   - Soft pulsing live status indicator in the top navbar (`.hc-brand-dot`).
3. **Step Progress Dots**: Minimalist, high-contrast step dots (`StepTracker`) providing orientation across the 5-step registration and 4-step batch entry wizards.
4. **Camera Scan Viewfinder**: Simulated scan mode with animated golden laser line (`@keyframes hcLaserScan`) in Consumer Lookup to demo label scanning on physical honey jars.
5. **Tactile Button Press Feedback**: Subtle micro-press depth (`translateY`) with accessible warm-orange focus rings on all interactive inputs.

---

## 🖥️ How to Run on Localhost

### Option 1: Double-Click (Easiest)
Double-click [`start.bat`](file:///c:/Users/Srinivas/OneDrive/Desktop/honey%20chain2/start.bat) in the project folder. It starts the server and automatically opens [http://localhost:3000/](http://localhost:3000/).

### Option 2: Run via Terminal / PowerShell
Open PowerShell in this directory and run:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Then visit **[http://localhost:3000/](http://localhost:3000/)** in your browser.

---

## 🚀 Quick Usage in HTML / Web App

Include `theme.css` in any page:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="theme.css">

<div class="hc-screen-container">
  <header class="hc-header">
    <h1 class="hc-h1">Harvest Honey</h1>
  </header>

  <main class="hc-content">
    <label class="hc-label" for="weight">Weight (kg)</label>
    <input id="weight" class="hc-input" type="number" placeholder="0">
  </main>

  <footer class="hc-footer-action">
    <button class="hc-button-primary">
      <span>Submit Harvest</span>
    </button>
  </footer>
</div>
```
