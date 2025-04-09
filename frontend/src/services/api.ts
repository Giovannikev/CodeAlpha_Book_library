// services/api.tsx
export interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  description?: string
  coverImageUrl?: string
  publicationYear?: number
  publisher?: string
  pageCount?: number
  language?: string
  isAvailable: boolean
  userId: string
  categories?: CategoryOnBook[]
  borrowRecords?: BorrowRecord[]
}

export interface Category {
  id: string
  name: string
  description?: string
}

export interface CategoryOnBook {
  bookId: string
  categoryId: string
  category: Category
}

export interface BorrowRecord {
  id: string
  borrowedTo: string
  borrowedDate: Date
  dueDate: Date
  returnedDate?: Date
  notes?: string
  bookId: string
  userId: string
  book?: Book
}

const API_BASE_URL = "http://localhost:3000/api"

// Fetch all books
export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/books`)
  if (!response.ok) throw new Error("Error fetching books")
  return await response.json()
}

// Fetch a book by ID
export async function fetchBookById(id: string): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/books/${id}`)
  if (!response.ok) throw new Error("Error fetching book")
  return await response.json()
}

// Create a new book
export async function createBook(data: Partial<Book>): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error creating book")
  return await response.json()
}

// Search books by title, category, and/or publication year
// Note: Since there's no dedicated search endpoint, we'll fetch all books and filter client-side
export async function searchBooks(params: {
  title?: string
  categoryId?: string
  publicationYear?: number
}): Promise<Book[]> {
  const books = await fetchBooks()

  return books.filter((book) => {
    // Filter by title
    if (params.title && !book.title.toLowerCase().includes(params.title.toLowerCase())) {
      return false
    }

    // Filter by category
    if (params.categoryId && params.categoryId !== "all-categories") {
      const hasCategory = book.categories?.some((cat) => cat.categoryId === params.categoryId)
      if (!hasCategory) return false
    }

    // Filter by publication year
    if (params.publicationYear && book.publicationYear !== params.publicationYear) {
      return false
    }

    return true
  })
}

// Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`)
  if (!response.ok) throw new Error("Error fetching categories")
  return await response.json()
}

// Borrow a book
export async function borrowBook(data: {
  bookId: string
  borrowedTo: string
  dueDate: Date
  notes?: string
}): Promise<BorrowRecord> {
  // First, we need to get the current user ID
  // For now, we'll use a placeholder - in a real app, this would come from authentication
  const userId = "some-user-id" // Replace with actual user ID from auth context

  const response = await fetch(`${API_BASE_URL}/borrow-records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      userId,
      borrowedDate: new Date(),
    }),
  })

  if (!response.ok) throw new Error("Error borrowing book")

  // After successfully creating the borrow record, update the book's availability
  await fetch(`${API_BASE_URL}/books/${data.bookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isAvailable: false }),
  })

  return await response.json()
}

// Return a borrowed book
export async function returnBook(borrowId: string): Promise<BorrowRecord> {
  // Get the borrow record to find the book ID
  const allRecords = await fetchBorrowedBooks()
  const record = allRecords.find((r) => r.id === borrowId)

  if (!record) {
    throw new Error("Borrow record not found")
  }

  // Update the borrow record with return date
  const response = await fetch(`${API_BASE_URL}/borrow-records/${borrowId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      returnedDate: new Date(),
    }),
  })

  if (!response.ok) throw new Error("Error returning book")

  // Update the book's availability
  await fetch(`${API_BASE_URL}/books/${record.bookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isAvailable: true }),
  })

  return await response.json()
}

// Fetch all borrowed books for the current user
export async function fetchBorrowedBooks(): Promise<BorrowRecord[]> {
  // In a real app, you would filter by the current user ID
  // For now, we'll fetch all records
  const response = await fetch(`${API_BASE_URL}/borrow-records`)
  if (!response.ok) throw new Error("Error fetching borrowed books")
  return await response.json()
}
