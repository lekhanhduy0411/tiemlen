import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi máy chủ';

  console.error('❌ Error:', err.message);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const createError = (statusCode: number, message: string): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export default errorHandler;
