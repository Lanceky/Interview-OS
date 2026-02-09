# InterviewOS 🎤🧠

> Democratize interview feedback so everyone has equal access to coaching, regardless of their network or budget.

**InterviewOS** is a mobile application built with React Native and Expo that provides real-time AI-powered interview coaching and feedback. Practice interviews across **Tech**, **Finance**, and **Law** domains — get scored, coached, and improved in minutes.

---

## ✨ Features

- **Domain-Specific Practice** — Choose from Tech, Finance, or Law interview questions
- **Voice Recording & Transcription** — Record answers using your device microphone with real-time speech-to-text
- **AI-Powered Feedback** — Google Gemini 3 evaluates your responses across three dimensions:
  - **Structure** (1–10): Logical organization and articulation
  - **Confidence** (1–10): Authority, clarity, and delivery
  - **Technical Accuracy** (1–10): Correctness and completeness of domain knowledge
- **Detailed Coaching Report** — After each answer, receive:
  - Individual + overall composite scores
  - Strengths and areas for improvement
  - Personalized coaching tips
  - A follow-up question to deepen understanding
- **Visual Score Display** — Progress bars with color coding (🟢 8+, 🟡 6–7, 🔴 <6)
- **Shareable Results** — Share your scores on social media
- **Unlimited Practice** — No session limits, track progress over time

---

## 🏗️ Tech Stack

| Layer               | Technology                                      |
| ------------------- | ----------------------------------------------- |
| **Frontend**        | React Native + Expo (iOS / Android / Web)       |
| **Routing**         | Expo Router (file-based routing)                |
| **Styling**         | NativeWind + Tailwind CSS                       |
| **Authentication**  | Appwrite (user accounts & session management)   |
| **Database**        | Appwrite Database (user progress & scores)      |
| **AI Engine**       | Google Gemini 3 API                             |
| **Audio Recording** | Expo AV                                         |
| **Transcription**   | Web Speech API + Expo Speech API                |

> No custom backend required — all processing is handled by Gemini 3 and Appwrite.

---

## 📋 Question Bank

Each domain includes 5–10 hand-curated interview questions, randomized per session:

| Domain     | Topics                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| **Tech**   | System design, debugging, technical projects, architectural decisions   |
| **Finance**| Financial analysis, risk assessment, portfolios, market interpretation  |
| **Law**    | Legal research, case analysis, contract review, argumentation           |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A device or emulator for testing

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Lanceky/Interview-OS.git
   cd Interview-OS
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npx expo start
   ```

4. Open the app on your preferred platform:
   - [Expo Go](https://expo.dev/go) on a physical device
   - [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - Web browser

---

## 🎯 How It Works

1. **Select a domain** — Tech, Finance, or Law
2. **Receive a question** — Randomized from the curated question bank
3. **Record your answer** — Speak naturally into your device microphone (3–5 min)
4. **Get AI feedback** — Gemini 3 analyzes your transcript and returns scores + coaching
5. **Iterate & improve** — Practice again with new questions and track your progress

---

## 🗺️ Roadmap

### Short-term
- Progress tracking dashboard
- User leaderboards
- Additional domains (Sales, Product, Consulting)

### Medium-term
- Video recording for body language analysis
- Peer feedback groups
- Accessibility features

### Long-term
- B2B partnerships for pre-screening
- Human coach marketplace
- Salary negotiation coaching

---

## 🎯 Target Audience

Job seekers preparing for interviews across tech, finance, and law — including students, career changers, and professionals seeking new roles who want affordable, 24/7 interview coaching.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is private and not currently licensed for redistribution.
