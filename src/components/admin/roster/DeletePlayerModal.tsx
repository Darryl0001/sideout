import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeletePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  playerName?: string;
}

export function DeletePlayerModal({
  isOpen,
  onClose,
  onConfirm,
  playerName,
}: DeletePlayerModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          {/* Luma Style Destructive Icon Badge */}
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shrink-0 mb-2">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <AlertDialogTitle>Remove Player?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>
              Are you sure you want to remove{' '}
              <strong className="text-foreground">
                {playerName ? playerName : 'this player'}
              </strong>{' '}
              from the active roster?
            </span>
            <span className="block text-xs text-muted-foreground/80 mt-1.5">
              Historical matches associated with this player will retain their record data to keep total community statistics accurate.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="rounded-full">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-full"
          >
            Remove Player
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}