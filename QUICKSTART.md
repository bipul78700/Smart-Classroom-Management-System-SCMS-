# 🚀 Quick Start Guide - SCMS

## Fast Setup (5 Minutes)

### 1️⃣ Install Dependencies
```bash
cd backend
npm install
```

### 2️⃣ Setup Environment
```bash
copy .env.example .env
```

### 3️⃣ Start MongoDB
Make sure MongoDB is running on your system.

### 4️⃣ Seed Database
```bash
npm run seed
```

### 5️⃣ Start Server
```bash
npm start
```

### 6️⃣ Open Frontend
Open `frontend/index.html` in your browser.

---

## 🔑 Login Credentials

| Role     | Username  | Password    |
|----------|-----------|-------------|
| Admin    | admin     | admin123    |
| Teacher  | teacher1  | teacher123  |
| Student  | student1  | student123  |

---

## 📂 Project Structure

```
scms/
├── backend/           # Node.js + Express API
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── server.js     # Main server file
│   └── seed.js       # Test data generator
├── frontend/          # HTML/CSS/JS interface
│   ├── index.html    # Login page
│   ├── student.html  # Student dashboard
│   ├── teacher.html  # Teacher dashboard
│   ├── admin.html    # Admin dashboard
│   ├── css/          # Styles
│   └── js/           # JavaScript logic
└── README.md         # Full documentation
```

---

## 🎯 What to Test

### As Student:
- Login → Mark yourself present → View attendance history

### As Teacher:
- Login → Mark student attendance → Book a resource → View bookings

### As Admin:
- Login → View all statistics → See all users → Check all bookings

---

## ⚠️ Common Issues

**MongoDB not running?**
```bash
# Windows
net start MongoDB
```

**Port 3000 in use?**
Change PORT in `.env` file to 3001 or another available port.

**Can't login?**
Make sure you ran `npm run seed` first to create test users.

---

## 📖 Full Documentation

See [README.md](README.md) for complete documentation including:
- Detailed feature list
- API endpoints
- Troubleshooting guide
- Database schema

---

**Need Help?** Check the main README.md file!
