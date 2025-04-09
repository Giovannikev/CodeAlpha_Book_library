import type React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, BookMarked } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to Your Personal Library
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage your book collection easily and efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Browse Books</CardTitle>
            <CardDescription>
              Explore your book collection and view details of each title.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center bg-muted/50 rounded-md">
              <BookOpen className="h-16 w-16 text-muted-foreground/70" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/books">
                <BookOpen className="mr-2 h-4 w-4" />
                View Book List
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add a Book</CardTitle>
            <CardDescription>
              Add a new book to your personal collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center bg-muted/50 rounded-md">
              <PlusCircle className="h-16 w-16 text-muted-foreground/70" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/add-book">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Book
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrowed Books</CardTitle>
            <CardDescription>
              View and manage the books you've borrowed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center bg-muted/50 rounded-md">
              <BookMarked className="h-16 w-16 text-muted-foreground/70" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/borrowed">
                <BookMarked className="mr-2 h-4 w-4" />
                My Borrowed Books
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;
