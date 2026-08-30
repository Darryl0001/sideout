import type { TeamMember } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarStackProps {
  players: TeamMember[];
  isWinner: boolean;
  reversed?: boolean;
  mobile?: boolean;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AvatarStack({
  players,
  isWinner,
  mobile = false,
}: AvatarStackProps) {
  return (
    <div className="flex shrink-0 -space-x-2">
      {players.map((player, index) => (
        <Avatar
          key={player.id}
          className={[
            mobile ? 'size-8' : 'size-9',
            'border-2 border-background',
            isWinner ? 'ring-1 ring-foreground/10' : '',
            index > 0 ? 'relative' : '',
          ].join(' ')}
        >
          <AvatarImage src={player.avatarUrl} alt={player.displayName} />
          <AvatarFallback className="bg-muted text-[9px] font-medium text-muted-foreground">
            {getInitials(player.displayName)}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}