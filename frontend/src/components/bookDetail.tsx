'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBookById, borrowBook, type Book } from '../services/api';
import {
  ArrowLeft,
  Calendar,
  Globe,
  Hash,
  Layers,
  User,
  Building,
  BookOpen,
  Filter,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format, addDays } from 'date-fns';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  // Borrow form state
  const [borrowedTo, setBorrowedTo] = useState('');
  const [dueDate, setDueDate] = useState(
    format(addDays(new Date(), 14), 'yyyy-MM-dd')
  ); // Default to 2 weeks
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      fetchBookById(id)
        .then((data) => {
          // Add a 2-second delay to show the skeleton loading state
          setTimeout(() => {
            setBook(data);
            setLoading(false);
          }, 1000);
        })
        .catch((err) => {
          setTimeout(() => {
            setError(err.message);
            setLoading(false);
          }, 1000);
        });
    }
  }, [id]);

  const handleBorrow = async () => {
    if (!book || !id) return;

    setBorrowing(true);
    try {
      await borrowBook({
        bookId: id,
        borrowedTo,
        dueDate: new Date(dueDate),
        notes,
      });

      setBorrowSuccess(true);
      // Update book availability
      setBook({ ...book, isAvailable: false });

      // Close dialog after 2 seconds
      setTimeout(() => {
        setBorrowDialogOpen(false);
        setBorrowSuccess(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <Skeleton className="h-32 w-full mt-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert>
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>Book not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild className="-ml-2 gap-1">
          <Link to="/books">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>

        <Link to="/borrowed">
          <Button variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            My Borrowed Books
          </Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-6">{book.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <AspectRatio ratio={2 / 3}>
              <img
                src={
                  book.coverImageUrl || '/placeholder.svg?height=450&width=300'
                }
                alt={book.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>

            <CardFooter className="p-4">
              <div className="w-full">
                <Badge
                  variant={book.isAvailable ? 'success' : 'destructive'}
                  className="w-full justify-center py-1.5 mb-3"
                >
                  {book.isAvailable ? 'Available' : 'Currently Borrowed'}
                </Badge>

                {book.isAvailable ? (
                  <Dialog
                    open={borrowDialogOpen}
                    onOpenChange={setBorrowDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full">Borrow this Book</Button>
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
                              onClick={() => setBorrowDialogOpen(false)}
                              disabled={borrowing}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleBorrow}
                              disabled={!borrowedTo || !dueDate || borrowing}
                            >
                              {borrowing
                                ? 'Processing...'
                                : 'Confirm Borrowing'}
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Not Available
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Author:</span>
                  <span>{book.author}</span>
                </div>

                {book.publicationYear && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Year:</span>
                    <span>{book.publicationYear}</span>
                  </div>
                )}

                {book.isbn && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">ISBN:</span>
                    <span>{book.isbn}</span>
                  </div>
                )}

                {book.publisher && (
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Publisher:</span>
                    <span>{book.publisher}</span>
                  </div>
                )}

                {book.pageCount && (
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Page count:</span>
                    <span>{book.pageCount}</span>
                  </div>
                )}

                {book.language && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Language:</span>
                    <span>{book.language}</span>
                  </div>
                )}

                {book.categories && book.categories.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Categories:</span>
                    <div className="flex flex-wrap gap-1">
                      {book.categories.map((categoryOnBook) => (
                        <Badge
                          key={categoryOnBook.categoryId}
                          variant="secondary"
                        >
                          {categoryOnBook.category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {book.description && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
