/**
 * InterviewOS — Curated Question Banks
 */

export const TECH_QUESTIONS = [
  "Walk me through how you'd design a URL shortener like Bitly.",
  "Explain your approach to debugging a production issue you encountered.",
  "Tell me about a time you optimized code for performance. What was the bottleneck?",
  "How would you design a real-time notification system?",
  "Describe your experience with SQL vs NoSQL. When would you use each?",
  "Explain a complex technical project you built. What challenges did you face?",
  "How do you approach learning a new technology or framework?",
  "Walk me through your debugging process when something breaks in production.",
  "Design a caching strategy for a high-traffic website.",
  "Tell me about your experience with API design. What best practices do you follow?",
];

export const FINANCE_QUESTIONS = [
  "Walk me through a DCF analysis. What are the key assumptions?",
  "How would you assess the risk of a new investment opportunity?",
  "Explain the difference between equity and debt financing. When would you recommend each?",
  "How do you interpret a company's balance sheet to evaluate its financial health?",
  "Describe a time you analyzed financial data to make a strategic recommendation.",
  "A company's revenue is growing 20% YoY but margins are declining. What's your analysis?",
  "How would you value a pre-revenue startup? What methods would you use?",
  "Walk me through how you'd build a financial model for a new product launch.",
  "Explain the concept of WACC and how it impacts investment decisions.",
  "How do you assess whether a company is overvalued or undervalued?",
];

export const LAW_QUESTIONS = [
  "How do you approach legal research for a new case? Walk me through your process.",
  "Walk me through how you'd analyze a contract for potential risks and liabilities.",
  "Explain the process of building a persuasive legal argument for a motion.",
  "Describe your experience with case law analysis. How do you find relevant precedents?",
  "How do you handle conflicting precedents in a legal brief?",
  "A client wants to break a non-compete agreement. How would you advise them?",
  "Explain the difference between civil and criminal liability in a corporate context.",
  "How would you prepare a witness for cross-examination?",
  "Walk me through due diligence for a corporate merger. What are the key legal risks?",
  "How do you balance ethical obligations with a client's desired outcome?",
];

export function getRandomQuestion(domain: "tech" | "finance" | "law"): string {
  const banks = {
    tech: TECH_QUESTIONS,
    finance: FINANCE_QUESTIONS,
    law: LAW_QUESTIONS,
  };
  const questions = banks[domain];
  return questions[Math.floor(Math.random() * questions.length)];
}

// ─── Gemini Prompt Builder ───────────────────────────────────────
export function buildTechPrompt(question: string, answer: string): string {
  return `You are a senior software engineer interviewer evaluating a technical interview response.

Question: "${question}"
Candidate's response: "${answer}"

Evaluate on:
1. Structure (1-10): Is the answer logically organized? Clear problem breakdown?
2. Clarity (1-10): Is it well-written and easy to follow?
3. Technical Accuracy (1-10): Are the technical choices sound and accurate?

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "structureScore": <1-10>,
  "clarityScore": <1-10>,
  "technicalScore": <1-10>,
  "averageScore": <1-10>,
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "improvements": ["<improvement1>", "<improvement2>", "<improvement3>"],
  "coachingTip": "<specific, actionable advice for tech interviews>",
  "followUpQuestion": "<harder follow-up to test depth>"
}`;
}

export function buildFinancePrompt(question: string, answer: string): string {
  return `You are a senior finance professional interviewer evaluating a finance interview response.

Question: "${question}"
Candidate's response: "${answer}"

Evaluate on:
1. Structure (1-10): Is the answer logically organized with a clear analytical framework?
2. Clarity (1-10): Is it well-articulated and easy to follow?
3. Technical Accuracy (1-10): Are the financial concepts, models, and reasoning sound?

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "structureScore": <1-10>,
  "clarityScore": <1-10>,
  "technicalScore": <1-10>,
  "averageScore": <1-10>,
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "improvements": ["<improvement1>", "<improvement2>", "<improvement3>"],
  "coachingTip": "<specific, actionable advice for finance interviews>",
  "followUpQuestion": "<harder follow-up to test financial depth>"
}`;
}

export function buildLawPrompt(question: string, answer: string): string {
  return `You are a senior attorney interviewer evaluating a law interview response.

Question: "${question}"
Candidate's response: "${answer}"

Evaluate on:
1. Structure (1-10): Is the answer logically organized with clear legal reasoning?
2. Clarity (1-10): Is the argument well-articulated, precise, and persuasive?
3. Technical Accuracy (1-10): Are the legal principles, precedents, and analysis sound?

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "structureScore": <1-10>,
  "clarityScore": <1-10>,
  "technicalScore": <1-10>,
  "averageScore": <1-10>,
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "improvements": ["<improvement1>", "<improvement2>", "<improvement3>"],
  "coachingTip": "<specific, actionable advice for law interviews>",
  "followUpQuestion": "<harder follow-up to test legal depth>"
}`;
}

// ─── Result Type ─────────────────────────────────────────────────
export interface InterviewResult {
  structureScore: number;
  clarityScore: number;
  technicalScore: number;
  averageScore: number;
  strengths: string[];
  improvements: string[];
  coachingTip: string;
  followUpQuestion: string;
}
