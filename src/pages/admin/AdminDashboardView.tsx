import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { DashboardKPIs } from '@/components/admin/dashboard/DashboardKPIs';
import { LeaderboardTable } from '@/components/admin/dashboard/LeaderboardTable';

export function AdminDashboardView() {
  const { players, matches } = useData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6 w-full"
    >
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h2>
      </motion.div>

      <DashboardKPIs players={players} matches={matches} />
      <LeaderboardTable players={players} matches={matches} />
    </motion.div>
  );
}