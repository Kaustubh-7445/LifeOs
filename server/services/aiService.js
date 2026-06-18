const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const AppError = require('../utils/AppError');

let genAI = null;

const getGenAI = () => {
  if (!config.geminiApiKey) return null;
  if (!genAI) genAI = new GoogleGenerativeAI(config.geminiApiKey);
  return genAI;
};

const generateAIResponse = async (prompt, context = '') => {
  const ai = getGenAI();
  if (!ai) {
    return {
      text: 'AI features require a GEMINI_API_KEY. Add it to your environment variables to enable personalized insights.',
      mock: true,
    };
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const fullPrompt = context
      ? `You are LifeOS AI, a personal productivity assistant. Be concise, actionable, and encouraging.\n\nContext:\n${context}\n\nRequest:\n${prompt}`
      : `You are LifeOS AI, a personal productivity assistant. Be concise, actionable, and encouraging.\n\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    return { text, mock: false };
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new AppError('AI service temporarily unavailable', 503);
  }
};

const getDailySuggestions = (userData) =>
  generateAIResponse(
    'Provide 3 specific productivity suggestions for today based on my data. Format as numbered list.',
    JSON.stringify(userData, null, 2)
  );

const getWeeklySummary = (userData) =>
  generateAIResponse(
    'Provide a weekly performance summary with highlights, areas to improve, and 2 action items.',
    JSON.stringify(userData, null, 2)
  );

const getGoalRecommendations = (goals) =>
  generateAIResponse(
    'Suggest 3 actionable steps to accelerate progress on my goals.',
    JSON.stringify(goals, null, 2)
  );

const getLearningRecommendations = (resources) =>
  generateAIResponse(
    'Recommend learning priorities and next resources based on my progress.',
    JSON.stringify(resources, null, 2)
  );

const getTaskPrioritization = (tasks) =>
  generateAIResponse(
    'Prioritize these tasks and explain the order. Return JSON array with taskId and priority rank.',
    JSON.stringify(tasks, null, 2)
  );

const getImprovementInsights = (analytics) =>
  generateAIResponse(
    'Provide personalized improvement insights based on my analytics data.',
    JSON.stringify(analytics, null, 2)
  );

module.exports = {
  generateAIResponse,
  getDailySuggestions,
  getWeeklySummary,
  getGoalRecommendations,
  getLearningRecommendations,
  getTaskPrioritization,
  getImprovementInsights,
};
