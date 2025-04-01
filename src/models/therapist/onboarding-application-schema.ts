import mongoose from "mongoose";

const onboardingApplicationSchema = new mongoose.Schema({
    therapistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "therapists",
        required: true,
    },
    // providerType: {
    //     type: String,
    //     required: true
    // },
    licenceType: {
        type: String,
        required: false,
    },
    profilePic: {
        type: String,
        required: false,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: false,
    },
    dob: {
        type: Date,
        required: true,
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        default: null
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    salaryDesired: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: false,
        default: ""
    },
    preferredlanguage: {
        type: String,
    },
    // Employment Fields - All set to required: false
    howLongAtPresentAddress: {
        type: String,
        required: false
    },
    currentEmploymentStatus: {
        type: String,
        required: false,
        enum: ["Employed", "Self-Employed", "Unemployed", "Student"]
    },
    employmentCityState: {
        type: String,
        required: false
    },
    weeklyHours: {
        type: String,
        required: true
    },
    currentOrPreviousEmployerName: {
        type: String,
        required: false
    },
    rolePosition: {
        type: String,
        required: false
    },
    rateOfPay: {
        type: String,
        required: false
    },
    startDate: {
        type: Date,
        required: false
    },
    endDate: {
        type: Date,
        required: false
    },
    reasonForLeaving: {
        type: String,
        required: false
    },
    supervisorName: {
        type: String,
        required: false
    },
    jobDescription: {
        type: String,
        required: false
    },
    currentResume: {
        type: String,
        required: false
    },
    employmentDesired: {
        type: String,
        required: false
    },

    // Education Fields - All set to required: false
    highestEducationCompleted: {
        type: String,
        required: false,
        enum: [
            "None",
            "High School/ GED",
            "College",
            "Graduate School",
            "Advanced Degree/ Professional School"
        ]
    },
    schoolName: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    majorDegree: {
        type: String,
        required: false
    },
    licenseOrCertification: {
        type: String,
        required: false
    },
    skills: {
        type: String,
        required: false
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        requried: true
    },
    currentAvailability: {
        type: [String],
        required: true
    },
    felonyOrMisdemeanor: {
        type: String,
        required: true,
    },
    ifFelonyOrMisdemeanor: {
        type: String,
    },
    livedInNorthCarolina: {
        type: Boolean,
        required: true
    },
    ifNotLivedInNorthCarolina: {
        type: String,
    },
    validDriverLicense: {
        type: Boolean,
        required: true
    },
    reliableTransportation: {
        type: Boolean,
        required: true
    },
    legalRightToWorkInUS: {
        type: Boolean,
        required: true
    },
    reasonableAccommodation: {
        type: Boolean,
        required: true
    },
    driverLicenseOrStateId: {
        type: String,
    },
    stateOfIssue: {
        type: String,
    },
    expirationDate: {
        type: Date,
    },
    professionalReferences: {
        type: [{
            name: String,
            phone: String,
            email: String,
            companyPosition: String,
        }],
    },
    howAreQualifiedForPosition: {
        type: String,
        required: false
    },
    additionalInformation: {
        type: String,
        required: false
    },

    // Consent Fields - All set to required: false
    consentAgreement: {
        type: Boolean,
        required: false
    },
    consentFirstName: {
        type: String,
        required: false
    },
    consentLastName: {
        type: String,
        required: false
    },
    consentDate: {
        type: Date,
        required: false
    },
    consentSignature: {
        type: String,
        required: false,
    },
    superVisionAgreement: {
        type: String,
        required: false
    },
    againConsentAgreement: {
        type: Boolean,
        required: false
    },
    againConsentFirstName: {
        type: String,
        required: false
    },
    againConsentLastName: {
        type: String,
        required: false
    },
    againConsentDate: {
        type: Date,
        required: false
    },
    againConsentSignature: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: [
            "Terminated",
            "Suspended",
            "Active",
            "Welcome Letter",
            "Doesn't Meet Qualifications",
            "Applicant Reviewed",
            "Interview Pending",
            "Interview Completed",
            "Incomplete Application",
            "Withdrawn",
            "Follow-Up",
            "Offer Sent",
            "Background Check Pending",
            "Credential Pending",
            "Offer Accepted",
            "Leave of Absence",
            "Vacation",
            "Probationary",
            "Pending Termination",
        ],
        default: 'Background Check Pending'
    },
    preferredCommunicationMethod: {
        type: String,
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    onboardingPdfKey : {
        type: String,
        required: true
    }
}, { timestamps: true });

export const onboardingApplicationModel = mongoose.model("onboardingApplications", onboardingApplicationSchema);