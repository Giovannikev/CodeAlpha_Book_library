import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { books: { include: { book: true } } },
    })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories.' })
  }
}

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body
    const newCategory = await prisma.category.create({
      data: { name, description },
    })
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la catégorie.' })
  }
}

