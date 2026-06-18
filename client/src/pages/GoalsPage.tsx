import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Trophy, Calendar, Trash2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { goalApi, aiApi } from '@/services';
import type { Goal } from '@/types';
import { GOAL_CATEGORIES, formatDate } from '@/utils';

export default function GoalsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [milestoneModal, setMilestoneModal] = useState<string | null>(null);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    title: '', description: '', category: 'personal', targetValue: 100,
    currentValue: 0, unit: '%', deadline: '', color: '#8b5cf6',
  });
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', filter],
    queryFn: async () => {
      const params = filter !== 'all' ? { category: filter } : undefined;
      return (await goalApi.getAll(params as Record<string, string>)).data.data.goals as Goal[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => goalApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setModalOpen(false);
      toast.success('Goal created');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => goalApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => goalApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); toast.success('Goal deleted'); },
  });

  const { data: aiGoals } = useQuery({
    queryKey: ['ai-goals'],
    queryFn: async () => (await aiApi.getGoalRecommendations()).data.data,
  });

  const completed = goals.filter((g) => g.status === 'completed').length;

  return (
    <div>
      <Header
        title="Goals"
        subtitle={`${completed} completed · ${goals.filter((g) => g.status === 'active').length} active`}
        action={<Button onClick={() => setModalOpen(true)} icon={<Plus className="w-4 h-4" />}><span className="hidden sm:inline">Add Goal</span></Button>}
      />

      <div className="p-4 lg:p-8 space-y-6">
        {aiGoals?.text && (
          <Card title="AI Goal Recommendations" action={<Sparkles className="w-5 h-5 text-primary-500" />}>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{aiGoals.text}</p>
          </Card>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            All
          </button>
          {GOAL_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${filter === c.value ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <EmptyState
            icon={<Trophy className="w-8 h-8 text-gray-400" />}
            title="No goals yet"
            description="Set your first goal and start tracking progress"
            action={<Button onClick={() => setModalOpen(true)}>Create Goal</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, i) => {
              const progress = goal.progress ?? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              const cat = GOAL_CATEGORIES.find((c) => c.value === goal.category);
              return (
                <motion.div key={goal._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span>{cat?.icon}</span>
                          <h3 className="font-semibold">{goal.title}</h3>
                        </div>
                        {goal.deadline && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(goal.deadline)}
                          </p>
                        )}
                      </div>
                      <Badge variant={goal.status === 'completed' ? 'success' : 'info'}>{goal.status}</Badge>
                    </div>
                    <ProgressBar value={progress} color={goal.color || cat?.color} showLabel />
                    <p className="text-sm text-gray-500 mt-2">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </p>
                    {goal.milestones?.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {goal.milestones.slice(0, 3).map((m) => (
                          <label key={m._id || m.title} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={m.completed}
                              onChange={() => m._id && goalApi.toggleMilestone(goal._id, m._id).then(() => queryClient.invalidateQueries({ queryKey: ['goals'] }))}
                              className="rounded"
                            />
                            <span className={m.completed ? 'line-through text-gray-400' : ''}>{m.title}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Button size="sm" variant="secondary"
                        onClick={() => updateMutation.mutate({ id: goal._id, data: { currentValue: Math.min(goal.targetValue, goal.currentValue + 10) } })}>
                        +10 Progress
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setMilestoneModal(goal._id)}>Add Milestone</Button>
                      <button onClick={() => deleteMutation.mutate(goal._id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 ml-auto" aria-label="Delete goal">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Goal" size="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({ ...form, deadline: form.deadline || undefined });
          }}
          className="space-y-4"
        >
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              >
                {GOAL_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Target" type="number" value={form.targetValue} onChange={(e) => setForm({ ...form, targetValue: +e.target.value })} />
            <Input label="Current" type="number" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: +e.target.value })} />
            <Input label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" loading={createMutation.isPending}>Create Goal</Button>
        </form>
      </Modal>

      <Modal isOpen={!!milestoneModal} onClose={() => setMilestoneModal(null)} title="Add Milestone">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (milestoneModal) {
            goalApi.addMilestone(milestoneModal, { title: milestoneTitle }).then(() => {
              queryClient.invalidateQueries({ queryKey: ['goals'] });
              setMilestoneModal(null);
              setMilestoneTitle('');
              toast.success('Milestone added');
            });
          }
        }} className="space-y-4">
          <Input label="Milestone Title" value={milestoneTitle} onChange={(e) => setMilestoneTitle(e.target.value)} required />
          <Button type="submit" className="w-full">Add Milestone</Button>
        </form>
      </Modal>
    </div>
  );
}
