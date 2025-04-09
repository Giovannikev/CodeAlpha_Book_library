import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        user: true,
        categories: {
          include: { category: true },
        },
        borrowRecords: true,
      },
    })
    res.json(books)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des livres.' })
  }
}

export const createBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      author,
      isbn,
      description,
      coverImageUrl,
      publicationYear,
      publisher,
      pageCount,
      language,
      userId,
      isAvailable
    } = req.body

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        description,
        coverImageUrl,
        publicationYear,
        publisher,
        pageCount,
        language,
        userId,
        isAvailable,
      },
    })
    res.status(201).json(newBook)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du livre.' })
  }
}

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        user: true,
        categories: {
          include: { category: true },
        },
        borrowRecords: true,
      },
    })
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'Livre non trouvé.' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du livre.' })
  }
}

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const {
      title,
      author,
      isbn,
      description,
      coverImageUrl,
      publicationYear,
      publisher,
      pageCount,
      language,
      userId,
      isAvailable
    } = req.body

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        isbn,
        description,
        coverImageUrl,
        publicationYear,
        publisher,
        pageCount,
        language,
        userId,
        isAvailable,
      },
    })
    res.json(updatedBook)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du livre.' })
  }
}

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.book.delete({
      where: { id },
    })
    res.json({ message: 'Livre supprimé avec succès.' })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du livre.' })
  }
}
