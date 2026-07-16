<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=220&text=Tutor%20Connect&fontSize=45&fontAlignY=40&color=0:14b8a6,100:2563eb&fontColor=ffffff"/>
</p>
<p align="center">
  <img src="https://skillicons.dev/icons?i=react,express,mongodb,nodejs,redux,socketio" />
</p>

<p align="center">

![React](https://img.shields.io/badge/React-18-61DAFB)
![Express](https://img.shields.io/badge/Express-4.x-000000)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-010101)

</p>


# 🎓 Tutor Recruitment Platform

A full-stack web application that connects students with tutors through recruitment posts.  
The platform supports tutor discovery, real-time messaging, application management, digital contracts, reporting, and an admin moderation system.

---

## ✨ Features

### 👤 Authentication

- User registration
- Teacher registration
- Login / Logout
- Forgot password
- Reset password

---

### 👨‍🎓 Student Features

- Create and manage recruitment posts
- Browse tutor profiles
- Save recruitment posts
- Favorite tutors
- Search tutors by subject
- Search tutors by province
- Find nearby tutors
- Apply reports
- Receive notifications
- Real-time chat with tutors
- View recruitment post statistics

---

### 👨‍🏫 Teacher Features

- Browse recruitment posts
- Apply for teaching opportunities
- Check application status
- View nearby recruitment posts
- Receive notifications
- Chat with students
- Create recruitment contracts

---

### 💬 Real-time Chat

- One-to-one messaging
- Conversation management
- Unread message counter
- Socket.IO powered real-time communication

---

### 📄 Recruitment & Contract

- Recruitment post management
- Teacher application workflow
- Contract creation
- Contract download

---

### ❤️ Favorites & Collections

- Favorite tutors
- Saved recruitment posts

---

### 🔔 Notification System

- Get personal notifications
- Mark notification as read
- Mark all notifications as read
- Delete notifications

---

### 🚩 Report System

Users can report inappropriate content.

Admin can:

- Review pending reports
- Resolve reports

---

### 📝 Blog System

Admin can:

- Create blogs
- Update blogs
- Delete blogs
- Manage published blogs

---

### 🛡 Admin Dashboard

Dashboard statistics include:

- Total users
- Total teachers
- Recruitment posts
- Reports
- Blogs

Admin also manages:

- User accounts
- Teacher accounts
- Recruitment post approval
- Blog management
- Report moderation

---

## 🛠 Tech Stack

### Backend

- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO

### Frontend

- React
- Redux
- React Router
- Axios
- Socket.IO Client

---

## 🏗 Architecture

                +----------------------+
                |     React Client     |
                +----------+-----------+
                           |
                  REST API / Socket.IO
                           |
              +------------v------------+
              |     Express Server      |
              | Authentication          |
              | Recruitment Posts       |
              | Applications            |
              | Contracts               |
              | Chat                    |
              | Notifications           |
              +------------+------------+
                           |
                    Mongoose ODM
                           |
              +------------v------------+
              |        MongoDB          |
              +-------------------------+

---

## 📁 Project Structure

### Backend

```text
backend/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── public/
└── fonts/
```

The backend follows a traditional Express architecture with separated Routes, Controllers, and Models.

---

### Frontend

```text
src/
├── apiCalls/
├── components/
├── context/
├── hooks/
├── layouts/
├── modals/
├── pages/
├── redux/
├── routes/
├── sections/
└── utils/
```

The frontend is organized around reusable components, pages, Redux state management, and API modules.

---

## 🚀 Core Modules

- Authentication
- Tutor Management
- Recruitment Posts
- Teacher Applications
- Real-time Chat
- Notifications
- Contract Management
- Blog Management
- Report Management
- Admin Dashboard

---

## 🔄 Application Flow

```text
Student
   │
   ├── Create Recruitment Post
   │
Teacher
   │
   ├── Browse Posts
   ├── Submit Application
   │
Student
   │
   ├── Approve Teacher
   │
Both Users
   │
   ├── Real-time Chat
   ├── Create Contract
   └── Download Contract
```

---

## 📌 Highlights

- Role-based authentication
- Real-time messaging using Socket.IO
- Recruitment workflow between students and tutors
- Teacher application approval system
- Digital contract generation
- Notification center
- Favorites and saved posts
- Admin moderation dashboard
- Blog management
- Reporting system

---

## 📄 License

This project was developed for learning purposes and portfolio demonstration.
