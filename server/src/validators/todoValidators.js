import { body, param, query } from 'express-validator';

const priorityValues = ['low', 'medium', 'high'];
const filterValues = ['all', 'active', 'completed', 'overdue'];
const sortValues = ['createdAt', '-createdAt', 'dueDate', '-dueDate', 'priority', '-priority', 'title', '-title'];

export const createTodoRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('priority').optional().isIn(priorityValues).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date'),
  body('completed').optional().isBoolean(),
];

export const updateTodoRules = [
  param('id').isMongoId().withMessage('Invalid todo id'),
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('priority').optional().isIn(priorityValues),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date'),
  body('completed').optional().isBoolean(),
];

export const todoIdRules = [param('id').isMongoId().withMessage('Invalid todo id')];

export const listTodoRules = [
  query('search').optional().isString().isLength({ max: 200 }),
  query('filter').optional().isIn(filterValues).withMessage('Invalid filter'),
  query('sort').optional().isIn(sortValues).withMessage('Invalid sort'),
];
