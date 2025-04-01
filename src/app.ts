import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url'; // <-- Add this import
import connectDB from "./configF/db";
import { admin, chats, client, therapist } from "./routes";
import { checkValidAdminRole } from "./utils";
import { createServer } from 'http';
import { Server } from "socket.io";
import socketHandler from "./configF/socket";
import { forgotPassword, login, newPassswordAfterVerifiedOTP, verifyOTP } from "./controllers/therapist/therapist";
import bodyParser from 'body-parser'
import { allowedOrigins, SERVER_CONFIG } from "./lib/constant";
import cron from 'node-cron';
import { sendAppointmentNotifications } from "./configF/cron";
import { checkAuth } from "./middleware/check-auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client } from "./configF/s3";
const __filename = fileURLToPath(import.meta.url); // <-- Define __filename
const __dirname = path.dirname(__filename); // <-- Define __dirname


const app = express();
const http = createServer(app);
app.set("trust proxy", true);

app.use(bodyParser.json({
    verify: (req: any, res, buf) => {
        req.rawBody = buf.toString();
    }
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: allowedOrigins as Array<string>,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
        credentials: true,
    })
)

const io = new Server(http, {
    // path: '/socket.io/',  Dont required as we are using default path
    cors: {
        origin: allowedOrigins as Array<string>,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
        credentials: true,
    },
});


// Attach io to req
app.use((req: any, res: any, next: any) => {
    req.io = io;
    next();
});

var dir = path.join(__dirname, 'static');
app.use(express.static(dir));

var uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Connection to database
connectDB();


// IO Connection
socketHandler(io);

app.get("/", (req: any, res: any) => {
    res.send("Hello world entry point 🚀");
});

app.use("/api/admin", checkValidAdminRole, admin);
app.use("/api/therapist", therapist);
app.use("/api/client", client);
app.use("/api/chats", chats);
app.post("/api/login", login)
app.post("/api/forgot-password", forgotPassword)
app.post("/api/verify-otp", verifyOTP)
app.post("/api/new-password", newPassswordAfterVerifiedOTP)    
app.get("/api/s3-signed-url", checkAuth, async (req: any, res: any) => {
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.body.key,
        ContentType: req.body.type,
    }
    try {
        const command = new PutObjectCommand(uploadParams)
        const signedUrl = await getSignedUrl(await createS3Client(), command)
        res.status(200).json({ signedUrl, key: uploadParams.Key })
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw error
    }
})

// Scheduler for sending notifications for every 15 minutes
cron.schedule(SERVER_CONFIG.CRON_SCHEDULE, async () => {
    try {
        await sendAppointmentNotifications();
    } catch (error) {
        console.error('Cron job failed:❌', error);
    }
})

http.listen(8000, () => console.log(`Server is listening on port ${8000}`));