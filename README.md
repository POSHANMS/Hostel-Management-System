# 🏠 Hostel Management System

A complete, production-ready hostel management system with admin and student portals.

## ⚡ Quick Start

### 1. Setup Database
```sql
mysql -u root -p
CREATE DATABASE hostel_management;
USE hostel_management;
SOURCE database.sql;
```

### 2. Start Backend
```bash
cd backend
npm install
node server.js
```

### 3. Open Frontend
Open `frontend/login.html` in your browser

### 4. Login
- **Admin**: admin@hostel.com / admin123
- **Student**: Add student first, then use their email / student123

## 📚 Documentation

See **COMPLETE_GUIDE.md** for full installation and usage instructions.

## 🎯 Features

### Admin Panel
- Dashboard with statistics
- Student management
- Room management
- Room assignment
- Payment tracking
- Complaint management

### Student Portal
- Personal dashboard
- Room details
- Payment history
- Complaint submission
- Profile management

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript
- **Architecture**: RESTful API

## 📁 Project Structure

```
├── backend/          # Node.js backend
├── frontend/         # HTML/CSS/JS frontend
├── database.sql      # Database schema
└── COMPLETE_GUIDE.md # Full documentation
```

## 🔧 Configuration

Edit `backend/db.js` to set your MySQL password:

```javascript
password: 'YOUR_MYSQL_PASSWORD'
```

## ✅ System Status

- ✅ Backend: 100% Complete
- ✅ Frontend: 100% Complete  
- ✅ All Features: Working
- ✅ Ready to Use

## 📞 Support

Check **COMPLETE_GUIDE.md** for troubleshooting and detailed help.

---

**Built for hostel management**
