import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export const STATUS_COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-gray-300' },
  { id: 'in-progress', title: 'In Progress', color: 'border-blue-400' },
  { id: 'review', title: 'Review', color: 'border-yellow-400' },
  { id: 'done', title: 'Done', color: 'border-green-400' },
] as const;

export const GOAL_CATEGORIES = [
  { value: 'fitness', label: 'Fitness', icon: '💪', color: '#ef4444' },
  { value: 'career', label: 'Career', icon: '💼', color: '#f59e0b' },
  { value: 'financial', label: 'Financial', icon: '💰', color: '#10b981' },
  { value: 'learning', label: 'Learning', icon: '📚', color: '#6366f1' },
  { value: 'personal', label: 'Personal', icon: '🌟', color: '#8b5cf6' },
];

export const EXPENSE_CATEGORIES = [
  'food', 'transport', 'housing', 'utilities', 'entertainment',
  'health', 'education', 'shopping', 'salary', 'freelance', 'other',
];
