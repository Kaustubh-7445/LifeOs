import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Calendar, LayoutGrid, List, Pencil, Trash2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { taskApi, aiApi } from '@/services';
import type { Task } from '@/types';
import { STATUS_COLUMNS, PRIORITY_COLORS, cn } from '@/utils';

const emptyForm = { title: '', description: '', priority: 'medium', category: 'personal', dueDate: '', status: 'todo' };

function TaskCard({
  task, isDragging, onEdit, onDelete,
}: {
  task: Task; isDragging?: boolean; onEdit?: (t: Task) => void; onDelete?: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'hover:shadow-md transition-shadow group',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="flex-1 cursor-grab active:cursor-grabbing min-w-0">
          <p className="font-medium text-sm mb-2">{task.title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
            {task.dueDate && (
              <span className="text-xs text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button onClick={() => onEdit(task)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Edit">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(task._id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500" aria-label="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  title, color, tasks, onEdit, onDelete,
}: { title: string; color: string; tasks: Task[]; onEdit: (t: Task) => void; onDelete: (id: string) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn('flex-1 min-w-[250px] rounded-2xl border-t-4 p-4 bg-gray-50/50 dark:bg-gray-900/50', color)}
    >
      <h3 className="font-semibold mb-3 flex items-center justify-between">
        {title}
        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">{tasks.length}</span>
      </h3>
      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[100px]">
          {tasks.map((task) => <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />)}
        </div>
      </SortableContext>
    </motion.div>
  );
}

export default function PlannerPage() {
  const [view, setView] = useState<'kanban' | 'list' | 'calendar' | 'week'>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const month = calendarMonth.getMonth() + 1;
  const year = calendarMonth.getFullYear();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => (await taskApi.getAll()).data.data.tasks as Task[],
  });

  const { data: calendarTasks = [] } = useQuery({
    queryKey: ['tasks-calendar', month, year],
    queryFn: async () => (await taskApi.getCalendar(month, year)).data.data.tasks as Task[],
    enabled: view === 'calendar',
  });

  const { data: aiPriority } = useQuery({
    queryKey: ['ai-task-priority'],
    queryFn: async () => (await aiApi.getTaskPrioritization()).data.data,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      editingId ? taskApi.update(editingId, data) : taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks-calendar'] });
      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success(editingId ? 'Task updated' : 'Task created');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (data: { id: string; status: string; order: number }[]) => taskApi.reorder(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (task: Task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status,
    });
    setModalOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    let newStatus = task.status;
    if (STATUS_COLUMNS.some((c) => c.id === over.id)) {
      newStatus = over.id as Task['status'];
    } else {
      const overTask = tasks.find((t) => t._id === over.id);
      if (overTask) newStatus = overTask.status;
    }
    if (newStatus !== task.status) {
      const columnTasks = tasks.filter((t) => t.status === newStatus);
      reorderMutation.mutate([{ id: taskId, status: newStatus, order: columnTasks.length }]);
    }
  };

  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const calDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: 0 }) });

  const displayTasks = view === 'calendar' ? calendarTasks : tasks;

  return (
    <div>
      <Header
        title="Smart Planner"
        subtitle="Kanban, weekly, monthly calendar & AI prioritization"
        action={
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {([
                { id: 'kanban' as const, icon: LayoutGrid },
                { id: 'list' as const, icon: List },
                { id: 'week' as const, icon: Calendar },
                { id: 'calendar' as const, icon: Calendar },
              ]).map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setView(id)} title={id}
                  className={cn('p-2 rounded-lg transition-colors', view === id ? 'bg-white dark:bg-gray-700 shadow-sm' : '')}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <Button onClick={openCreate} icon={<Plus className="w-4 h-4" />}><span className="hidden sm:inline">Add Task</span></Button>
          </div>
        }
      />

      <div className="p-4 lg:p-8 space-y-6">
        {aiPriority?.text && (
          <Card title="AI Task Prioritization" action={<Sparkles className="w-5 h-5 text-primary-500" />}>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{aiPriority.text}</p>
          </Card>
        )}

        {isLoading ? (
          <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        ) : displayTasks.length === 0 && view !== 'calendar' ? (
          <EmptyState
            icon={<LayoutGrid className="w-8 h-8 text-gray-400" />}
            title="No tasks yet"
            description="Create your first task to get started"
            action={<Button onClick={openCreate} icon={<Plus className="w-4 h-4" />}>Create Task</Button>}
          />
        ) : view === 'kanban' ? (
          <DndContext sensors={sensors} collisionDetection={closestCorners}
            onDragStart={(e) => setActiveTask(tasks.find((t) => t._id === e.active.id) || null)}
            onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUS_COLUMNS.map((col) => (
                <KanbanColumn key={col.id} title={col.title} color={col.color}
                  tasks={tasks.filter((t) => t.status === col.id)}
                  onEdit={openEdit} onDelete={(id) => deleteMutation.mutate(id)} />
              ))}
            </div>
            <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
          </DndContext>
        ) : view === 'list' ? (
          <Card>
            <motion.div layout className="space-y-2">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
                      <Badge variant={task.status === 'done' ? 'success' : 'info'}>{task.status}</Badge>
                      <button onClick={() => openEdit(task)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteMutation.mutate(task._id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </Card>
        ) : view === 'week' ? (
          <Card title="Weekly Planner">
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
              {weekDays.map((day) => {
                const dayTasks = tasks.filter((t) => t.dueDate && format(new Date(t.dueDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
                return (
                  <div key={day.toISOString()} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 min-h-[120px]">
                    <p className="text-xs font-semibold text-gray-500 mb-2">{format(day, 'EEE d')}</p>
                    {dayTasks.map((t) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={t._id}
                        onClick={() => openEdit(t)}
                        className="text-xs p-1.5 mb-1 rounded bg-primary-100 dark:bg-primary-900/30 cursor-pointer truncate"
                      >
                        {t.title}
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card title="Monthly Calendar"
            action={
              <div className="flex items-center gap-2">
                <button onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm font-medium">{format(calendarMonth, 'MMMM yyyy')}</span>
                <button onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronRight className="w-4 h-4" /></button>
              </div>
            }>
            <div className="overflow-x-auto">
              <div className="min-w-[600px] md:min-w-0">
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="font-medium text-gray-500 py-2">{d}</div>
                  ))}
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => <div key={`pad-${i}`} />)}
                  {calDays.map((day) => {
                    const dayTasks = calendarTasks.filter((t) => t.dueDate && format(new Date(t.dueDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
                    return (
                      <div key={day.toISOString()} className="min-h-[70px] p-1 rounded-lg border border-gray-100 dark:border-gray-800 text-left">
                        <span className="text-xs text-gray-500">{format(day, 'd')}</span>
                        {dayTasks.slice(0, 3).map((t) => (
                          <div key={t._id} onClick={() => openEdit(t)} className="text-xs bg-primary-100 dark:bg-primary-900/30 rounded px-1 mt-0.5 truncate cursor-pointer">{t.title}</div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); }} title={editingId ? 'Edit Task' : 'Create Task'}>
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate({ ...form, dueDate: form.dueDate || undefined }); }} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                {['low', 'medium', 'high', 'urgent'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          {editingId && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                {STATUS_COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          )}
          <Button type="submit" className="w-full" loading={saveMutation.isPending}>{editingId ? 'Save Changes' : 'Create Task'}</Button>
        </form>
      </Modal>
    </div>
  );
}
