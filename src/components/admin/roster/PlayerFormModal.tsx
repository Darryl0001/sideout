import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Player } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    playerData: Omit<Player, 'id' | 'stats' | 'createdAt'>
  ) => void;
  initialData?: Player | null;
}

export function PlayerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: PlayerFormModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [slug, setSlug] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isRotating, setIsRotating] = useState(false);

  const generateNewAvatar = (nameSeed?: string) => {
    setIsRotating(true);
    const seed =
      nameSeed?.trim() ||
      Math.random().toString(36).substring(2, 8);

    setAvatarUrl(
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`
    );

    setTimeout(() => setIsRotating(false), 500);
  };

  useEffect(() => {
    if (initialData) {
      setDisplayName(initialData.displayName);
      setSlug(initialData.slug);
      setAvatarUrl(initialData.avatarUrl);
    } else {
      setDisplayName('');
      setSlug('');
      generateNewAvatar();
    }
  }, [initialData, isOpen]);

  const handleNameChange = (name: string) => {
    setDisplayName(name);

    if (!initialData) {
      const formattedSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      setSlug(formattedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim() || !slug.trim()) return;

    onSubmit({
      displayName: displayName.trim(),
      slug: slug.trim(),
      avatarUrl:
        avatarUrl ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
          displayName
        )}`,
    });

    onClose();
  };

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'P';

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="overflow-hidden rounded-2xl border-border/60 bg-background p-0 shadow-2xl sm:max-w-[420px]">
        <form onSubmit={handleSubmit} autoComplete="off">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-base font-semibold tracking-tight">
              {initialData ? 'Edit player' : 'Add player'}
            </DialogTitle>

            <DialogDescription className="sr-only">
              {initialData
                ? 'Edit player information'
                : 'Create a new player profile'}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6">
            {/* Player identity */}
            <div className="mb-7 flex items-center gap-4">
              <motion.div
                key={avatarUrl}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              >
                <Avatar className="size-[68px] rounded-xl border border-border/70 bg-muted">
                  <AvatarImage
                    src={avatarUrl}
                    alt={`${displayName || 'Player'} avatar`}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-xl bg-muted text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={displayName || 'new-player'}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="truncate text-[15px] font-semibold tracking-tight"
                  >
                    {displayName || 'New player'}
                  </motion.p>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={slug || 'handle'}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="mt-0.5 truncate text-xs text-muted-foreground"
                  >
                    {slug ? `@${slug}` : 'Player handle'}
                  </motion.p>
                </AnimatePresence>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => generateNewAvatar(displayName)}
                  className="-ml-2 mt-1.5 h-7 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <motion.div
                    animate={{ rotate: isRotating ? 360 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <RefreshCw className="mr-1.5 size-3" />
                  </motion.div>
                  Randomize avatar
                </Button>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="display-name"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Name
                </label>

                <Input
                  id="display-name"
                  type="text"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={displayName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Alex Perez"
                  className="h-10 rounded-lg bg-muted/30 shadow-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="player-slug"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Handle
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    @
                  </span>

                  <Input
                    id="player-slug"
                    type="text"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="alex-perez"
                    className="h-10 rounded-lg bg-muted/30 pl-7 shadow-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 border-t border-border/50 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-9 rounded-lg px-3 text-sm"
            >
              Cancel
            </Button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Button
                type="submit"
                className="h-9 rounded-lg px-4 text-sm font-medium"
              >
                {initialData ? 'Save changes' : 'Add player'}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}