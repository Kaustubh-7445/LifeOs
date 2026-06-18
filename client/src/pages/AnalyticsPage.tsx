import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import { analyticsApi, aiApi } from '@/services';
import { formatCurrency } from '@/utils';
import { Target, CheckCircle, Flame, BookOpen } from 'lucide-react';

const periods = ['weekly', 'monthly', 'yearly'] as const;

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<typeof periods[number]>('monthly');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', period],
    queryFn: async () => (await analyticsApi.getAnalytics(period)).data.data,
  });

  const { data: aiInsights } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => (await aiApi.getImprovementInsights()).data.data,
  });

  if (isLoading) {
    return (
      <div>
        <Header title="Analytics" />
        <div className="p-8"><div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl" /></div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Analytics Dashboard" subtitle="Insights across all life areas" />

      <div className="p-4 lg:p-8 space-y-6">
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${period === p ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Task Completion" value={`${analytics?.productivity?.completionRate || 0}%`} icon={CheckCircle} color="#10b981" />
          <StatCard title="Active Goals" value={analytics?.goals?.active || 0} icon={Target} color="#8b5cf6" />
          <StatCard title="Habits Tracked" value={analytics?.habits?.total || 0} icon={Flame} color="#f59e0b" />
          <StatCard title="Learning Avg" value={`${analytics?.learning?.avgProgress || 0}%`} icon={BookOpen} color="#6366f1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Tasks by Status">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics?.productivity?.tasksByStatus || []}>
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Financial Trend">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics?.expenses?.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Expense Breakdown">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics?.expenses?.byCategory || []} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={80} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Learning by Type">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics?.learning?.byType || []}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card title="AI Improvement Insights" action={<Sparkles className="w-5 h-5 text-primary-500" />}>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
            {aiInsights?.text || 'Loading insights...'}
          </p>
        </Card>
      </div>
    </div>
  );
}
