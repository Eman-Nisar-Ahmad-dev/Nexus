# Nexus — Investor & Entrepreneur Collaboration Platform

Nexus is a platform connecting startup entrepreneurs with investors. This repository extends the existing Nexus application with five new collaboration modules, built as part of the DevelopersHub Corporation Advanced Frontend Internship (Phase 2).

**Live demo:** [nexus-silk-nine-43.vercel.app](https://nexus-silk-nine-43.vercel.app)

## Demo Accounts

Use the **Entrepreneur Demo** / **Investor Demo** buttons on the login screen to auto-fill test credentials, or register a new account. Login requires a mock 2FA step — any 6-digit code is accepted.

## Features

### Meeting Scheduling Calendar
- Add, rename, and delete availability slots on an interactive calendar (FullCalendar)
- Send, accept, and decline meeting requests
- Accepted requests automatically appear as confirmed meetings on the calendar and dashboard

### Video Calling
- Live camera/microphone preview via `getUserMedia`
- Independent audio and video toggles
- Screen sharing via `getDisplayMedia`, with automatic fallback to the camera feed

### Document Chamber
- Real file upload with in-app preview (PDF and image support)
- E-signature pad (`react-signature-canvas`)
- Status tracking: Draft / In Review / Signed

### Payments
- Wallet balance with Deposit, Withdraw, and Transfer flows
- "Fund a Deal" simulation for Investor → Entrepreneur transfers
- Full transaction history table

### Security & Access Control
- Password strength meter on registration (`zxcvbn`)
- Two-step login with a mock 6-digit OTP verification
- Role-based dashboards and navigation (Entrepreneur / Investor)

### Integration
- All new features accessible from both the desktop sidebar and mobile navigation menu
- Responsive layouts tested across mobile, tablet, and desktop breakpoints
- In-app guided walkthrough (React Joyride) highlighting the new features

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **React Router** for routing
- **React Context API** for shared state (auth, meetings)
- **FullCalendar**, **react-signature-canvas**, **react-otp-input**, **zxcvbn**, **react-joyride**

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for a full breakdown of the folder structure, routing, and state management.

## Getting Started

```bash
git clone https://github.com/Eman-Nisar-Ahmad-dev/Nexus.git
cd Nexus
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

This project is deployed on [Vercel](https://vercel.com) and redeploys automatically on every push to `main`.

## Author

**Eman Nisar Ahmad**
Advanced Frontend Internship — DevelopersHub Corporation