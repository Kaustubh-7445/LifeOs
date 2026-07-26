import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search, Plus, Bell, Bot, Zap, Wallet, BookOpen, RefreshCw, 
  ShieldCheck, Check, Droplet, Flame, Book, Sun, Moon
} from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { analyticsApi, aiApi } from '@/services';
import { formatCurrency } from '@/utils';
import { MobileMenuButton } from '@/components/layout/Sidebar';
import NotificationsPanel from '@/components/layout/NotificationsPanel';
import { useThemeStore } from '@/store';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
    },
  },
} as const;

export default function DashboardPage() {
  const { resolvedTheme, setTheme } = useThemeStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await analyticsApi.getDashboard()).data.data,
  });

  const { data: aiSuggestions } = useQuery({
    queryKey: ['ai-daily'],
    queryFn: async () => (await aiApi.getDailySuggestions()).data.data,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-white transition-colors duration-250">
        <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Command Center</h1>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // 1. Process tasks list (recent tasks or fallback demo tasks)
  const tasksList = stats?.recentActivity?.slice(0, 3).map((item, idx) => ({
    id: item.id,
    title: item.title,
    status: item.status,
    priority: idx === 0 ? 'High' : idx === 1 ? 'Deep Work' : 'Admin',
    priorityColor: idx === 0 ? 'text-red-500 bg-red-500/10' : idx === 1 ? 'text-purple-500 bg-purple-500/10' : 'text-emerald-500 bg-emerald-500/10',
  })) || [
    { id: '1', title: 'Complete quarterly report', status: 'todo', priority: 'High', priorityColor: 'text-red-500 bg-red-500/10' },
    { id: '2', title: 'Review design system v2', status: 'todo', priority: 'Deep Work', priorityColor: 'text-purple-500 bg-purple-500/10' },
    { id: '3', title: 'Client follow-up emails', status: 'todo', priority: 'Admin', priorityColor: 'text-emerald-500 bg-emerald-500/10' },
  ];

  if (tasksList.length < 3) {
    const fallbacks = [
      { id: 'f1', title: 'Complete quarterly report', status: 'todo', priority: 'High', priorityColor: 'text-red-500 bg-red-500/10' },
      { id: 'f2', title: 'Review design system v2', status: 'todo', priority: 'Deep Work', priorityColor: 'text-purple-500 bg-purple-500/10' },
      { id: 'f3', title: 'Client follow-up emails', status: 'todo', priority: 'Admin', priorityColor: 'text-emerald-500 bg-emerald-500/10' },
    ];
    while (tasksList.length < 3) {
      tasksList.push(fallbacks[tasksList.length]);
    }
  }

  // 2. Habit streaks mapping
  const habitStreaks = [
    { label: 'Meditate', days: '12 Days', color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Workout', days: '5 Days', color: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { label: 'Reading', days: '28 Days', color: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' }
  ];

  // 3. Wealth balance mapping
  const balance = stats?.monthlyExpenses?.savings && stats.monthlyExpenses.savings > 0 
    ? stats.monthlyExpenses.savings 
    : 12450.80;
  const balanceText = formatCurrency(balance);
  const budgetProgress = stats?.habitCompletionRate || 75;

  const nextGoalText = stats?.goals?.[0] 
    ? `${stats.goals[0].title}: ${stats.goals[0].progress}%`
    : 'Emergency Fund: $15k';

  // 4. Knowledge feed articles
  const articles = [
    { 
      title: 'Neural Plasticity in Adults', 
      source: 'Neuroscience Monthly • 5 min...', 
      img: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=80&h=80&fit=crop'
    },
    { 
      title: 'Second Brain Architectures', 
      source: 'Productivity Design • 12 min read', 
      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=80&h=80&fit=crop'
    }
  ];

  // 5. Study goals mapping
  const coursesList = stats?.goals?.filter(g => g.category === 'learning').map(c => ({
    title: c.title,
    progress: c.progress
  })).slice(0, 2) || [];

  const displayStudyGoals = coursesList.length > 0 ? coursesList : [
    { title: 'Rust Programming', progress: 42 },
    { title: 'Financial Modeling', progress: 85 }
  ];

  // 6. Productivity circle stroke calculation
  const productivityScore = stats?.productivityScore || 92;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (productivityScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-white transition-colors duration-250">
      {/* Sticky Custom Header */}
      <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <MobileMenuButton />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Command Center</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Command + K to search..."
              className="w-64 bg-slate-100 dark:bg-[#161b26] hover:bg-slate-200 dark:hover:bg-[#1a202d] focus:bg-white dark:focus:bg-[#1e2536] border border-slate-200 dark:border-white/5 focus:border-blue-500/50 rounded-full py-1.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all cursor-pointer"
              onClick={() => toast('Search feature coming soon!', { icon: '🔍' })}
              readOnly
            />
          </div>

          {/* Quick Add Button */}
          <button 
            onClick={() => toast.success('Quick Add opened')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-250 dark:bg-[#161b26] dark:hover:bg-[#1e2536] dark:border-white/5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-805 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Real Interactive Notification Bell & Panel */}
          <NotificationsPanel />
        </div>
      </div>

      <motion.div
        className="p-6 lg:p-8 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Row 1: AI Insights and Productivity Ring */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights Card */}
          <div className="lg:col-span-2 bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#222736] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-[#1e2538] flex items-center justify-center border border-slate-200 dark:border-white/5 shadow-inner shrink-0">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1b2132] flex items-center justify-center border border-slate-100 dark:border-white/5">
                <Bot className="w-8 h-8 text-blue-500 dark:text-blue-400 animate-pulse" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-650 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Active Analysis
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Insights</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {aiSuggestions?.text ? '"Smart suggestions are ready"' : '"You\'re 15% more productive than last week!"'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                {aiSuggestions?.text || 'Try tackling your deep work block before 11 AM today. Your focus cycles indicate peak mental clarity in the morning hours.'}
              </p>
              <div className="flex gap-4 text-xs font-bold text-blue-600 dark:text-blue-400">
                <button onClick={() => toast.success('Viewing Focus Map')} className="hover:underline hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer">
                  View Focus Map
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button onClick={() => toast.success('Adjusting Schedule')} className="hover:underline hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer">
                  Adjust Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Productivity Circle Card */}
          <div className="bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#222736] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px]">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-[#1e2536]"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Gradient Ring */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-emerald-500 dark:stroke-emerald-400 transition-all duration-500 ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{productivityScore}</span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-widest mt-1.5 uppercase">Score</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Peak Performance</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Productivity Score is up 4pts since Monday</p>
            </div>
          </div>
        </motion.div>

        {/* Row 2: Action Center (3 Column Grid) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Quick Glance */}
          <div className="bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#222736] rounded-2xl p-5 flex flex-col h-full min-h-[360px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Quick Glance</h3>
              <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            </div>

            <div className="mb-6 space-y-3">
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Top 3 Tasks</p>
              <div className="space-y-2">
                {tasksList.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1e2536]/40 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-4 h-4 rounded border border-slate-350 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors shrink-0">
                        {task.status === 'done' && <Check className="w-3 h-3 text-blue-500 dark:text-blue-400" />}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-white truncate">{task.title}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${task.priorityColor}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Habit Streaks</p>
              <div className="flex items-center justify-between gap-2.5">
                {habitStreaks.map((streak, idx) => {
                  const StreakIcon = idx === 0 ? Droplet : idx === 1 ? Flame : Book;
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 bg-slate-50 dark:bg-[#1e2536]/40 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${streak.color} mb-1.5`}>
                        <StreakIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-white">{streak.days}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Wealth Tracker */}
          <div className="bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#222736] rounded-2xl p-5 flex flex-col h-full min-h-[360px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Wealth Tracker</h3>
              <Wallet className="w-4 h-4 text-emerald-500 dark:text-emerald-450" />
            </div>

            <div className="mb-auto">
              <p className="text-[9px] font-bold text-slate-450 dark:text-slate-500 tracking-wider uppercase">Current Balance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{balanceText}</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-405">+2.4% this month</span>
              </div>
            </div>

            <div className="my-8 flex-1 flex items-center justify-center">
              <div className="w-full h-14 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-center">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Active Budgeting</span>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-1.5">
                  <span className="text-slate-550 dark:text-slate-400">Monthly Budget Progress</span>
                  <span className="text-slate-900 dark:text-white">{budgetProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#1e2536] rounded-full h-1.5 overflow-hidden border border-slate-250 dark:border-white/5">
                  <div className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${budgetProgress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1e2536]/40 border border-slate-200 dark:border-white/5 text-[11px] font-bold">
                <span className="px-2 py-0.5 rounded bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-slate-400">Next Goal</span>
                <span className="text-slate-700 dark:text-slate-350">{nextGoalText}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Knowledge Feed */}
          <div className="bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#222736] rounded-2xl p-5 flex flex-col h-full min-h-[360px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Knowledge Feed</h3>
              <BookOpen className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            </div>

            <div className="space-y-3 mb-6">
              {articles.map((article, idx) => (
                <div key={idx} className="flex gap-3 p-2 rounded-xl bg-slate-550/5 dark:bg-[#1e2536]/30 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#1e2536]/50 transition-all cursor-pointer">
                  <img src={article.img} alt={article.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-white/10 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate leading-snug">{article.title}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5 truncate">{article.source}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-3">
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Study Goals</p>
              <div className="space-y-2">
                {displayStudyGoals.map((goal, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#1e2536]/40 p-3 flex justify-between items-center text-xs font-bold">
                    <div className="absolute inset-y-0 left-0 bg-blue-500/10 transition-all duration-500" style={{ width: `${goal.progress}%` }} />
                    <span className="relative z-10 text-slate-805 dark:text-white font-semibold text-[11px]">{goal.title}</span>
                    <span className="relative z-10 text-blue-600 dark:text-blue-450 text-[10px]">{goal.progress}% Complete</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Row 3: Security & Sync */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Sync */}
          <div className="bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#222736] rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e2536] flex items-center justify-center border border-slate-200 dark:border-white/5">
                <RefreshCw className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Data Synchronization</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Last synced: 2 minutes ago</p>
              </div>
            </div>
            <button onClick={() => toast.success('Synchronizing data...')} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#1e2536] dark:hover:bg-[#232b3e] border border-slate-250 dark:border-[#2b354c] text-slate-800 dark:text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer">
              Sync Now
            </button>
          </div>

          {/* Privacy Shield */}
          <div className="bg-white dark:bg-[#161b26] border border-slate-200 dark:border-[#222736] rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e2536] flex items-center justify-center border border-slate-200 dark:border-white/5">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Privacy Shield</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Encryption level: AES-256 Active</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full">
              Secure
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
