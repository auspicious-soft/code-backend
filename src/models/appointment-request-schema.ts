import mongoose, { Schema } from "mongoose"

const appointmentRequestSchema = new mongoose.Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "clients",
    },
    clientName: {
        type: String,
        required: true
    },
    therapistId: {
        type: Schema.Types.ObjectId,
        ref: "therapists",
        default: null
    },
    appointmentDate: {
        type: Date,
        required: false
    },
    appointmentTime: {
        type: String,
        required: false
    },
    peerSupportIds: {
        type: [Schema.Types.ObjectId],
        ref: "therapists",
        default: null
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Approved", "Completed", "Not Attended", "Rejected"]
    },
    notificationSent: {
        type: {
            onBookingAppointment: { type: Boolean, default: false },
            before24hrs: { type: Boolean, default: false },
            before1hr: { type: Boolean, default: false },
            onAppointmentStart: { type: Boolean, default: false },
            _id: false
        },
        default: {}
    },
    sessionNotes: { type: String, required: false },
    sessionNotesData: { type: mongoose.Schema.Types.Mixed, required: false, default: null },
    isLocked: { type: Boolean, default: true },
},
    { timestamps: true }
);

export const appointmentRequestModel = mongoose.model("appointmentRequests", appointmentRequestSchema);