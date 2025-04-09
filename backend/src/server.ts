import express, { Request, Response } from 'express'
import cors from 'cors'
import booksRouter from './routes/books'
import categoriesRouter from './routes/categories'
import borrowRecordsRouter from './routes/borrowRecords'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/books', booksRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/borrow-records', borrowRecordsRouter)

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('Book Library API is running!')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
