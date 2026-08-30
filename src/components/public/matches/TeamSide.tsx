import type { TeamMember } from '@/types';
import { AvatarStack } from './AvatarStack';

interface TeamSideProps {
  players: TeamMember[];
  isWinner: boolean;
  align?: 'left' | 'right';
  mobile?: boolean;
}

export function TeamSide({
  players,
  isWinner,
  align = 'left',
  mobile = false,
}: TeamSideProps) {
  const right = align === 'right';

  return (
    <div
      className={[
        'flex min-w-0 items-center',
        mobile ? 'gap-2' : 'gap-3',
        right ? 'justify-end text-right' : 'justify-start',
      ].join(' ')}
    >
      {!right && (
        <AvatarStack players={players} isWinner={isWinner} mobile={mobile} />
      )}

      <div className="min-w-0">
        {players.map((player) => (
          <p
            key={player.id}
            className={[
              'truncate leading-5',
              mobile ? 'max-w-[88px] text-xs' : 'text-sm',
              isWinner
                ? 'font-semibold text-foreground'
                : 'font-medium text-muted-foreground',
            ].join(' ')}
          >
            {player.displayName}
          </p>
        ))}
      </div>

      {right && (
        <AvatarStack
          players={players}
          isWinner={isWinner}
          reversed
          mobile={mobile}
        />
      )}
    </div>
  );
}