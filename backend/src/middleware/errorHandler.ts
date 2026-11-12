import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || (err instanceof ZodError ? 400 : 500);

  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      statusCode,
      ...(err instanceof ZodError ? { validationErrors: err.errors } : {}),
      ...(err.details ? { details: err.details } : {}),
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  };

  if (statusCode >= 500) {
    console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);
  } else {
    console.warn(`[CLIENT ERROR] ${req.method} ${req.originalUrl} (${statusCode}):`, err.message);
  }

  res.status(statusCode).json(errorResponse);
}
