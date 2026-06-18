import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, TrendingUp, TrendingDown, PiggyBank, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { expenseApi } from '@/services';
import type { Expense, Budget } from '@/types';
import { formatCurrency, EXPENSE_CATEGORIES } from '@/utils';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444'];

export default function ExpensesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense', category: 'food' });
  const [budgetForm, setBudgetForm] = useState({ name: '', category: 'food', amount: '' });
  const queryClient = useQueryClient();

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => (await expenseApi.getAll()).data.data.expenses as Expense[],
  });

  const { data: budgetsData } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => (await expenseApi.getBudgets()).data.data,
  });

  const { data: report } = useQuery({
    queryKey: ['expense-report'],
    queryFn: async () => (await expenseApi.getReport('monthly')).data.data,
  });

  const budgets = (budgetsData?.budgets || []) as Budget[];

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => expenseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-report'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setModalOpen(false);
      toast.success('Transaction added');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-report'] });
      toast.success('Transaction deleted');
    },
  });

  const createBudgetMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => expenseApi.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setBudgetModalOpen(false);
      setBudgetForm({ name: '', category: 'food', amount: '' });
      toast.success('Budget created');
    },
  });

  const pieData = report?.byCategory || [];

  return (
    <div>
      <Header
        title="Expense Tracker"
        subtitle="Manage income, expenses, and budgets"
        action={<Button onClick={() => setModalOpen(true)} icon={<Plus className="w-4 h-4" />}><span className="hidden sm:inline">Add Transaction</span></Button>}
      />

      <div className="p-4 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Income" value={formatCurrency(report?.income || 0)} icon={TrendingUp} color="#10b981" />
          <StatCard title="Expenses" value={formatCurrency(report?.expenses || 0)} icon={TrendingDown} color="#ef4444" />
          <StatCard title="Savings" value={formatCurrency(report?.savings || 0)} icon={PiggyBank} color="#6366f1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Expenses by Category">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="amount" nameKey="category" label>
                    {pieData.map((_: unknown, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm">No expense data</p>
            )}
          </Card>

          <Card title="Budgets" action={<Button size="sm" variant="secondary" onClick={() => setBudgetModalOpen(true)}>Add Budget</Button>}>
            <div className="space-y-4">
              {budgets.map((b) => (
                <div key={b._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{b.name}</span>
                    <span>{formatCurrency(b.spent)} / {formatCurrency(b.amount)}</span>
                  </div>
                  <ProgressBar
                    value={b.percentUsed || 0}
                    color={(b.percentUsed || 0) >= b.alertThreshold ? '#ef4444' : '#6366f1'}
                    size="sm"
                  />
                </div>
              ))}
              {!budgets.length && <p className="text-gray-500 text-sm">No budgets set</p>}
            </div>
          </Card>
        </div>

        <Card title="Recent Transactions">
          <div className="space-y-2">
            {expenses.slice(0, 10).map((exp) => (
              <div key={exp._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div>
                  <p className="font-medium">{exp.title}</p>
                  <p className="text-xs text-gray-500">{exp.category} · {new Date(exp.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={exp.type === 'income' ? 'success' : 'danger'}>{exp.type}</Badge>
                  <span className={`font-semibold ${exp.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {exp.type === 'income' ? '+' : '-'}{formatCurrency(exp.amount)}
                  </span>
                  <button onClick={() => deleteMutation.mutate(exp._id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500" aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {!expenses.length && <p className="text-gray-500 text-sm">No transactions yet</p>}
          </div>
        </Card>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Transaction">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({ ...form, amount: parseFloat(form.amount) });
          }}
          className="space-y-4"
        >
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              >
                {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full" loading={createMutation.isPending}>Add Transaction</Button>
        </form>
      </Modal>

      <Modal isOpen={budgetModalOpen} onClose={() => setBudgetModalOpen(false)} title="Create Budget">
        <form onSubmit={(e) => { e.preventDefault(); createBudgetMutation.mutate({ ...budgetForm, amount: parseFloat(budgetForm.amount) }); }} className="space-y-4">
          <Input label="Budget Name" value={budgetForm.name} onChange={(e) => setBudgetForm({ ...budgetForm, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select value={budgetForm.category} onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Amount" type="number" value={budgetForm.amount} onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })} required />
          </div>
          <Button type="submit" className="w-full" loading={createBudgetMutation.isPending}>Create Budget</Button>
        </form>
      </Modal>
    </div>
  );
}
