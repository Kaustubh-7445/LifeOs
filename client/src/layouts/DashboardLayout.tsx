import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import AICopilot from '@/components/layout/AICopilot';
import { useSidebarStore } from '@/store';
import { cn } from '@/utils';

export default function DashboardLayout() {
  const { isCollapsed } = useSidebarStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] relative overflow-hidden grid-bg">
      {/* Premium Background Glow Mesh */}
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary-400/10 dark:bg-primary-600/5 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] rounded-full bg-purple-400/10 dark:bg-purple-600/5 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

      <Sidebar />
      <main
        className={cn(
          'transition-all duration-300 min-h-screen relative z-10',
          isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        )}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <AICopilot />
    </div>
  );
}
