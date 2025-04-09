import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Récupère tous les enregistrements d’emprunt
export const getAllBorrowRecords = async (req: Request, res: Response) => {
  try {
    const records = await prisma.borrowRecord.findMany({
      include: {
        book: true,
        user: true,
      },
    })
    res.json(records)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des emprunts.' })
  }
}

// Crée un nouvel enregistrement d’emprunt
export const createBorrowRecord = async (req: Request, res: Response) => {
  try {
    const { borrowedTo, borrowedDate, dueDate, returnedDate, notes, bookId, userId } = req.body
    const newRecord = await prisma.borrowRecord.create({
      data: {
        borrowedTo,
        borrowedDate: borrowedDate ? new Date(borrowedDate) : undefined,
        dueDate: new Date(dueDate),
        returnedDate: returnedDate ? new Date(returnedDate) : undefined,
        notes,
        bookId,
        userId,
      },
    })
    res.status(201).json(newRecord)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l’emprunt.' })
  }
}

// Met à jour un enregistrement d’emprunt (exemple : marquer comme retourné)
export const updateBorrowRecord = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const { returnedDate, notes } = req.body
    const updatedRecord = await prisma.borrowRecord.update({
      where: { id },
      data: {
        returnedDate: returnedDate ? new Date(returnedDate) : undefined,
        notes,
      },
    })
    res.json(updatedRecord)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l’emprunt.' })
  }
}
