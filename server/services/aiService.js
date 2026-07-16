const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const AppError = require('../utils/AppError');

let genAI = null;

const getGenAI = () => {
  if (!config.geminiApiKey) return null;
  if (!genAI) genAI = new GoogleGenerativeAI(config.geminiApiKey);
  return genAI;
};

const getMockResponse = (prompt) => {
  const query = prompt.toLowerCase();
  
  if (query.includes('workout') || query.includes('exercise') || query.includes('fitness') || query.includes('gym')) {
    return "Great goal! Starting a workout routine is a fantastic way to boost your productivity score. Based on your goals, I recommend a simple 20-minute daily routine: 10 minutes of active stretching, followed by 3 sets of bodyweight exercises (squats, pushups, and planks). Don't forget to track this in your **Habits Page** to maintain your streak!";
  }
  
  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return "Hello! I am your LifeOS AI Copilot. I can help you plan your day, suggest tasks to prioritize, check your goal progress, or recommend study topics. To enable my fully personalized, real-time Gemini AI insights, please add a `GEMINI_API_KEY` to your environment variables! How can I help you today?";
  }
  
  if (query.includes('task') || query.includes('plan') || query.includes('priorit')) {
    return "To maximize your productivity today, I recommend prioritizing your High priority tasks first. Make sure to break down your main goals into smaller milestones. You can organize them visually on your **Smart Planner** drag-and-drop Kanban board!";
  }
  
  if (query.includes('habit') || query.includes('routin')) {
    return "Building consistent habits is key to long-term success. Try starting with one small habit (like drinking water or reading 5 pages) and set a daily reminder. You can track your streaking history and active routines in the **Habit Tracker** module.";
  }

  if (query.includes('money') || query.includes('expense') || query.includes('budget') || query.includes('financ')) {
    return "Managing finances keeps your mind clear for productivity! I recommend setting up a category budget in the **Expense Tracker** and logging your daily transactions. Try keeping your expenses below 70% of your budget threshold.";
  }

  // Specific prompt matches for other backend analytic endpoints
  if (query.includes('3 specific productivity suggestions')) {
    return "1. **Morning Momentum**: Complete your highest priority task in the Smart Planner before checking emails.\n2. **Habit Streak**: Toggle your active habits in the Habit Tracker before 6 PM.\n3. **Financial Focus**: Log any expenses incurred today to stay within your category budgets.";
  }

  if (query.includes('weekly performance summary')) {
    return "**Weekly Highlight**: You've maintained a solid streak on your main habits this week!\n**Area to Improve**: Focus on completing overdue tasks early in the week.\n**Action Items**:\n- Review and adjust next week's budgets.\n- Dedicate 1 hour to your active courses in the Learning Hub.";
  }

  if (query.includes('accelerate progress on my goals')) {
    return "1. Break your primary goal into smaller, weekly milestones.\n2. Dedicate at least 30 minutes of focused effort daily to your current learning hub resources.\n3. Share your progress with a friend or colleague to keep yourself accountable.";
  }

  if (query.includes('recommend learning priorities')) {
    return "1. Prioritize completing active resources with progress between 50%-80%.\n2. Create a study note summarizing the key concepts of your most recent topic.\n3. Dedicate 20 minutes to a technical video or tutorial in your hub today.";
  }

  if (query.includes('prioritize these tasks and explain')) {
    return "Based on category and deadlines, I recommend starting with your High priority goals first, followed by Medium, and then Low priority daily routines. Set aside dedicated time blocks for each task to avoid multitasking.";
  }

  if (query.includes('improvement insights based on my analytics')) {
    return "Your productivity score peaks on days when you complete habits in the morning. Try scheduling your workout and learning sessions before noon to capitalize on this peak momentum.";
  }

  // General fallback mock response
  return "That sounds like a great plan! To get fully personalized AI suggestions and real-time smart analysis tailored directly to your LifeOS tasks and statistics, please add your Google `GEMINI_API_KEY` to your `server/.env` file. (Demo Mode: Ask me about workouts, habits, tasks, or finances to see sample suggestions!).";
};

const generateAIResponse = async (prompt, context = '') => {
  const ai = getGenAI();
  if (!ai) {
    return {
      text: getMockResponse(prompt),
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
