import Joi from 'joi';
import { SERVER_VALIDATION } from '../utils/config.js';
import { apiErrorResponse } from '../utils/responseHelper.js';

// Task creation validation schema
const taskCreateSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(SERVER_VALIDATION.title.maxLength)
    .required()
    .messages({
      'string.empty': 'Task title is required',
      'string.min': 'Task title must be at least 1 character long',
      'string.max': 'Task title cannot exceed ' + SERVER_VALIDATION.title.maxLength + ' characters',
      'any.required': 'Task title is required'
    }),

  description: Joi.string()
    .max(SERVER_VALIDATION.description.maxLength)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Task description cannot exceed ' + SERVER_VALIDATION.description.maxLength + ' characters'
    }),

  priority: Joi.string()
    .valid(...SERVER_VALIDATION.priority.levels)
    .optional()
    .messages({
      'any.only': 'Priority must be low, medium, or high'
    }),

  columnId: Joi.string()
    .valid(...SERVER_VALIDATION.columns.ids)
    .optional()
    .messages({
      'any.only': 'Column ID must be todo, inProgress, or done'
    }),

  position: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Position must be a number',
      'number.integer': 'Position must be an integer',
      'number.min': 'Position must be a non-negative integer'
    }),

  assignedTo: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Assigned user must be a valid MongoDB ID'
    }),

  tags: Joi.array()
    .items(Joi.string().max(20))
    .optional()
    .messages({
      'array.base': 'Tags must be an array',
      'string.max': 'Each tag must be a string with maximum 20 characters'
    }),

  dueDate: Joi.date()
    .iso()
    .optional()
    .allow(null, '')
    .messages({
      'date.base': 'Due date must be a valid date',
      'date.format': 'Due date must be a valid ISO 8601 date'
    }),

  status: Joi.string()
    .valid('todo', 'inProgress', 'done')
    .optional()
    .messages({
      'any.only': 'Status must be todo, inProgress, or done'
    }),

  isCompleted: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isCompleted must be a boolean'
    })
});

// Task update validation schema (all fields optional)
const taskUpdateSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.empty': 'Task title cannot be empty',
      'string.min': 'Task title must be at least 1 character long',
      'string.max': 'Task title cannot exceed 100 characters'
    }),

  description: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Task description cannot exceed 500 characters'
    }),

  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority must be low, medium, or high'
    }),

  columnId: Joi.string()
    .valid('todo', 'inProgress', 'done')
    .optional()
    .messages({
      'any.only': 'Column ID must be todo, inProgress, or done'
    }),

  position: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Position must be a number',
      'number.integer': 'Position must be an integer',
      'number.min': 'Position must be a non-negative integer'
    }),

  assignedTo: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Assigned user must be a valid MongoDB ID'
    }),

  tags: Joi.array()
    .items(Joi.string().max(20))
    .optional()
    .messages({
      'array.base': 'Tags must be an array',
      'string.max': 'Each tag must be a string with maximum 20 characters'
    }),

  dueDate: Joi.date()
    .iso()
    .optional()
    .allow(null, '')
    .messages({
      'date.base': 'Due date must be a valid date',
      'date.format': 'Due date must be a valid ISO 8601 date'
    }),

  status: Joi.string()
    .valid('todo', 'inProgress', 'done')
    .optional()
    .messages({
      'any.only': 'Status must be todo, inProgress, or done'
    }),

  isCompleted: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isCompleted must be a boolean'
    })
});

// Task movement validation schema
const taskMoveSchema = Joi.object({
  taskId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Task ID must be a valid MongoDB ID',
      'any.required': 'Task ID is required'
    }),

  sourceColumnId: Joi.string()
    .valid('todo', 'inProgress', 'done')
    .required()
    .messages({
      'any.only': 'Source column ID must be todo, inProgress, or done',
      'any.required': 'Source column ID is required'
    }),

  destinationColumnId: Joi.string()
    .valid('todo', 'inProgress', 'done')
    .required()
    .messages({
      'any.only': 'Destination column ID must be todo, inProgress, or done',
      'any.required': 'Destination column ID is required'
    }),

  newIndex: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'New index must be a number',
      'number.integer': 'New index must be an integer',
      'number.min': 'New index must be a non-negative integer',
      'any.required': 'New index is required'
    }),

  taskIds: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      'array.base': 'Task IDs must be an array',
      'string.pattern.base': 'Each task ID must be a valid MongoDB ID'
    })
});

// Bulk position update validation schema
const bulkPositionsSchema = Joi.object({
  columnId: Joi.string()
    .valid('todo', 'inProgress', 'done')
    .required()
    .messages({
      'any.only': 'Column ID must be todo, inProgress, or done',
      'any.required': 'Column ID is required'
    }),

  taskIds: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .required()
    .messages({
      'array.base': 'Task IDs must be an array',
      'array.min': 'Task IDs must be a non-empty array',
      'any.required': 'Task IDs are required',
      'string.pattern.base': 'Each task ID must be a valid MongoDB ID'
    })
});

// User validation schema
const userSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),

  role: Joi.string()
    .valid('user', 'admin')
    .optional()
    .default('user')
    .messages({
      'any.only': 'Role must be user or admin'
    })
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const formattedErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return apiErrorResponse({
        res,
        message: 'Validation failed',
        statusCode: 400,
        errors: formattedErrors
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Export validation middleware functions
export const validateTaskCreate = validate(taskCreateSchema);
export const validateTaskUpdate = validate(taskUpdateSchema);
export const validateTaskMove = validate(taskMoveSchema);
export const validateBulkPositions = validate(bulkPositionsSchema);
export const validateUser = validate(userSchema);

// Export schemas for validation
export {
  taskCreateSchema,
  taskUpdateSchema,
  taskMoveSchema,
  bulkPositionsSchema,
  userSchema
};
