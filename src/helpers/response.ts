import type { Response } from "express";

interface ApiResponse<T> {
  status: boolean,
  message: string,
  data?: T
}

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    status: true,
    message,
    data
  })
}

export function sendError<T>(
  res: Response,
  message: string,
  statusCode: number = 500
): Response<ApiResponse<null>> {
  return res.status(statusCode).json({
    status: false,
    message,
    data: null
  })
}