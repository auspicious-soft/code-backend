# Auspicious Soft Backend Code Architecture

A robust Node.js/Express backend service for managing therapy sessions, appointments, and client-therapist communications.

## 🚀 Features

- 👥 User Management (Clients, Therapists, Admins)
- 📅 Appointment Scheduling
- 💬 Real-time Chat
- 📧 Email Notifications
- 📱 SMS Notifications
- 🔒 Secure File Storage
- 💳 Payment Processing
- 🎫 Support Ticket System

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **File Storage**: AWS S3
- **Email Service**: Resend
- **SMS Service**: Twilio
- **Payment Processing**: Stripe
- **Task Scheduling**: node-cron

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- AWS Account
- Resend Account
- Twilio Account
- Stripe Account

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=8000

# Database
MONGO_URL=your_mongodb_url

# JWT
JWT_SECRET=your_jwt_secret
JWT_SECRET_PHONE=your_jwt_secret_for_mobile

# AWS
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name

# Resend
RESEND_API_KEY=your_resend_api_key
COMPANY_RESEND_GMAIL_ACCOUNT=your_company_email

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Frontend
FRONTEND_URL=your_frontend_url
```

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/black-therapy-network-api.git
```

2. Install dependencies:
```bash
cd black-therapy-network-api
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/login
POST /api/forgot-password
POST /api/verify-otp
POST /api/new-password
```

### Client Endpoints

```
GET /api/client/profile
POST /api/client/appointments
GET /api/client/therapists
```

### Therapist Endpoints

```
GET /api/therapist/appointments
POST /api/therapist/notes
GET /api/therapist/clients
```

### Admin Endpoints

```
GET /api/admin/users
POST /api/admin/therapists
GET /api/admin/reports
```

### Chat Endpoints

```
GET /api/chats/rooms
POST /api/chats/message
GET /api/chats/history
```

## 🔌 WebSocket Events

```javascript
// Connection
socket.on('connection')
socket.on('disconnect')

// Chat
socket.on('joinRoom')
socket.on('message')
socket.on('typing')
socket.on('stopTyping')

// Status
socket.on('checkOnlineStatus')
socket.on('onlineStatus')
```

## 📁 Project Structure

```
src/
├── configF/        # Configurations
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Helper functions
├── lib/           # Constants and shared code
└── app.ts         # Application entry
```

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Request validation
- CORS protection
- Rate limiting
- Secure file uploads
- Password hashing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
