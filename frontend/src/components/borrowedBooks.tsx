'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchBorrowedBooks,
  returnBook,
  type BorrowRecord,
} from '../services/api';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  Clock,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format, isAfter } from 'date-fns';

const BorrowedBooks: React.FC = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    fetchBorrowedBooks()
      .then((data) => {
        // Add a 2-second delay to show the skeleton loading state
        setTimeout(() => {
          setBorrowedBooks(data);
          setLoading(false);
        }, 2000);
      })
      .catch((err) => {
        setTimeout(() => {
          setError(err.message);
          setLoading(false);
        }, 2000);
      });
  }, []);

  const handleReturnBook = async (borrowId: string) => {
    setReturningId(borrowId);
    try {
      await returnBook(borrowId);
      // Update the list by marking the book as returned
      setBorrowedBooks(
        borrowedBooks.map((record) =>
          record.id === borrowId
            ? { ...record, returnedDate: new Date() }
            : record
        )
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setReturningId(null);
    }
  };

  const isOverdue = (dueDate: Date) => {
    return isAfter(new Date(), new Date(dueDate));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">
          My Borrowed Books
        </h2>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="h-[150px] w-[100px] rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (borrowedBooks.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="-ml-2 mr-4">
            <Link to="/books">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            My Borrowed Books
          </h2>
        </div>

        <Alert>
          <AlertTitle>No borrowed books</AlertTitle>
          <AlertDescription>
            You haven't borrowed any books yet. Browse the library to find books
            to borrow.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button variant="ghost" asChild className="-ml-2 mr-4">
          <Link to="/books">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">My Borrowed Books</h2>
      </div>

      <div className="grid gap-6">
        {borrowedBooks.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {record.book?.coverImageUrl && (
                  <img
                    src={
                      record.book.coverImageUrl ||
                      '/placeholder.svg?height=225&width=150'
                    }
                    alt={record.book?.title}
                    className="h-[150px] w-[100px] object-cover rounded"
                  />
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {record.book?.title || 'Unknown Book'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Borrowed to: {record.borrowedTo}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Borrowed on:{' '}
                        {format(new Date(record.borrowedDate), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Due date:{' '}
                        {format(new Date(record.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>

                    {record.returnedDate && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">
                          Returned on:{' '}
                          {format(new Date(record.returnedDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>

                  {record.notes && (
                    <p className="text-sm text-muted-foreground mb-4">
                      <span className="font-medium">Notes:</span> {record.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        record.returnedDate
                          ? 'outline'
                          : isOverdue(record.dueDate)
                          ? 'destructive'
                          : 'success'
                      }
                    >
                      {record.returnedDate
                        ? 'Returned'
                        : isOverdue(record.dueDate)
                        ? 'Overdue'
                        : 'Active'}
                    </Badge>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/books/${record.bookId}`}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Book
                        </Link>
                      </Button>

                      {!record.returnedDate && (
                        <Button
                          size="sm"
                          onClick={() => handleReturnBook(record.id)}
                          disabled={!!returningId}
                        >
                          {returningId === record.id
                            ? 'Processing...'
                            : 'Return Book'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BorrowedBooks;
