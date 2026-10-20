import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);

  // Safe server logging (avoid logging client emails, passwords or database secrets)
  console.error(`[Error] [${req.method}] ${req.originalUrl}:`, {
    message: err.message,
    statusCode,
    name: err.name,
  });

  // Handle Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid format for field: ${err.path}`,
    });
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    res.status(400).json({
      success: false,
      message: 'Database validation failed',
      errors: messages,
    });
    return;
  }

  // Production response without internal stack trace
  res.status(statusCode).json({
    success: false,
    message: err.isOperational || statusCode < 500 ? err.message : 'An unexpected server error occurred',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Resource not found: [${req.method}] ${req.originalUrl}`,
  });
};
