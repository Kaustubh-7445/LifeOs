import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Check, TrendingUp, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import StatCard from '@/components/ui/StatCard';
import { habitApi } from '@/services';
import type { Habit } from '@/types';
import { cn } from '@/utils';

const POPULAR_EMOJIS = [
  '🏃', '🧘', '💪', '🚴', '💧', '🥗', '🍎', '🚶',
  '📚', '💻', '✍️', '🧠', '🎨', '🎵', '☀️', '🌙',
  '🎯', '💼', '💰', '📈', '🧹', '🌱', '🔋', '🍵'
];

export default function HabitsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '🎯', color: '#6366f1' });
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => (await habitApi.getAll()).data.data.habits as Habit[],
  });

  const { data: stats } = useQuery({
    queryKey: ['habit-stats'],
    queryFn: async () => (await habitApi.getStats()).data.data.stats,
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => habitApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      setModalOpen(false);
      toast.success('Habit created');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => habitApi.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => habitApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success('Habit deleted');
    },
  });

  const isCompletedToday = (habit: Habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.completions.some((c) => {
      const d = new Date(c.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime() && c.completed;
    });
  };

  const totalStreak = habits.reduce((s, h) => s + h.streak, 0);
  const avgCompletion = stats?.length
    ? Math.round(stats.reduce((s: number, h: { completionRate: number }) => s + h.completionRate, 0) / stats.length)
    : 0;

  return (
    <div>
      <Header
        title="Habit Tracker"
        subtitle="Build consistency one day at a time"
        action={<Button onClick={() => setModalOpen(true)} icon={<Plus className="w-4 h-4" />}><span className="hidden sm:inline">Add Habit</span></Button>}
      />

      <div className="p-4 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Active Habits" value={habits.length} icon={Flame} color="#f59e0b" />
          <StatCard title="Total Streak" value={totalStreak} subtitle="days combined" icon={TrendingUp} color="#ef4444" />
          <StatCard title="Avg Completion" value={`${avgCompletion}%`} icon={Check} color="#10b981" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <EmptyState
            icon={<Flame className="w-8 h-8 text-gray-400" />}
            title="No habits yet"
            description="Start building positive habits today"
            action={<Button onClick={() => setModalOpen(true)}>Create Habit</Button>}
          />
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {habits.map((habit, i) => {
                const done = isCompletedToday(habit);
                return (
                  <motion.div
                    key={habit._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22, delay: i * 0.03 }}
                  >
                    <Card className="hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{habit.icon}</span>
                          <div>
                            <h3 className="font-semibold">{habit.name}</h3>
                            <p className="text-xs text-gray-500">{habit.frequency}</p>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => toggleMutation.mutate(habit._id)}
                          className={cn(
                            'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer',
                            done
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                          )}
                          aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {done && (
                            <motion.div
                              initial={{ scale: 0, rotate: -30 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                            >
                              <Check className="w-5 h-5" />
                            </motion.div>
                          )}
                        </motion.button>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-orange-500">
                          <Flame className="w-4 h-4" />
                          <span className="font-medium">{habit.streak} day streak</span>
                        </div>
                        <span className="text-gray-400">Best: {habit.bestStreak}</span>
                        <button onClick={() => deleteMutation.mutate(habit._id)} className="ml-auto p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500" aria-label="Delete habit">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {habit.completions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {Array.from({ length: 14 }).map((_, di) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (13 - di));
                            d.setHours(0, 0, 0, 0);
                            const done = habit.completions.some((c) => {
                              const cd = new Date(c.date);
                              cd.setHours(0, 0, 0, 0);
                              return cd.getTime() === d.getTime() && c.completed;
                            });
                            return (
                              <div key={di} title={d.toLocaleDateString()}
                                className={cn('w-4 h-4 rounded-sm', done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700')} />
                            );
                          })}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Habit">
        <form
          onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }}
          className="space-y-4"
        >
          <Input label="Habit Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Select Icon</label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 border border-gray-200 dark:border-gray-700/80 rounded-xl bg-gray-50 dark:bg-gray-900/40">
              {POPULAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm({ ...form, icon: emoji })}
                  className={cn(
                    "text-2xl p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/60 transition-all flex items-center justify-center cursor-pointer border",
                    form.icon === emoji 
                      ? "bg-primary-500/20 border-primary-500 text-primary-400" 
                      : "border-transparent"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Custom Icon (emoji)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            <Input label="Color" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" loading={createMutation.isPending}>Create Habit</Button>
        </form>
      </Modal>
    </div>
  );
}
