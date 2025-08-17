# 🏠 Household Services Booking Platform

A **full-stack web application** for booking various household services like plumbing, cleaning, and electrical work.  
Built with *Node.js**, **Express**, **MySQL**, and **React.js (with TailwindCSS)***.

---

## 📌 Features

### 🔹 User Features
- Browse and search household services
- User authentication (Login/Register with JWT)
- Book services easily
- Responsive UI for mobile & desktop

### 🔹 Admin Features
- Manage service listings (Add, Edit, Delete)
- View all bookings
- Approve/Reject service requests

---

## 🛠️ Tech Stack

| Layer         | Technology Used |
|--------------|-----------------|
| **Frontend** | React.js, TailwindCSS |
| **Backend**  | Node.js, Express |
| **Database** | MySQL |
| **Auth**     | JWT (JSON Web Token) |
| **Hosting**  | (Add hosting details if deployed) |

---

## 📂 Folder Structure

household-services-app/
│
├── household-services-backend/ # Backend API
│ ├── config/ # DB config
│ ├── controllers/ # Logic for routes
│ ├── middleware/ # Auth middleware
│ ├── routes/ # API routes
│ ├── .env # Environment variables
│ ├── server.js # Entry point
│
├── household-services-frontend/ # React frontend
│ ├── src/
│ ├── public/
│
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/household-services-app.git
cd household-services-app
```
### 2️⃣ Backend Setup

``` 
cd household-services-backend
npm install
```
Create a .env file in household-services-backend:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=servicehub

# Server Configuration
PORT=5000

# JWT Secret
JWT_SECRET=your-secure-jwt-secret

# CORS Origin (Frontend URL)
CORS_ORIGIN=http://localhost:3000
```
### Import MySQL Database:

```
CREATE DATABASE servicehub;
```
#### Run migrations or import your .sql file.

### Start the backend server:

```
npm run dev
```
### 3️⃣ Frontend Setup

```
cd ../household-services-frontend
npm install
npm start
```
### 📡 API Endpoints
#### Auth Routes
- POST /api/auth/register → Register a user

- POST /api/auth/login → Login user & get token

#### Services Routes
- GET /api/services → Fetch all services

- POST /api/services → Add a new service (Admin only)

- DELETE /api/services/:id → Delete a service (Admin only)

# 🔒 Environment Variables

### Make sure to set:

- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

- PORT

- JWT_SECRET

- CORS_ORIGIN


# 🤝 Contributing
> Fork this repo

> Create a new branch: git checkout -b feature-branch

>Commit changes: git commit -m 'Add new feature'

> Push to branch: git push origin feature-branch

> Open a Pull Request

# 📜 License
This project is licensed under the MIT License.

# 👨‍💻 Author

Pawan mallik

💌 Email: pawanmallick432003@gmail.com

