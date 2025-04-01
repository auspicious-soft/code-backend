import { Request, Response } from "express";
import { httpStatusCode } from "../../lib/constant";
import { errorParser } from "../../lib/errors/error-response-handler";
import { getAppointmentsService, getASingleAppointmentService, requestAppointmentService, updateAppointmentStatusService, updateAssignmentStatusService, getAllAppointmentsOfAClientService, getAppointmentsByTherapistIdService, getAllAppointmentsForAdminService, assignAppointmentToClientService, lockUnlockNoteService } from "../../services/appointments/appointments";

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const response = await getAppointmentsService(req.query)
        return res.status(200).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getAppointmentsByTherapistId = async (req: Request, res: Response) => {
    try {
        const response = await getAppointmentsByTherapistIdService({ id: req.params.id, ...req.query }, res)
        return res.status(200).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const requestAppointment = async (req: Request, res: Response) => {
    try {
        const response = await requestAppointmentService(req.body, res)
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const updateAssignmentStatus = async (req: Request, res: Response) => {
    const payload = { ...req.body, id: req.params.id }
    try {
        const response = await updateAssignmentStatusService(payload, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getAllAppointmentsOfAClient = async (req: Request, res: Response) => {
    try {
        const response = await getAllAppointmentsOfAClientService({ id: req.params.id, ...req.query }, res)
        return res.status(200).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getASingleAppointment = async (req: Request, res: Response) => {
    try {
        const response = await getASingleAppointmentService(req.params.appointmentId, res)
        return res.status(200).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getAllAppointmentsForAdmin = async (req: Request, res: Response) => {
    try {
        const response = await getAllAppointmentsForAdminService(req.query)
        return res.status(200).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const updateAppointmentStatus = async (req: Request, res: Response) => {
    try {
        const response = await updateAppointmentStatusService({ id: req.params.id, ...req.body }, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const assignAppointmentToClient = async (req: Request, res: Response) => {
    try {
        const response = await assignAppointmentToClientService(req.body, res)
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}


export const lockUnlockNote = async (req: Request, res: Response) => {
    try {
        const response = await lockUnlockNoteService({ id: req.params.appointmentId, ...req.body }, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}