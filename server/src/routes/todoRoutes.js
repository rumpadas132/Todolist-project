import { Router } from 'express';
import {
  listTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getStats,
} from '../controllers/todoController.js';
import { protect } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';
import {
  createTodoRules,
  updateTodoRules,
  todoIdRules,
  listTodoRules,
} from '../validators/todoValidators.js';

const router = Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/', listTodoRules, handleValidation, listTodos);
router.post('/', createTodoRules, handleValidation, createTodo);
router.patch('/:id', updateTodoRules, handleValidation, updateTodo);
router.delete('/:id', todoIdRules, handleValidation, deleteTodo);

export default router;
