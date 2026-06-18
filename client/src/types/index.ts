export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    currency: string;
    timezone: string;
  };
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: string;
  priority: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate?: string;
  completedAt?: string;
  tags?: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  _id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: string;
  streak: number;
  bestStreak: number;
  completions: { date: string; completed: boolean; notes?: string }[];
  isActive: boolean;
}

export interface Goal {
  _id: string;
  title: string;
  description?: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  milestones: { _id?: string; title: string; completed: boolean; targetDate?: string }[];
  status: string;
  priority: string;
  color: string;
  progress?: number;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  paymentMethod: string;
}

export interface Budget {
  _id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: string;
  alertThreshold: number;
  remaining?: number;
  percentUsed?: number;
}

export interface LearningResource {
  _id: string;
  title: string;
  type: string;
  url?: string;
  description?: string;
  content?: string;
  progress: number;
  status: string;
  category: string;
  timeSpentMinutes: number;
  tags?: string[];
}

export interface DashboardStats {
  productivityScore: number;
  dailySummary: {
    tasksCompleted: number;
    tasksPending: number;
    habitsCompleted: number;
    habitsTotal: number;
  };
  goalProgress: number;
  habitCompletionRate: number;
  monthlyExpenses: { income: number; expenses: number; savings: number };
  learningProgress: number;
  recentActivity: { id: string; type: string; title: string; status: string; updatedAt: string }[];
  goals: { id: string; title: string; progress: number; category: string; color: string }[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthData {
  user: User;
  accessToken: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
