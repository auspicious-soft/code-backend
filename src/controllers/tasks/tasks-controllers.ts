import { Request, Response } from "express"
import { httpStatusCode } from "../../lib/constant"
import { errorParser } from "../../lib/errors/error-response-handler"
import { getTherapistTasksService, postTherapistTasksService, updateTaskStatusService,  getATherapistTasksService,  deleteATaskService, postUserTasksService } from "src/services/tasks/tasks-service"

export const postTherapistTasks = async (req: Request, res: Response) => {
    try {
        const response = await postTherapistTasksService({ id: req.params.id, ...req.body }, res)
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })
    }
}

export const postUserTask = async (req: Request, res: Response) => {
    try {
        const response = await postUserTasksService({ id: req.params.id, ...req.body }, res)
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })
    }
}

export const getTherapistTasks = async (req: Request, res: Response) => {
    try {
        const response = await getTherapistTasksService(req.query, res)
        return res.status(httpStatusCode.OK).json(response)

    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })

    }
}

export const getATherapistTasks = async (req: Request, res: Response) => {
    try {
        const response = await getATherapistTasksService({id: req.params.id, ...req.query}, res)
        return res.status(httpStatusCode.OK).json(response)

    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })

    }
}

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const response = await updateTaskStatusService({id: req.params.id, ...req.body}, res)
        return res.status(httpStatusCode.OK).json(response)

    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })

    }
}

export const deleteATask = async (req: Request, res: Response) => {
    try {
        const response = await deleteATaskService(req.params.id, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })
    }
}

