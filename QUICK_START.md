# 🚀 QUICK START GUIDE
## Get Your Hostel Management System Running in 5 Minutes!

---

## Step 1️⃣: Setup Database (2 minutes)

### Open MySQL Workbench or Command Line:

```sql
CREATE DATABASE hostel_management;
USE hostel_management;
SOURCE database.sql;
```

**✅ Success Check:** Run `SHOW TABLES;` - You should see 6 tables

---

## Step 2️⃣: Configure Backend (1 minute)

1. Open `backend/db.js`
2. Change line 4:
   ```javascript
   password: 'YOUR_MYSQL_PASSWORD',  // ← Put your MySQL password here
   ```
3. Save the file

---

## Step 3️⃣: Install & Start Backend (1 minute)

Open Terminal/Command Prompt:

```bash
cd backend
npm install
node server.js
```

**✅ Success Check:** You should see:
```
🚀 Server running on http://localhost:5000
```

**⚠️ IMPORTANT:** Keep this terminal window open!

---

## Step 4️⃣: Open Frontend (30 seconds)

1. Go to the `frontend` folder
2. Double-click `login.html`
3. It should open in your browser

---

## Step 5️⃣: Login & Test (30 seconds)

### Admin Login:
- Email: `admin@hostel.com`
- Password: `admin123`

Click "Login as Admin" → You should see the dashboard! 🎉

---

## 🎯 What to Do Next?

### As Admin:
1. **Add Students** → Click "Add Student" in sidebar
2. **Create Rooms** → Click "Create Rooms"
3. **Assign Rooms** → Click "Assign Room"

### Test Student Portal:
1. After adding a student (e.g., student@test.com)
2. Logout from admin
3. Login with:
   - Email: student@test.com
   - Password: student123

---

## ❓ Troubleshooting

### Backend won't start?
```bash
# Run this in the backend folder:
npm install
```

### Can't login?
- Make sure backend server is running
- Check if you created the database
- Verify admin email: admin@hostel.com

### Pages won't load?
- Check browser console (F12)
- Make sure backend shows "Server running"
- Try refreshing the page

---

## 📊 System Features Overview

### Admin Can:
✅ Manage students
✅ Create & assign rooms
✅ Track payments
✅ Handle complaints
✅ View statistics

### Students Can:
✅ View room details
✅ Check payments
✅ Submit complaints
✅ Update profile

---

## 🎉 You're Ready!

Your hostel management system is now running!

For detailed help, check **COMPLETE_GUIDE.md**

---

**Need Help?** Check the COMPLETE_GUIDE.md for detailed troubleshooting!
