import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, BookOpen, Youtube, FileText, StickyNote, Trash2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import StatCard from '@/components/ui/StatCard';
import { learningApi, aiApi } from '@/services';
import type { LearningResource } from '@/types';

const typeIcons: Record<string, typeof BookOpen> = {
  course: BookOpen,
  youtube: Youtube,
  article: FileText,
  note: StickyNote,
  book: BookOpen,
};

export default function LearningPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', type: 'course', url: '', category: 'general' });
  const queryClient = useQueryClient();

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['learning', filter],
    queryFn: async () => {
      const params = filter !== 'all' ? { type: filter } : undefined;
      return (await learningApi.getAll(params as Record<string, string>)).data.data.resources as LearningResource[];
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ['learning-analytics'],
    queryFn: async () => (await learningApi.getAnalytics()).data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => learningApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      setModalOpen(false);
      toast.success('Resource saved');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => learningApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['learning'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => learningApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['learning'] }); toast.success('Resource deleted'); },
  });

  const { data: aiLearning } = useQuery({
    queryKey: ['ai-learning'],
    queryFn: async () => (await aiApi.getLearningRecommendations()).data.data,
  });

  return (
    <div>
      <Header
        title="Learning Hub"
        subtitle={`${analytics?.completed || 0} completed · ${analytics?.totalMinutes || 0} min studied`}
        action={<Button onClick={() => setModalOpen(true)} icon={<Plus className="w-4 h-4" />}><span className="hidden sm:inline">Add Resource</span></Button>}
      />

      <div className="p-4 lg:p-8 space-y-6">
        {aiLearning?.text && (
          <Card title="AI Learning Recommendations" action={<Sparkles className="w-5 h-5 text-primary-500" />}>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{aiLearning.text}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="Total Resources" value={analytics?.total || 0} icon={BookOpen} color="#6366f1" />
          <StatCard title="Completed" value={analytics?.completed || 0} icon={BookOpen} color="#10b981" />
          <StatCard title="In Progress" value={analytics?.inProgress || 0} icon={BookOpen} color="#f59e0b" />
          <StatCard title="Avg Progress" value={`${analytics?.avgProgress || 0}%`} icon={BookOpen} color="#8b5cf6" />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {['all', 'course', 'youtube', 'article', 'note', 'book'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap ${filter === t ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-8 h-8 text-gray-400" />}
            title="No learning resources"
            description="Save courses, tutorials, and notes to track your learning"
            action={<Button onClick={() => setModalOpen(true)}>Add Resource</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => {
              const Icon = typeIcons[resource.type] || BookOpen;
              return (
                <Card key={resource._id}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{resource.title}</h3>
                      <p className="text-xs text-gray-500 capitalize">{resource.type} · {resource.category}</p>
                    </div>
                    <Badge variant={resource.status === 'completed' ? 'success' : 'info'}>{resource.status}</Badge>
                    <button onClick={() => deleteMutation.mutate(resource._id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <ProgressBar value={resource.progress} size="sm" />
                  <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <span>{resource.timeSpentMinutes} min</span>
                    <span>{resource.progress}%</span>
                  </div>
                  {resource.progress < 100 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full mt-3"
                      onClick={() => updateMutation.mutate({ id: resource._id, data: { progress: Math.min(100, resource.progress + 10) } })}
                    >
                      +10% Progress
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Save Resource">
        <form
          onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }}
          className="space-y-4"
        >
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              >
                {['course', 'youtube', 'article', 'note', 'book'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <Input label="URL (optional)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <Button type="submit" className="w-full" loading={createMutation.isPending}>Save Resource</Button>
        </form>
      </Modal>
    </div>
  );
}
