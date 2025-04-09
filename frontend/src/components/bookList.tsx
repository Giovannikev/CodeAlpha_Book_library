'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
  fetchBooks,
  fetchCategories,
  searchBooks,
  type Book,
  type Category,
} from '../services/api';
import { Link } from 'react-router-dom';
import { BookOpen, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [publicationYear, setPublicationYear] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  // Load books and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, categoriesData] = await Promise.all([
          fetchBooks(),
          fetchCategories(),
        ]);

        // Add a 2-second delay to show the skeleton loading state
        setTimeout(() => {
          setBooks(booksData);
          setCategories(categoriesData);
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        setTimeout(() => {
          setError(err.message);
          setLoading(false);
        }, 1000);
      }
    };

    loadData();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchTitle && !selectedCategory && !publicationYear) {
      // If all search fields are empty, fetch all books
      setIsSearching(true);
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsSearching(false);
      }
      return;
    }

    setIsSearching(true);
    try {
      const searchParams: {
        title?: string;
        categoryId?: string;
        publicationYear?: number;
      } = {};

      if (searchTitle) searchParams.title = searchTitle;
      if (selectedCategory && selectedCategory !== 'all-categories')
        searchParams.categoryId = selectedCategory;
      if (publicationYear)
        searchParams.publicationYear = Number.parseInt(publicationYear);

      const results = await searchBooks(searchParams);
      setBooks(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search filters
  const clearFilters = async () => {
    setSearchTitle('');
    setSelectedCategory('');
    setPublicationYear('');

    setIsSearching(true);
    try {
      const booksData = await fetchBooks();
      setBooks(booksData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Book List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="h-[220px] w-full rounded-none" />
              </CardHeader>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
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

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-8 tracking-tight">Book List</h2>

      {/* Search and filter section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="search-title">Title</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-title"
                  type="text"
                  placeholder="Search by title..."
                  className="pl-8"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publication-year">Publication Year</Label>
              <Input
                id="publication-year"
                type="number"
                placeholder="Enter year..."
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={isSearching}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Books grid */}
      {books.length === 0 ? (
        <Alert>
          <AlertTitle>No books found</AlertTitle>
          <AlertDescription>
            Try adjusting your search criteria.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-0">
          {books.map((book) => (
            <Card
              key={book.id}
              className="overflow-hidden transition-all hover:shadow-lg"
            >
              <CardHeader className="p-0">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={
                      book.coverImageUrl ||
                      '/placeholder.svg?height=225&width=400'
                    }
                    alt={book.title}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2 line-clamp-1">
                  {book.title}
                </h3>
                <div className="flex flex-col gap-1.5 text-muted-foreground mb-4">
                  <p className="text-sm">Author: {book.author}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {book.categories?.map((categoryOnBook) => (
                      <Badge
                        key={categoryOnBook.categoryId}
                        variant="secondary"
                        className="text-xs"
                      >
                        {categoryOnBook.category.name}
                      </Badge>
                    ))}
                    {book.publicationYear && (
                      <Badge variant="outline" className="text-xs">
                        {book.publicationYear}
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge
                  variant={book.isAvailable ? 'secondary' : 'destructive'}
                  className="mt-2"
                >
                  {book.isAvailable ? 'Available' : 'Borrowed'}
                </Badge>
              </CardContent>
              <CardFooter className="pt-0 px-6 pb-6">
                <Button asChild variant="secondary" className="w-full">
                  <Link to={`/books/${book.id}`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
