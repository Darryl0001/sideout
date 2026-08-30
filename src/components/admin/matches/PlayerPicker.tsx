import { useState } from 'react';
import type { Player, TeamMember } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { UserPlus, X, Check } from 'lucide-react';

interface PlayerPickerProps {
  label: string;
  count: number;
  availablePlayers: Player[];
  selectedMembers: TeamMember[];
  onChange: (members: TeamMember[]) => void;
  disabledPlayerIds: string[];
}

export function PlayerPicker({
  label,
  count,
  availablePlayers,
  selectedMembers,
  onChange,
  disabledPlayerIds,
}: PlayerPickerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleSelectPlayer = (
    player: Player,
    index: number
  ) => {
    const updated = [...selectedMembers];

    updated[index] = {
      id: player.id,
      displayName: player.displayName,
      avatarUrl: player.avatarUrl,
    };

    onChange(updated);
    setOpenIndex(null);
  };

  const handleRemovePlayer = (index: number) => {
    onChange(
      selectedMembers.filter((_, i) => i !== index)
    );
  };

  const slots = Array.from({ length: count });

  return (
    <div className="min-w-0 space-y-2">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>

      <div className="space-y-1.5">
        {slots.map((_, index) => {
          const member = selectedMembers[index];

          if (member) {
            return (
              <div
                key={member.id}
                className="group flex h-11 items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-2.5"
              >
                <Avatar className="size-7 rounded-md">
                  <AvatarImage
                    src={member.avatarUrl}
                    alt={member.displayName}
                  />

                  <AvatarFallback className="rounded-md bg-muted text-[10px] font-semibold">
                    {member.displayName
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <span className="min-w-0 flex-1 truncate text-xs font-medium">
                  {member.displayName}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePlayer(index)}
                  className="size-6 rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-destructive group-hover:opacity-100"
                >
                  <X className="size-3" />
                </Button>
              </div>
            );
          }

          return (
            <Popover
              key={`empty-${index}`}
              open={openIndex === index}
              onOpenChange={(open) =>
                setOpenIndex(open ? index : null)
              }
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-start gap-2 rounded-lg border-dashed border-border/70 bg-transparent px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                >
                  <span className="flex size-7 items-center justify-center rounded-md bg-muted">
                    <UserPlus className="size-3.5" />
                  </span>

                  Add player
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-[260px] overflow-hidden rounded-xl border-border/60 p-0 shadow-xl"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search players..."
                    className="h-9 text-xs"
                  />

                  <CommandList>
                    <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
                      No players found.
                    </CommandEmpty>

                    <CommandGroup className="p-1.5">
                      {availablePlayers.map((player) => {
                        const isDisabled =
                          disabledPlayerIds.includes(player.id);

                        return (
                          <CommandItem
                            key={player.id}
                            disabled={isDisabled}
                            onSelect={() =>
                              handleSelectPlayer(
                                player,
                                index
                              )
                            }
                            className="cursor-pointer rounded-lg px-2 py-2"
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-2.5">
                              <Avatar className="size-7 rounded-md">
                                <AvatarImage
                                  src={player.avatarUrl}
                                  alt={player.displayName}
                                />

                                <AvatarFallback className="rounded-md text-[10px]">
                                  {player.displayName
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <span className="truncate text-xs font-medium">
                                {player.displayName}
                              </span>
                            </div>

                            {isDisabled && (
                              <Check className="size-3.5 text-muted-foreground" />
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}