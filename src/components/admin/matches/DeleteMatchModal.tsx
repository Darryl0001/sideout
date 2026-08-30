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

interface DeleteMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteMatchModal({ isOpen, onClose, onConfirm }: DeleteMatchModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          {/* Luma Style Icon Badge */}
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shrink-0 mb-2">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <AlertDialogTitle>Delete Match Record?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This record will be permanently purged from historical logs, and involved player win rates and streaks will be recalculated.
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
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}