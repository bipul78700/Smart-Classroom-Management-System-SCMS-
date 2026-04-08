# 🎓 Smart Classroom Management System (SCMS)

A complete working prototype of a Smart Classroom Management System built with Node.js, Express.js, MongoDB, and vanilla JavaScript.

## 📋 Features

### 1. **Role-Based Login System**
- Three user roles: Student, Teacher, and Admin
- Secure password authentication with bcrypt
- Role-based dashboard redirection

### 2. **Separate Dashboards**
- **Student Dashboard**: View attendance, mark presence, see available resources
- **Teacher Dashboard**: Mark student attendance, book resources, view bookings
- **Admin Dashboard**: View all users, attendance statistics, all bookings

### 3. **Attendance System**
- Teachers can mark students as Present/Absent
- Students can mark themselves present (simulated feature)
- Attendance history and statistics
- Prevents duplicate attendance marking

### 4. **Resource Booking System**
- Book classroom resources (Projector, Lab, Computer, etc.)
- Time slot management
- Prevents duplicate bookings for same time slot
- View all bookings

### 5. **RESTful APIs**
- Authentication API
- Attendance management API
- Resource booking API

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcryptjs for password hashing

## 📁 Project Structure

```
scms/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── package.json              # Backend dependencies
│   ├── seed.js                   # Database seeding script
│   ├── .env.example              # Environment variables template
│   ├── models/
│   │   ├── User.js              # User model (Student/Teacher/Admin)
│   │   ├── Attendance.js        # Attendance model
│   │   └── Booking.js           # Resource booking model
│   └── routes/
│       ├── auth.js              # Authentication routes
│       ├── attendance.js        # Attendance routes
│       └── booking.js           # Booking routes
├── frontend/
│   ├── index.html               # Login page
│   ├── student.html             # Student dashboard
│   ├── teacher.html             # Teacher dashboard
│   ├── admin.html               # Admin dashboard
│   ├── css/
│   │   └── style.css            # Global styles
│   └── js/
│       ├── auth.js              # Login logic
│       ├── student.js           # Student dashboard logic
│       ├── teacher.js           # Teacher dashboard logic
│       └── admin.js             # Admin dashboard logic
└── README.md                    # This file
```

