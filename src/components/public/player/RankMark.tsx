import { Gem, Crown, Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PlayerRank } from '@/types';

interface RankMarkProps {
  rank: PlayerRank;
  className?: string;
}

export function RankMark({ rank, className = 'size-4' }: RankMarkProps) {
  const renderIcon = () => {
    switch (rank) {
      case 'Diamond':
        return <Gem className={className} />;
      case 'Platinum':
        return <Crown className={className} />;
      case 'Gold':
        return <Trophy className={className} />;
      case 'Silver':
      case 'Bronze':
      default:
        return <Medal className={className} />;
    }
  };

  return (
    <motion.span
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className="inline-flex items-center justify-center"
    >
      {renderIcon()}
    </motion.span>
  );
}