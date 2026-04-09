import { sendError, sendSuccess } from "@/helpers/response"
import type { Request, RequestHandler } from "express"

type serviceController<T> = (req: Request) => Promise<T>

export const createController = <T>(
  defaultSuccessMsg: string,
  defaultErrorMsg: string,
  service: serviceController<T>,
) => {
  const controller: RequestHandler = async (req, res, next) => {
    try {
      const data = await service(req)
      
      sendSuccess(res, defaultSuccessMsg, data ?? null)
    } catch (e) {
      sendError(res, `${defaultErrorMsg}: ${e}`) 
    }
  }

  return controller
}