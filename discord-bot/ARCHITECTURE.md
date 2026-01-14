# System Architecture & Flow Diagrams

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Azure Community System                           │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐                                      ┌─────────────────┐
│                  │                                      │                 │
│  Discord Server  │                                      │   Web Browser   │
│                  │                                      │                 │
│  - Members       │                                      │  - Profile View │
│  - Channels      │                                      │  - Role Select  │
│  - Roles         │                                      │  - Stats        │
│                  │                                      │                 │
└────────┬─────────┘                                      └────────┬────────┘
         │                                                         │
         │ Events & Commands                                      │ HTTP Requests
         │                                                         │
         ▼                                                         ▼
┌─────────────────────┐                              ┌─────────────────────┐
│                     │                              │                     │
│   Discord Bot       │◄────────────────────────────►│   Web Application   │
│   (Node.js)         │      Shared Data Access      │   (React + Spark)   │
│                     │                              │                     │
│  - Event Handlers   │                              │  - Profile Cards    │
│  - Slash Commands   │                              │  - Role UI          │
│  - XP Service       │                              │  - Progress Bars    │
│  - Role Manager     │                              │  - Rule Display     │
│                     │                              │                     │
└──────────┬──────────┘                              └──────────┬──────────┘
           │                                                    │
           │                                                    │
           │              ┌────────────────────┐               │
           │              │                    │               │
           └─────────────►│  Spark KV Store    │◄──────────────┘
                          │                    │
                          │  - user-profile-*  │
                          │  - guild-config    │
                          │  - xp-cooldown-*   │
                          │                    │
                          └────────────────────┘
```

## New Member Flow

```
  User Joins Discord Server
           ↓
  ┌─────────────────────┐
  │  guildMemberAdd     │
  │  Event Triggered    │
  └─────────┬───────────┘
           ↓
  ┌─────────────────────┐
  │  Check for          │
  │  "Pre-Member" Role  │
  └─────────┬───────────┘
           ↓
  ┌─────────────────────┐
  │  Create Role if     │
  │  Not Exists         │
  └─────────┬───────────┘
           ↓
  ┌─────────────────────┐
  │  Assign Role to     │
  │  New Member         │
  └─────────┬───────────┘
           ↓
  ┌─────────────────────┐
  │  Send Welcome       │
  │  Message with       │
  │  Rules Prompt       │
  └─────────────────────┘
```

## Rules Agreement Flow

```
  User Types /rules
         ↓
  ┌──────────────────────┐
  │  Load User Profile   │
  │  from KV Store       │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Display Rules       │
  │  Embed with Button   │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  User Clicks         │
  │  "Agree to Rules"    │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Update Profile:     │
  │  rulesAgreed = true  │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Save to KV Store    │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Remove Pre-Member   │
  │  Role                │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Add Member Role     │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Send Confirmation   │
  │  Welcome Message     │
  └──────────────────────┘
```

## XP & Leveling Flow

```
  User Sends Message
         ↓
  ┌──────────────────────┐
  │  messageCreate       │
  │  Event Triggered     │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Check if Bot?       │───Yes───► (Ignore)
  └──────────┬───────────┘
            No
            ↓
  ┌──────────────────────┐
  │  Check XP Cooldown   │
  │  (60 seconds)        │
  └──────────┬───────────┘
            │
  ┌─────────┴─────────┐
  │                   │
 Still on        Cooldown Passed
 Cooldown             │
  │                   ↓
  │         ┌──────────────────────┐
  │         │  Award +10 XP        │
  │         └──────────┬───────────┘
  │                   ↓
  │         ┌──────────────────────┐
  │         │  Calculate New Level │
  │         │  level = √(xp/100)   │
  │         └──────────┬───────────┘
  │                   ↓
  │         ┌──────────────────────┐
  │         │  Check Rank Tier     │
  │         │  Based on Level      │
  │         └──────────┬───────────┘
  │                   ↓
  │         ┌──────────────────────┐
  │         │  Save to KV Store    │
  │         └──────────┬───────────┘
  │                   ↓
  │         ┌──────────────────────┐
  │         │  Level Up?           │
  │         └──────────┬───────────┘
  │                   │
  │         ┌─────────┴─────────┐
  │        Yes                 No
  │         │                   │
  │         ↓                   ↓
  │  ┌──────────────┐    (No Notification)
  │  │  Send Level  │
  │  │  Up Message  │
  │  └──────┬───────┘
  │         │
  │         ↓
  │  ┌──────────────┐
  │  │  Rank Up?    │
  │  └──────┬───────┘
  │         │
  │    ┌────┴────┐
  │   Yes       No
  │    │         │
  │    ↓         ↓
  │  ┌────────┐  (Done)
  │  │ Send   │
  │  │ Rank   │
  │  │ Message│
  │  └────────┘
  │
  └──► (Ignore, Try Next Message)
