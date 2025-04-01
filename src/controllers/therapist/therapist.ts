import { Request, Response } from "express"
import { httpStatusCode } from "../../lib/constant"
import { errorParser } from "../../lib/errors/error-response-handler"
import { formatZodErrors } from "../../validation/format-zod-errors"
import { userOTPVeificationSchema, therapistSignupSchema, onboardingApplicationSchema, loginSchema } from "../../validation/therapist-user"
import { loginService, onBoardingService, verifyOTPService, signupService, getTherapistVideosService, forgotPasswordService, getTherapistDashboardStatsService, getTherapistClientsService, updateTherapistService, getTherapistService, getTherapistsSpecificClientsService, newPassswordAfterVerifiedOTPService } from "../../services/therapist/therapist"
import { z } from "zod"
import mongoose from "mongoose"

export const signup = async (req: Request, res: Response) => {
    try {
        const validation = (!req.body.otp ? therapistSignupSchema : userOTPVeificationSchema).safeParse(req.body)
        if (!validation.success) return res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: formatZodErrors(validation.error) })
        const response = await signupService(req.body, res)
        return res.status(httpStatusCode.CREATED).json(response)
    }
    catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body)
        if (!validation.success) return res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: formatZodErrors(validation.error) })
        const response = await loginService(req.body, res)
        return res.status(httpStatusCode.OK).json(response)
    }
    catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })
    }
}

export const onBoarding = async (req: Request, res: Response): Promise<Response> => {
    try {
        const validation = onboardingApplicationSchema.safeParse(req.body)
        if (!validation.success) return res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: formatZodErrors(validation.error) })
        const response = await onBoardingService(req.body, res)
        return res.status(httpStatusCode.CREATED).json(response)
    }
    catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body
    const validation = z.string().email().safeParse(email)
    if (!validation.success) return res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: formatZodErrors(validation.error) })
    try {
        const response = await forgotPasswordService(email, res)
        return res.status(httpStatusCode.OK).json(response)
    }
    catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })
    }
}

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const response = await verifyOTPService(req.body, res)
        return res.status(httpStatusCode.OK).json(response)
    }
    catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" })
    }
}
export const newPassswordAfterVerifiedOTP = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const response = await newPassswordAfterVerifiedOTPService(req.body, res, session)
        return res.status(httpStatusCode.OK).json(response)
    }
    catch (error: any) {
        const { code, message } = errorParser(error)
        await session.abortTransaction();
        session.endSession();
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getTherapistVideos = async (req: Request, res: Response) => {
    try {
        const response = await getTherapistVideosService({id:req.params.id, ...req.query})
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}


// Dashboard stats
export const getTherapistDashboardStats = async (req: Request, res: Response) => {
    try {
        const response = await getTherapistDashboardStatsService(req.params.id)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

// Clients dedicated and as a peer support
export const getTherapistClients = async (req: Request, res: Response) => {
    try {
        const response = await getTherapistClientsService({id: req.params.id, ...req.query})
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getTherapistsSpecificClients = async (req: Request, res: Response) => {
    try {
        const response = await getTherapistsSpecificClientsService({id: req.params.id, ...req.query})
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getTherapist = async (req: Request, res: Response) => {
    try {
        const response = await getTherapistService(req.params.id, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const updateTherapist = async (req: Request, res: Response) => {
    try {
        const response = await updateTherapistService(req.params.id, req.body, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}