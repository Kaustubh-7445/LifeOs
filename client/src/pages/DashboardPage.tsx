import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CheckCircle, Target, Wallet, BookOpen, TrendingUp, Sparkles, Activity,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Header from '@/components/layout/Header';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { analyticsApi, aiApi } from '@/services';
import { useAuthStore } from '@/store';
import { formatCurrency } from '@/utils';
import Badge from '@/components/ui/Badge';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

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
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await analyticsApi.getDashboard()).data.data,
  });

  const { data: aiSuggestions } = useQuery({
    queryKey: ['ai-daily'],
    queryFn: async () => (await aiApi.getDailySuggestions()).data.data,
  });

  const { data: aiWeekly } = useQuery({
    queryKey: ['ai-weekly'],
    queryFn: async () => (await aiApi.getWeeklySummary()).data.data,
  });

  if (isLoading) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Loading..." />
        <div className="p-4 lg:p-8"><DashboardSkeleton /></div>
      </div>
    );
  }

  const expenseData = stats ? [
    { name: 'Income', value: stats.monthlyExpenses.income },
    { name: 'Expenses', value: stats.monthlyExpenses.expenses },
  ] : [];

  const goalChartData = stats?.goals.map((g) => ({ name: g.title.slice(0, 12), progress: g.progress })) || [];

  return (
    <div>
      <Header
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`}
        subtitle="Here's your life at a glance"
      />

      <motion.div
        className="p-4 lg:p-8 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 bg-gradient-to-r from-primary-600 to-purple-600 text-white"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-primary-100 text-sm">Productivity Score</p>
              <p className="text-4xl font-bold mt-1">{stats?.productivityScore || 0}%</p>
              <p className="text-primary-100 text-sm mt-1">Keep up the great work!</p>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
              <TrendingUp className="w-10 h-10" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <StatCard title="Tasks Done" value={stats?.dailySummary.tasksCompleted || 0} subtitle={`${stats?.dailySummary.tasksPending || 0} pending`} icon={CheckCircle} color="#10b981" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard title="Habits" value={`${stats?.habitCompletionRate || 0}%`} subtitle={`${stats?.dailySummary.habitsCompleted}/${stats?.dailySummary.habitsTotal} today`} icon={Target} color="#6366f1" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard title="Goal Progress" value={`${stats?.goalProgress || 0}%`} icon={Activity} color="#8b5cf6" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard title="Savings" value={formatCurrency(stats?.monthlyExpenses.savings || 0)} subtitle="This month" icon={Wallet} color="#f59e0b" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card title="Goal Progress">
              {goalChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={goalChartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm">No active goals yet</p>
              )}
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card title="Monthly Finances">
              {expenseData.some((d) => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                      {expenseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm">No financial data yet</p>
              )}
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card title="Active Goals">
              <div className="space-y-4">
                {stats?.goals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{goal.title}</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <ProgressBar value={goal.progress} color={goal.color} size="sm" />
                  </div>
                ))}
                {!stats?.goals.length && <p className="text-gray-500 text-sm">No goals yet</p>}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card title="Recent Activity" subtitle="Latest updates">
              <div className="space-y-3">
                {stats?.recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{new Date(item.updatedAt).toLocaleString()}</p>
                    </div>
                    <Badge variant={item.status === 'done' ? 'success' : 'info'}>{item.status}</Badge>
                  </div>
                ))}
                {!stats?.recentActivity.length && <p className="text-gray-500 text-sm">No recent activity</p>}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card title="AI Daily Suggestions" action={<Sparkles className="w-5 h-5 text-primary-500" />}>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {aiSuggestions?.text || 'Loading AI suggestions...'}
              </p>
              {aiSuggestions?.mock && (
                <p className="text-xs text-gray-400 mt-2">Add GEMINI_API_KEY to enable live AI suggestions</p>
              )}
            </div>
          </Card>
        </motion.div>

        {aiWeekly?.text && (
          <motion.div variants={itemVariants}>
            <Card title="AI Weekly Summary" action={<Sparkles className="w-5 h-5 text-primary-500" />}>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{aiWeekly.text}</p>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div variants={itemVariants}>
            <StatCard title="Learning Progress" value={`${stats?.learningProgress || 0}%`} icon={BookOpen} color="#ec4899" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