## 🚀 How to Run

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download here](https://git-scm.com/)

### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the installation wizard
3. MongoDB will start automatically as a Windows service

**Verify MongoDB is running:**
```bash
# Open Command Prompt or PowerShell and run:
mongo --version
# or
mongod --version
```

### Step 2: Clone or Download the Project

If you have the project as a zip file, extract it to your desired location.

If using Git:
```bash
git clone <repository-url>
cd scms
```

### Step 3: Install Backend Dependencies

Open terminal/Command Prompt in the project directory:

```bash
cd backend
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- cors (cross-origin resource sharing)
- bcryptjs (password hashing)
- dotenv (environment variables)
- nodemon (development auto-restart)

### Step 4: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# In the backend folder, create a file named .env
# Add the following content:

MONGODB_URI=mongodb://localhost:27017/scms
PORT=3000
```

**Or simply copy the example file:**
```bash
# In the backend folder:
copy .env.example .env
```

### Step 5: Seed the Database (Add Test Data)

This step populates the database with sample users, attendance records, and bookings:

```bash
# Make sure you're in the backend folder
npm run seed
```

**This creates:**
- 1 Admin account
- 2 Teacher accounts
- 5 Student accounts
- Sample attendance records
- Sample resource bookings

### Step 6: Start the Backend Server

```bash
# In the backend folder
npm start
```

**Or for development with auto-restart:**
```bash
npm run dev
```

**You should see:**
```
✅ MongoDB connected successfully
🚀 Server is running on http://localhost:3000
```

### Step 7: Open the Frontend

1. Open the `frontend` folder in File Explorer
2. Double-click on `index.html` to open it in your browser
3. **OR** drag `index.html` into your browser window

**The application will open at:** `file:///path/to/scms/frontend/index.html`

## 🔐 Test Credentials

After seeding the database, use these credentials to login:

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Select "Admin" from dropdown

### Teacher Login
- **Username**: `teacher1`
- **Password**: `teacher123`
- **Role**: Select "Teacher" from dropdown

### Student Login
- **Username**: `student1`
- **Password**: `student123`
- **Role**: Select "Student" from dropdown

**Additional test users**: `teacher2`, `student2`, `student3`, `student4`, `student5` (all with password: `teacher123` or `student123`)

## 📖 Usage Guide

### As a Student:
1. Login with student credentials
2. Click "Mark Myself Present" to mark attendance
3. View your attendance history and statistics
4. See available classroom resources

### As a Teacher:
1. Login with teacher credentials
2. View attendance summary statistics
3. Select a student and mark them Present or Absent
4. View today's attendance records
5. Book classroom resources by filling out the booking form
6. View all resource bookings

### As an Admin:
1. Login with admin credentials
2. View overall statistics (total users, students, teachers)
3. See attendance overview for today
4. View all users in the system
5. View all resource bookings

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login          - User login
GET    /api/auth/users          - Get all users
```

### Attendance
```
POST   /api/attendance                    - Mark attendance
GET    /api/attendance/date/:date         - Get attendance by date
GET    /api/attendance/student/:id        - Get student attendance
GET    /api/attendance/summary            - Get attendance summary
```

### Bookings
```
POST   /api/bookings                      - Create booking
GET    /api/bookings                      - Get all bookings
GET    /api/bookings/date/:date           - Get bookings by date
GET    /api/bookings/resource/:name       - Get bookings by resource
DELETE /api/bookings/:id                  - Cancel booking
```

## 🎨 Features Overview

### Login System
- Role-based authentication (Student/Teacher/Admin)
- Password validation using bcrypt
- Session management using localStorage
- Automatic redirect to appropriate dashboard

### Attendance System
- Teachers can mark attendance for individual students
- Students can mark themselves present (simulated)
- Prevents duplicate attendance for same day
- Real-time attendance statistics
- Historical attendance records

### Resource Booking
- 6 available resources: Projector, Computer Lab, Science Lab, Smart Board, Audio System, Library
- 7 time slots from 9 AM to 4 PM
- Prevents duplicate bookings for same resource/time/date
- View all bookings with status

### Dashboard Features
- **Student**: Personal attendance, quick actions, resource list
- **Teacher**: Mark attendance, book resources, view bookings
- **Admin**: System-wide statistics, user management, all bookings

## 🐛 Troubleshooting

### MongoDB Connection Error
**Problem**: "MongoDB connection error"
**Solution**: 
- Make sure MongoDB is running
- On Windows: `net start MongoDB`
- Check if MongoDB service is active in Services

### Port Already in Use
**Problem**: "Port 3000 is already in use"
**Solution**:
- Change the PORT in `.env` file to another port (e.g., 3001)
- Or kill the process using port 3000

### CORS Error in Browser
**Problem**: CORS policy errors in browser console
**Solution**:
- Make sure backend server is running
- Check that CORS middleware is enabled in server.js

### Cannot Login
**Problem**: "Invalid credentials" error
**Solution**:
- Make sure you ran the seed script: `npm run seed`
- Check that username and password are correct
- Ensure correct role is selected from dropdown

### Frontend Not Loading
**Problem**: Blank page or errors
**Solution**:
- Open browser developer console (F12) to see errors
- Make sure backend is running on http://localhost:3000
- Check network tab for failed API calls

## 📝 Notes

- This is a **prototype** for demonstration purposes
- Passwords are hashed using bcrypt for security
- No real face recognition (simulated with button click)
- Session is stored in browser localStorage
- No email verification or password reset features
- Designed for local development and testing

## 🔄 Development Commands

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server with auto-restart (development)
npm run dev

# Seed database with test data
npm run seed
```

## 📊 Database Collections

The application creates three MongoDB collections:

1. **users** - User accounts with roles
2. **attendances** - Attendance records
3. **bookings** - Resource booking records

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review the code comments
3. Check browser console for frontend errors
4. Check terminal for backend errors

## 📄 License

This project is created for educational purposes.

---

**Happy Coding! 🎉**
