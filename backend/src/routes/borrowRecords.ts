import { Router } from 'express'
import {
  getAllBorrowRecords,
  createBorrowRecord,
  updateBorrowRecord
} from '../controllers/borrowRecordsController'

const router = Router()

router.get('/', getAllBorrowRecords)
router.post('/', createBorrowRecord)
router.put('/:id', updateBorrowRecord)

export default router
