import { Users } from 'lucide-react';

export function EmptySearchState() {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-14 text-center">
      <Users className="mx-auto size-5 text-muted-foreground/50" />
      <p className="mt-3 text-sm font-medium text-foreground">No players found</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Try searching for a different player name.
      </p>
    </div>
  );
}