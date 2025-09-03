import express from 'express';
import { validateTaskCreate, validateTaskUpdate, validateTaskMove, validateBulkPositions } from '../middleware/joiValidation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  moveTask,
  seedDatabaseController,
  clearDatabaseController
} from '../controllers/taskController.js';

const router = express.Router();


router.get('/', asyncHandler(getAllTasks));
router.post('/', validateTaskCreate, asyncHandler(createTask));
router.patch('/move', validateTaskMove, asyncHandler(moveTask));
router.post('/seed', asyncHandler(seedDatabaseController));
router.delete('/seed', asyncHandler(clearDatabaseController));
router.get('/:id', asyncHandler(getTaskById));
router.put('/:id', validateTaskUpdate, asyncHandler(updateTask));
router.delete('/:id', asyncHandler(deleteTask));

export default router;
