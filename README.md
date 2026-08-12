# AI Mock Interview

A web app that generates role-specific interview questions with an LLM, runs the interview, and scores the answers against structured criteria.

**Live demo — https://ai-mock-interviews-ebon-eight.vercel.app**

> This is a learning project. It reimplements an existing open-source tutorial project rather than an original design, and I built it to work through a full Next.js App Router stack end to end: server components, server actions, authenticated data access, and LLM integration. The code is mine; the product concept is not.

## Features

- Email/password accounts backed by Firebase Auth, with a session cookie verified server-side
- Interview generation — a role, seniority level and tech stack produce a tailored question set from Gemini
- A dashboard split between interviews you have taken and interviews available to take
- Voice-driven interview sessions through the Vapi web SDK
- Structured feedback: an overall score plus per-category scores, strengths, and areas to improve

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui on Radix primitives |
| Auth & data | Firebase Auth, Cloud Firestore (via `firebase-admin`) |
| LLM | Google Gemini through the Vercel AI SDK |
| Voice | Vapi web SDK |
| Forms | React Hook Form + Zod |
| Hosting | Vercel |

## How it fits together

Route groups separate the two shells: `app/(auth)` for signed-out pages and `app/(root)` for the app itself.

Data access lives in server actions under `lib/actions/`, so Firestore credentials and the Gemini key never reach the browser. `getCurrentUser` reads the session cookie and verifies it with the Admin SDK on every request.

Question generation is a two-hop flow. The browser starts a Vapi workflow; when that workflow finishes, Vapi calls `POST /api/vapi/generate`, which asks Gemini for the questions and writes the interview document to Firestore. Feedback scoring uses `generateObject` with a Zod schema, so the model returns typed category scores rather than prose to parse.

## Running locally

```bash
npm install
npm run dev
```

Create `.env.local` with:

```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
NEXT_PUBLIC_VAPI_WEB_TOKEN=
NEXT_PUBLIC_VAPI_WORKFLOW_ID=
```

The Firebase **client** config lives in `firebase/client.ts`. Those values are public by design — they identify the project and are not credentials.

## Known limitations

- **The voice flow needs Vapi credits.** Vapi moved to paid plans and reworked its workflow builder after this was written, so the live demo cannot complete a spoken interview. Question generation and feedback scoring, which run through Gemini in this app's own API route, still work.
- **Pin model IDs with care.** The original code pinned `gemini-2.0-flash-001`; Google retired it and every generation call started returning 404 with no visible error in the UI. It now uses `gemini-flash-latest` so a withdrawn version cannot silently break the demo.
- The bundle ships one large client chunk; no code splitting has been done.
