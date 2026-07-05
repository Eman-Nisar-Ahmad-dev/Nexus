# Nexus Platform — Architecture & Component Structure

## Overview
Nexus is an Investor & Entrepreneur collaboration platform built with React, TypeScript, and Tailwind CSS. This document covers the existing architecture reviewed during setup, and the features added during this internship phase.

## Tech Stack
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Routing**: React Router (`react-router-dom`)
- **Styling**: Tailwind CSS with a custom theme (see `tailwind.config.js`)
- **State Management**: React Context API (`AuthContext`, `MeetingContext`)
- **Icons**: `lucide-react`
- **Calendar**: `@fullcalendar/react` with `dayGridPlugin` and `interactionPlugin`
- **E-signature**: `react-signature-canvas`
- **OTP input**: `react-otp-input`
- **Password strength**: `zxcvbn`

## Folder Structure

```
src/
├── components/
│   ├── calendar/          # MeetingCalendar (FullCalendar wrapper)
│   ├── chat/               # ChatMessage, ChatUserList
│   ├── collaboration/     # CollaborationRequestCard
│   ├── entrepreneur/      # EntrepreneurCard
│   ├── investor/          # InvestorCard
│   ├── layout/            # DashboardLayout, Navbar, Sidebar
│   └── ui/                # Reusable UI primitives: Button, Card, Badge, Input, Avatar
├── context/
│   ├── AuthContext.tsx    # User auth state, login/register/logout
│   └── MeetingContext.tsx # Meetings + meeting requests state
├── data/                  # Mock data (users, meetings, messages, collaboration requests)
├── pages/
│   ├── auth/               # LoginPage (with 2FA/OTP step), RegisterPage (with password strength)
│   ├── dashboard/          # EntrepreneurDashboard, InvestorDashboard
│   ├── deals/               # DealsPage (investment pipeline tracker)
│   ├── documents/          # DocumentsPage (upload, preview, e-signature, status)
│   ├── entrepreneurs/      # EntrepreneursPage
│   ├── help/                # HelpPage
│   ├── investors/          # InvestorsPage
│   ├── messages/            # MessagesPage
│   ├── notifications/       # NotificationsPage
│   ├── payments/            # PaymentsPage (wallet, transactions, funding flow) — NEW
│   ├── profile/              # EntrepreneurProfile, InvestorProfile
│   ├── settings/             # SettingsPage
│   ├── video/                # VideoCallPage (WebRTC mock call UI) — NEW
│   └── chat/                 # ChatPage
├── types/                  # Shared TypeScript interfaces (Meeting, UserRole, etc.)
├── App.tsx                 # Route definitions
└── main.tsx                # App entry point
```

## Routing
All routes are defined in `App.tsx` using nested routes under `DashboardLayout`, which handles auth-gating (`Navigate` to `/login` if not authenticated) and wraps every page with the shared `Navbar` + `Sidebar`.

Key routes added this phase:
- `/video-call` → `VideoCallPage`
- `/payments` → `PaymentsPage`

## State Management
Two React Context providers wrap the app (see `App.tsx`):
- **AuthContext**: handles current user, login (now with a 2FA/OTP verification step), registration (now with live password strength feedback), and logout.
- **MeetingContext**: holds the list of confirmed `meetings` (shown on the calendar and dashboard) and `meetingRequests` (pending requests that can be accepted or declined, which then get added to the confirmed meetings list). Also exposes `updateMeeting` and `deleteMeeting` for editing/removing existing calendar slots.

Other data (documents, transactions, deals) is currently managed as local component state within each page, since it doesn't need to be shared across the app yet.

## UI Theme
Defined in `tailwind.config.js`:
- **Color palette**: `primary` (blue), `secondary` (teal), `accent` (amber), plus semantic `success`, `warning`, `error` scales — used consistently across all new features (badges, buttons, status indicators) to match the existing design language.
- **Typography**: `Inter var` as the base sans-serif font.
- **Animations**: `fade-in` and `slide-in` keyframes, reused across new modal/dialog components (Document preview, Signature pad, Payment forms).
- **Responsive grid**: Tailwind's default breakpoint system (`sm`, `md`, `lg`) is used throughout — the sidebar collapses to a hamburger menu below `md`, and all new pages (Documents, Payments, Video Call) use responsive flex/grid layouts that stack on mobile.

## Features Implemented This Phase

### Milestone 2 — Meeting Scheduling Calendar
- Calendar UI via FullCalendar (`MeetingCalendar.tsx`)
- Click a date to add a new availability slot
- Click an existing slot to rename or delete it (modify)
- Meeting Requests panel with Accept/Decline actions; accepted requests are automatically added to the confirmed calendar
- Confirmed meetings display on both the calendar and the dashboard stat cards

### Milestone 3 — Video Calling
- `VideoCallPage.tsx` using the browser's `getUserMedia` API for a live camera/mic preview
- Start/End call controls
- Independent video and audio toggle (mutes/disables actual media tracks)
- Screen share via `getDisplayMedia`, with automatic fallback to camera feed when sharing ends

### Milestone 4 — Document Chamber
- Real file upload (`DocumentsPage.tsx`) using `URL.createObjectURL` for local preview (no backend required)
- PDF/image preview in a modal
- E-signature pad (`react-signature-canvas`) that marks a document as "Signed"
- Status management: Draft / In Review / Signed, editable per document

### Milestone 5 — Payments
- New `PaymentsPage.tsx` with wallet balance display
- Deposit / Withdraw / Transfer forms, each updating the wallet balance and transaction table
- "Fund a Deal" flow simulating an Investor → Entrepreneur transfer
- Transaction history table showing type, amount, sender, receiver, status, and date

### Milestone 6 — Security & Access Control
- Password strength meter on `RegisterPage.tsx` using `zxcvbn`, with a live 5-segment strength bar and feedback text
- Multi-step login: credential verification followed by a 6-digit OTP mock screen on `LoginPage.tsx`
- Role-based UI: existing Entrepreneur/Investor role selection now also gates sidebar/navbar navigation items and dashboard views

### Milestone 7 — Integration
- Added Documents, Video Call, and Payments links to both `Sidebar.tsx` (desktop) and `Navbar.tsx` (mobile menu), ensuring every feature is reachable from both layouts
- Responsive fixes applied to the Documents page row layout to prevent overlap on narrow screens