import { MapPin, User, Users } from 'lucide-react';
import type { Match } from '@/types';

interface MatchMetadataProps {
  type: Match['matchType'];
  court: string;
  time: string;
}

export function MatchMetadata({ type, court, time }: MatchMetadataProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
      {type === 'singles' ? (
        <User className="size-3 shrink-0" />
      ) : (
        <Users className="size-3 shrink-0" />
      )}

      <span className="capitalize">{type}</span>
      <span className="text-border">·</span>
      <MapPin className="size-3 shrink-0 text-muted-foreground/70" />

      <span className="max-w-[110px] truncate">{court}</span>
      <span className="text-border">·</span>

      <span className="shrink-0">{time}</span>
    </div>
  );
}