```

## Role Customization Flow

```
  User Visits Web Profile
           ↓
  ┌──────────────────────┐
  │  Load Profile from   │
  │  KV Store            │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Display Current     │
  │  Roles & Available   │
  │  Roles               │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  User Selects/       │
  │  Deselects Roles     │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Validate Selection  │
  │  (Category Limits)   │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  User Clicks Save    │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Update Profile in   │
  │  KV Store            │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Show Success Toast  │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Bot Reads Updated   │
  │  Roles from KV       │
  │  (Next Profile Req)  │
  └──────────────────────┘
```

## Profile Display Flow (Bot Command)

```
  User Types /profile [@user]
            ↓
  ┌──────────────────────┐
  │  Determine Target    │
  │  User (Self or Other)│
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Load Profile from   │
  │  KV Store            │
  └──────────┬───────────┘
            │
  ┌─────────┴─────────┐
  │                   │
 Found            Not Found
  │                   │
  ↓                   ↓
┌──────────┐   ┌──────────────┐
│ Calculate│   │ Send "Not    │
│ Progress │   │ Found" Msg   │
│ Stats    │   └──────────────┘
└────┬─────┘
     ↓
┌──────────────────────┐
│ Build Discord Embed  │
│ - Avatar             │
│ - Rank & Level       │
│ - XP & Progress      │
│ - Roles              │
│ - Join Date          │
└──────────┬───────────┘
          ↓
┌──────────────────────┐
│ Send Embed with      │
│ Web Profile Link     │
└──────────────────────┘
```

## Bot Reconnection Flow

```
  Admin Types /reconnect
           ↓
  ┌──────────────────────┐
  │  Acknowledge Command │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Re-register All     │
  │  Slash Commands      │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Refresh Event       │
  │  Handlers            │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Clear Internal      │
  │  Caches              │
  └──────────┬───────────┘
            ↓
  ┌──────────────────────┐
  │  Send Success        │
  │  Confirmation        │
  └──────────────────────┘
```

## Data Synchronization Pattern

```
┌─────────────────────────────────────────────────────┐
│                   KV Store Keys                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  user-profile-{userId}                              │
│  {                                                   │
│    id: "123456789",                                 │
│    username: "AzureDev",                            │
│    xp: 12500,                                       │
│    level: 11,                                       │
│    rank: "arcadia",                                 │
│    rulesAgreed: true,                               │
│    roles: ["member", "dreamer"],                    │
│    joinedAt: "2024-01-01T00:00:00.000Z"            │
│  }                                                   │
│                                                      │
└─────────────────────────────────────────────────────┘
         ▲                                 ▲
         │                                 │
         │                                 │
    ┌────┴────┐                       ┌────┴────┐
    │         │                       │         │
    │  Bot    │                       │  Web    │
    │  Write  │                       │  Write  │
    │         │                       │         │
    └────┬────┘                       └────┬────┘
         │                                 │
         │                                 │
         ▼                                 ▼
    ┌─────────────────────────────────────────┐
    │       Both Components Read Same Data     │
    │       = Always Synchronized              │
    └─────────────────────────────────────────┘
```

## Complete Feature Map

```
┌─────────────────────────────────────────────────────────────┐
│                    Azure Community Features                  │
└─────────────────────────────────────────────────────────────┘

Discord Bot                          Web Application
───────────                          ───────────────
├─ Member Management                 ├─ Profile Display
│  ├─ Auto Pre-Member Role          │  ├─ Avatar & Username
│  ├─ Rules Agreement                │  ├─ XP Progress Bar
│  └─ Member Promotion               │  ├─ Rank Badge
│                                     │  └─ Stats Display
├─ XP System                         │
│  ├─ Message XP Awards              ├─ Role Customization
│  ├─ Level Calculation              │  ├─ Role Categories
│  ├─ Rank Progression               │  ├─ Visual Selection
│  └─ Level Up Notifications         │  ├─ Color Previews
│                                     │  └─ Save to KV
├─ Commands                          │
│  ├─ /profile                       ├─ Rules Display
│  ├─ /leaderboard                   │  ├─ Scrollable List
│  ├─ /rules                         │  └─ Agreement Status
│  ├─ /roles                         │
│  └─ /reconnect                     └─ Responsive Design
│                                        ├─ Desktop Layout
├─ Events                                ├─ Mobile Layout
│  ├─ Member Join                        └─ Animations
│  ├─ Message Create                     
│  └─ Interactions                    
│                                     
└─ Administration                     
   ├─ Role Management                 
   ├─ Command Registration            
   └─ Error Handling                  
```
