import { httpStatusCode } from "src/lib/constant"
import { errorResponseHandler } from "src/lib/errors/error-response-handler"
import { AlertModel } from "src/models/admin/alerts-schema"
import { MessageModel, QueryMessageModel } from "src/models/chat-message-schema"
import { clientModel } from "src/models/client/clients-schema"
import { onboardingApplicationModel } from "src/models/therapist/onboarding-application-schema"
import { addAlertsOfExpiration, queryBuilder } from "src/utils"

export const addAlertService = async (data: any) => {
    const response = await AlertModel.create(data)
    return {
        success: true,
        data: response
    }
}

export const getAlertsService = async (payload: any, res: any) => {

    //Check the expirations of client service agreements and add alerts if necessary
    await addAlertsOfExpiration()

    const { page = 1, limit = 10 } = payload;
    const offset = (page - 1) * limit;
    let query = {}

    if (payload.read !== undefined) query = { read: payload.read }

    const response = await AlertModel.find({ ...query, type: 'alert' }).skip(offset).limit(limit).populate('userId');
    const totalDataCount = Object.keys(query).length < 1 ? await AlertModel.countDocuments({ type: 'alert' }) : await AlertModel.countDocuments({ ...query, type: 'alert' });

    if (response.length > 0) {
        return {
            success: true,
            data: response,
            page,
            limit,
            total: totalDataCount
        };
    } else {
        return {
            success: true,
            data: [],
            page,
            limit,
            total: 0
        }
    }
}

export const updateAlertService = async (payload: any, res: any) => {
    const alert = await AlertModel.findById(payload.id)
    if (!alert) return errorResponseHandler('Alert not found', httpStatusCode.NOT_FOUND, res)
    const response = await AlertModel.findByIdAndUpdate(payload.id, payload, { new: true })
    return {
        success: true,
        data: response
    }
}


export const deleteAdminAlertService = async (id: string, res: any) => {
    const alert = await QueryMessageModel.findById(id)
    if (!alert) return errorResponseHandler('Alert not found', httpStatusCode.NOT_FOUND, res)
    await QueryMessageModel.findByIdAndDelete(id)
    return {
        success: true,
        message: 'Alert deleted successfully'
    }
}



export const getClinicianAlertsService = async (id: string, res: any) => {
    const now = new Date()
    const therapist = await onboardingApplicationModel.findOne({ therapistId: id })
    if (!therapist) return errorResponseHandler('Therapist not found', httpStatusCode.NOT_FOUND, res)
    const newChatAlerts = await MessageModel.find({ receiver: id, createdAt: { $lt: now }, readStatus: false }).populate('sender')
    const otherAlerts = await AlertModel.find({ userId: id, type: { $in: ['task', 'appointment'] }, userType: 'therapists' })
    return {
        newChatAlerts,
        otherAlerts
    }
}

export const markClinicianAlertAsReadService = async (id: string, res: any) => {
    await MessageModel.updateMany({ receiver: id, readStatus: false }, { readStatus: true }, { new: true })
    await AlertModel.updateMany({ userId: id, read: false, userType: 'therapists' }, { read: true }, { new: true })
}

export const getClientAlertsService = async (id: string, res: any) => {
    const now = new Date()
    const client = await clientModel.findById(id)
    if (!client) return errorResponseHandler('Client not found', httpStatusCode.NOT_FOUND, res)
    const newChatAlerts = await MessageModel.find({ receiver: id, createdAt: { $lt: now }, readStatus: false }).populate('sender')
    const otherAlerts = await AlertModel.find({ userId: id, type: { $in: ['task', 'appointment'] }, userType: 'clients' })
    return {
        newChatAlerts,
        otherAlerts
    }
}

export const deleteClientAndClinicianAlertService = async (id: string, res: any) => {
    const newChatAlerts = await AlertModel.findById(id)
    const otherAlerts = await MessageModel.findById(id)
    if (!newChatAlerts && !otherAlerts) return errorResponseHandler('Alert not found', httpStatusCode.NOT_FOUND, res)
    if (newChatAlerts) await AlertModel.findByIdAndDelete(id)
    if (otherAlerts) await MessageModel.findByIdAndDelete(id)
    return {
        success: true,
        message: 'Alert deleted successfully'
    }
}

export const clearNotificationsService = async (id: string, res: any) => {
    const userId = id
    await AlertModel.deleteMany({ userId })
    
    return {
        success: true,
        message: 'Notifications cleared successfully'
    }
}

export const markClientAlertAsReadService = async (id: string, res: any) => {
    await MessageModel.updateMany({ receiver: id, readStatus: false }, { readStatus: true }, { new: true })
    await AlertModel.updateMany({ userId: id, read: false, userType: 'clients' }, { read: true }, { new: true })
}

export const getAdminQueryAlertsService = async () => {
    const now = new Date()
    const newQueryChatAlerts = await QueryMessageModel.find({ createdAt: { $lt: now }, readStatus: false, senderPath: { $in: ['clients'] } }).populate('sender')
    return newQueryChatAlerts
}

export const markAllNotificationsForAdminAsReadService = async () => {
    return await QueryMessageModel.deleteMany({ readStatus: false, senderPath: { $in: ['clients'] } }, { readStatus: true })
}