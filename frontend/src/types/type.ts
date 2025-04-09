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