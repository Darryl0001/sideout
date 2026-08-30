import { Building2, Sun, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Location } from '@/types';

interface CourtListItemProps {
  court: Location;
  matchesCount: number;
  selected: boolean;
  onClick: () => void;
  index: number;
}

export function CourtListItem({
  court,
  matchesCount,
  selected,
  onClick,
  index,
}: CourtListItemProps) {
  const isIndoor = court.courtType === 'indoor';

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 24,
          delay: index * 0.03,
        }
      }}
      exit={{ opacity: 0, x: -12, transition: { duration: 0.12 } }}
      type="button"
      onClick={onClick}
      className={[
        'group w-full border-b border-border/60 px-4 py-5 text-left',
        'transition-colors duration-150',
        'focus-visible:bg-muted/50 focus-visible:outline-none',
        selected ? 'bg-muted/60' : 'hover:bg-muted/30',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className={[
              'truncate text-sm tracking-tight',
              selected ? 'font-semibold text-foreground' : 'font-medium text-foreground',
            ].join(' ')}
          >
            {court.name}
          </h3>

          {court.address && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {court.address}
            </p>
          )}
        </div>

        <ArrowUpRight
          className={[
            'mt-0.5 size-4 shrink-0 transition-all',
            selected
              ? 'text-foreground'
              : 'text-muted-foreground/40 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground',
          ].join(' ')}
        />
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          {isIndoor ? <Building2 className="size-3" /> : <Sun className="size-3" />}
          <span className="capitalize">{court.courtType}</span>
        </span>

        <span className="text-border">·</span>

        <span>
          {matchesCount} {matchesCount === 1 ? 'match' : 'matches'}
        </span>
      </div>
    </motion.button>
  );
}