import { Response } from "express";
import { therapistModel } from "../../models/therapist/therapist-schema";
import bcrypt from "bcryptjs";
import { errorResponseHandler } from "../../lib/errors/error-response-handler";
import { httpStatusCode } from "../../lib/constant";
import { onboardingApplicationModel } from "../../models/therapist/onboarding-application-schema";
import { generatePasswordResetToken, getPasswordResetTokenByToken } from "../../utils/mails/token";
import { sendPasswordResetEmail } from "../../utils/mails/mail";
import { passwordResetTokenModel } from "../../models/password-token-schema";
import mongoose from "mongoose";
import { wellnessModel } from "../../models/admin/wellness-schema";
import { appointmentRequestModel } from "../../models/appointment-request-schema";
import { isEmailTaken, queryBuilder } from "../../utils";
import { clientModel } from "../../models/client/clients-schema";
import { adminModel } from "src/models/admin/admin-schema";
import { userModel } from "src/models/admin/user-schema";
import { tasksModel } from "src/models/tasks-schema";
import jwt from 'jsonwebtoken'
import { paymentRequestModel } from "src/models/payment-request-schema";

export const signupService = async (payload: any, res: Response) => {
    const { email } = payload
    if (await isEmailTaken(email)) return errorResponseHandler('User already exists', httpStatusCode.FORBIDDEN, res)
    const newPassword = bcrypt.hashSync(payload.password, 10)
    payload.password = newPassword
    const newUser = new therapistModel({ ...payload, email: email.toLowerCase().trim() })
    await newUser.save()
    return { success: true, message: "User created successfully" }
}

export const loginService = async (payload: any, res: Response) => {
    const { email, password } = payload
    const models = [therapistModel, adminModel, clientModel, userModel]
    let user: any = null
    let userType: string = ''

    for (const model of models) {
        user = await (model as any).findOne({ email: email.toLowerCase() }).select('+password')
        if (user) {
            userType = model.modelName
            break
        }
    }
    if (!user) return errorResponseHandler('User not found', httpStatusCode.NOT_FOUND, res)

    let isPasswordValid = false
    const manualUser = await userModel.findOne({ email: email.toLowerCase() }).select('+password')
    if (manualUser) {
        isPasswordValid = password === manualUser.password
    } else {
        isPasswordValid = bcrypt.compareSync(password, user.password)
    }
    if (!isPasswordValid) return errorResponseHandler('Invalid password', httpStatusCode.UNAUTHORIZED, res)

    const userObject: any = user.toObject()
    delete userObject.password

    if (userType === 'therapists') {
        const onboardingApplication = await onboardingApplicationModel.findOne({ therapistId: user._id })
        userObject.onboardingApplication = onboardingApplication;
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_PHONE as string)

    return {
        success: true,
        message: "Login successful",
        data: { user: userObject, token }
    }
}

export const onBoardingService = async (payload: any, res: Response) => {
    const { email } = payload
    const user = await therapistModel.findOne({ email })
    if (!user) return errorResponseHandler('User not found', httpStatusCode.NOT_FOUND, res)
    if (user.onboardingCompleted) return errorResponseHandler('User already onboarded go to login', httpStatusCode.BAD_REQUEST, res)
    const existingApplication = await onboardingApplicationModel.findOne({ email })
    if (existingApplication) {
        return errorResponseHandler('An application with this email already exists', httpStatusCode.FORBIDDEN, res)
    }
    payload.email = email.toLowerCase().trim()
    const onboardingApplication = new onboardingApplicationModel({ therapistId: user._id, ...payload })
    await onboardingApplication.save()
    await therapistModel.findByIdAndUpdate(user._id, { onboardingCompleted: true })
    return { success: true, message: "Onboarding completed successfully" }
}

export const forgotPasswordService = async (email: string, res: Response) => {
    const models: any = [therapistModel, clientModel, adminModel, userModel]
    let user: any = null
    let userType: string = ''
    for (const model of models) {
        user = await model.findOne({ email })
        if (user) {
            userType = model.modelName
            break
        }
    }
    if (!user) return errorResponseHandler("Email not found", httpStatusCode.NOT_FOUND, res)
    const passwordResetToken = await generatePasswordResetToken(email)
    if (passwordResetToken !== null) {
        await sendPasswordResetEmail(email, passwordResetToken.token)
        return { success: true, message: "Password reset email sent" }
    }
}

export const verifyOTPService = async (payload: any, res: Response) => {
    const { otp } = payload
    const existingToken = await getPasswordResetTokenByToken(otp)
    if (!existingToken) return errorResponseHandler("Invalid token", httpStatusCode.BAD_REQUEST, res)

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) return errorResponseHandler("Token expired", httpStatusCode.BAD_REQUEST, res)

    return { success: true, message: "OTP verified successfully" }
}

export const newPassswordAfterVerifiedOTPService = async (payload: { password: string, token: string }, res: Response, session: mongoose.mongo.ClientSession) => {
    const { password, token } = payload
    const existingToken = await getPasswordResetTokenByToken(token)
    if (!existingToken) return errorResponseHandler("Invalid token", httpStatusCode.BAD_REQUEST, res)

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) return errorResponseHandler("Token expired", httpStatusCode.BAD_REQUEST, res)

    let existingUser: any;
    const models: any = [therapistModel, clientModel, adminModel, userModel]
    let userType: string = ''
    for (const model of models) {
        existingUser = await model.findOne({ email: existingToken.email }).session(session)
        if (existingUser) {
            userType = model.modelName
            break
        }
    }
    if (!existingUser) return errorResponseHandler("Therapist email not found", httpStatusCode.NOT_FOUND, res)
    let hashedPassword: string = ''
    if (userType === 'users') {
        hashedPassword = password
    }
    else {
        hashedPassword = await bcrypt.hash(password, 10)
    }

    const response = await existingUser.updateOne({ password: hashedPassword }).session(session)
    await passwordResetTokenModel.findByIdAndDelete(existingToken._id).session(session)
    await session.commitTransaction()
    session.endSession()

    return {
        success: true,
        message: "Password updated successfully",
        data: response
    }
}

