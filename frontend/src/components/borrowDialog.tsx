// components/BorrowDialog.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format, addDays } from 'date-fns';
import { BorrowDialogProps } from '@/types/type';

export const BorrowDialog: React.FC<BorrowDialogProps> = ({
  book,
  onBorrow,
}) => {
  const [open, setOpen] = useState(false);
  const [borrowedTo, setBorrowedTo] = useState('');
  const [dueDate, setDueDate] = useState(
    format(addDays(new Date(), 14), 'yyyy-MM-dd')
  );
  const [notes, setNotes] = useState('');
  const [borrowing, setBorrowing] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setBorrowing(true);
    try {
      await onBorrow({
        bookId: book.id, // Ajoutez cette ligne pour inclure l'ID du livre
        borrowedTo,
        dueDate: new Date(dueDate),
        notes,
      });
      setBorrowSuccess(true);

      // Fermeture automatique après succès
      setTimeout(() => {
        setOpen(false);
        setBorrowSuccess(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={!book.isAvailable}>
          {book.isAvailable ? 'Borrow this Book' : 'Not Available'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Borrow "{book.title}"</DialogTitle>
          <DialogDescription>
            Fill in the details to borrow this book.
          </DialogDescription>
        </DialogHeader>

        {borrowSuccess ? (
          <Alert className="mt-2">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Book has been borrowed successfully.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="borrowedTo">Borrower Name</Label>
                <Input
                  id="borrowedTo"
                  value={borrowedTo}
                  onChange={(e) => setBorrowedTo(e.target.value)}
                  placeholder="Enter name of borrower"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this borrowing"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={borrowing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!borrowedTo || !dueDate || borrowing}
              >
                {borrowing ? 'Processing...' : 'Confirm Borrowing'}
              </Button>
            </DialogFooter>
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
