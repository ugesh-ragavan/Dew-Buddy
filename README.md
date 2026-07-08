# 🌿 Dew Buddy

A Chrome extension that reminds you to drink water and take screen breaks — with a friendly pixel-art buddy who keeps you company while you work.

---

## What is this?

Dew Buddy is a small desktop companion that lives in your browser toolbar. It doesn't nag you with plain system notifications — it shows up as a cute pixel-art character in a soft, rounded, pastel-colored popup and a gentle slide-in reminder card, nudging you to hydrate and rest your eyes on a schedule you set.

Think of it as a tiny pet that's rooting for your health, not another productivity app trying to guilt-trip you.

---

## Why I'm building this

Most break/hydration reminder tools feel clinical — a browser alert, a beep, gone in two seconds. Dew Buddy is meant to feel like a character, not a notification. The mascot, the color palette, and the rounded "bento box" layout are all there to make a boring habit (drink water, blink, stretch) feel a little more alive.

---

## What it looks like

**Design language: "Playful Modernism"**

| | |
|---|---|
| 🎨 **Palette** | Cream background, muted teal, warm gold, soft coral accents, deep charcoal text |
| 🔤 **Type** | Rounded sans-serif (Quicksand / Inter Bold) for a friendly, chunky feel |
| 🟫 **Shape language** | Extremely rounded corners (24–32px) everywhere — cards, buttons, inputs |
| 🧩 **Layout** | Bento-box style popup — each setting lives in its own soft, shadowed card |
| 🐣 **Mascot** | Dew Buddy, a small animated pixel-art character, appears in the popup and in reminder notifications |

---

## How it works

1. **Set your intervals** — Open the popup and set how often you want a water reminder and a screen-break reminder, in minutes.
2. **Dew Buddy keeps time in the background** — using Chrome's alarm system, so it works even when the popup is closed.
3. **When it's time, a reminder slides in** — a small glassy card appears in the bottom-left corner of whatever page you're on, with Dew Buddy peeking out.
4. **You respond** — tap **Done** (I did it) or **Snooze** (remind me again in a bit), and the timer resets.

---

## Main screens

### Popup (toolbar window)
- **Welcome card** — greets you by name, shows Dew Buddy's avatar
- **Water Interval card** — pill-shaped input + circular progress ring showing time left until your next reminder
- **Screen Break card** — same idea, for eye/posture breaks

### On-page reminder (content overlay)
- Slides in from the bottom-left corner of the current tab
- Built with a Shadow DOM, so it always looks the same no matter what website you're on — no CSS conflicts
- Two actions: **Done** (teal button) and **Snooze** (gold button)

---

## Under the hood (for the curious)

| Piece | What it does |
|---|---|
| `manifest.json` | Chrome Manifest V3 config — permissions, alarms, content scripts |
| `popup.html` / `popup.css` | The toolbar popup UI (bento layout, timers) |
| `background.js` | Runs the timers using `chrome.alarms`, decides when to fire a reminder |
| `content.js` | Injects the reminder card into the current page via Shadow DOM |
| `chrome.storage.local` | Saves your interval settings so they persist between sessions |

No servers, no accounts, no data leaving your browser — everything runs locally.

---

## Status

🚧 Work in progress. Currently focused on nailing the mascot animation (Dew Buddy needs to feel alive, not static) before polishing the rest of the UI.

---

## Why "Dew"?

Water, freshness, a small daily reset — like morning dew. Also just a nice sound for a small, gentle character to be named after.