export const getTherapistVideosService = async (payload: any) => {
    const { id } = payload
    const page = parseInt(payload.page as string) || 1
    const limit = parseInt(payload.limit as string) || 10
    const offset = (page - 1) * limit
    const query = {
        assignTo: 'therapists',
        assignedToId: { $in: [id, null] }
    }
    const totalDataCount = Object.keys(query).length < 1 ? await wellnessModel.countDocuments(query) : await wellnessModel.countDocuments(query)
    const result = await wellnessModel.find(query).skip(offset).limit(limit)
    if (result.length) return {
        data: result,
        page,
        limit,
        success: true,
        total: totalDataCount
    }
    else return {
        data: [],
        page,
        limit,
        success: false,
        total: 0
    }
}

//Dashboard stats service
export const getTherapistDashboardStatsService = async (id: string) => {
    const therapistAppointments = await appointmentRequestModel.find({
        $or: [
            { therapistId: { $eq: id } },
            { peerSupportIds: { $in: [id] } }
        ]
    })
    const totalClients = await clientModel.countDocuments({ therapistId: id })

    const myTasks = await tasksModel.countDocuments({ therapistId: id, status: 'Pending' })

    const pendingVideoChat = therapistAppointments.filter((x: any) => x.status === 'Pending').length
    return {
        success: true,
        message: "Dashboard stats fetched successfully",
        data: {
            totalClients,
            myOpenTasks: myTasks,
            pendingVideoChat
        }
    }
}

// Therapist clients
export const getTherapistClientsService = async (payload: any) => {
    const { id, ...rest } = payload;
    const page = parseInt(payload.page as string) || 1;
    const limit = parseInt(payload.limit as string) || 10;
    const offset = (page - 1) * limit
    let { query } = queryBuilder(payload, ['status', 'clientName', '_id']);    // Combine both 'dedicated' and 'peer' clients in the query 
    (query as any).$or = [
        { therapistId: { $eq: id } },
        { peerSupportIds: { $in: [id] } },
    ]
    const totalDataCount = Object.keys(query).length < 1 ? await appointmentRequestModel.countDocuments() : await appointmentRequestModel.countDocuments(query);
    const result = await appointmentRequestModel.find(query).skip(offset).limit(limit).populate([
        {
            path: 'clientId',
            select: 'email phoneNumber firstName lastName assignedDate assignedTime message video',
        }
    ])
    const appointmentIds = result.map((x: any) => x._id)
    const attachedPaymentRequests = await paymentRequestModel.find({ appointmentId: { $in: appointmentIds } })

    const finalResult = result.map((x: any) => {
        return {
            ...x._doc,
            paymentRequest: attachedPaymentRequests.find((y: any) => y.appointmentId.toString() === x._id.toString())
        }
    })

    if (result.length) {
        return {
            success: true,
            page,
            limit,
            total: totalDataCount,
            data: finalResult
        };
    } else {
        return {
            data: [],
            page,
            limit,
            success: false,
            total: 0
        };
    }
}

export const getTherapistService = async (id: string, res: Response) => {
    const therapist = await onboardingApplicationModel.findOne({ therapistId: id })
    if (!therapist) return errorResponseHandler("Therapist not found", httpStatusCode.NOT_FOUND, res)
    return {
        success: true,
        message: "Therapist fetched successfully",
        data: therapist
    }
}

export const updateTherapistService = async (id: string, payload: any, res: Response) => {
    const therapist = await onboardingApplicationModel.findOne({ therapistId: id })
    if (!therapist) return errorResponseHandler("Therapist not found", httpStatusCode.NOT_FOUND, res)
    const updatedTherapist = await onboardingApplicationModel.findByIdAndUpdate(therapist._id, payload, { new: true })
    //Also update the therapist in the database
    if (payload.lastName || payload.firstName || payload.phoneNumber) {
        await therapistModel.findByIdAndUpdate(id, payload, { new: true })
    }
    return {
        success: true,
        message: "Therapist updated successfully",
        data: updatedTherapist
    }
}

export const getTherapistsSpecificClientsService = async (payload: any) => {
    const { id } = payload
    const page = parseInt(payload.page as string) || 1
    const limit = parseInt(payload.limit as string) || 10
    const offset = (page - 1) * limit
    let { query } = queryBuilder(payload, ['firstName', 'lastName', 'phoneNumber', 'email']) as any
    const totalDataCount = Object.keys(query).length < 1 ? await clientModel.countDocuments({ therapistId: id }) : await clientModel.countDocuments({ therapistId: id, ...query })
    const result = await clientModel.find({ therapistId: id, ...query }).skip(offset).limit(limit)
    if (result.length) return {
        data: result,
        page,
        limit,
        success: true,
        total: totalDataCount
    }
    else return {
        data: [],
        page,
        limit,
        success: false,
        total: 0
    }
}