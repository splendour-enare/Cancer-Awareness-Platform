# Cancer Awareness & Risk Assessment Platform

An interactive web application designed to promote awareness, education, and early risk assessment for **Breast Cancer** and **Prostate Cancer**. The platform provides users with interactive risk questionnaires, educational resources, and offers administrators comprehensive management and analytics tools.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Default Admin Account](#default-admin-account)
- [Application Routes](#application-routes)
- [License](#license)

---

## Features

### 👤 User Features
- **User Authentication:** Registration and session-based login.
- **Interactive Risk Assessments:**
  - **Breast Cancer Risk Assessment:** Multi-step questionnaire evaluating personal and family medical history, lifestyle factors, and symptoms to compute risk level (Low, Moderate, High).
  - **Prostate Cancer Risk Assessment:** Age, symptom, and family history evaluation.
- **Personalized Risk Results:** Real-time risk feedback and profile tracking.
- **Educational Hub:**
  - Breast Cancer Prevention & Risk Information.
  - Prostate Cancer Prevention & Risk Information.
  - Media/articles with uploaded resource guides.

### 🛡️ Admin Features
- **Admin Dashboard:** High-level metrics showing total registered users, assessments completed, and total resources.
- **User Management:** View all registered accounts and delete users.
- **Assessment Analytics:** Statistical breakdown and percentages across Low, Moderate, and High risk categories.
- **Resource Management:** Upload and manage cancer educational articles with featured image uploads (powered by Multer).

---

## Tech Stack

- **Backend:** [Node.js](https://nodejs.org/), [Express.js 5](https://expressjs.com/)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/), [Mongoose 9](https://mongoosejs.com/)
- **View Engine:** [EJS (Embedded JavaScript Templates)](https://ejs.co/)
- **Session Management:** `express-session`, `connect-mongo`
- **File Uploads:** `multer`
- **Styling & Assets:** Vanilla CSS and JavaScript located in `public/`

---

## Project Structure

```text
Cancer-Awareness-Platform/
├── app.js                         # Application entry point & server configuration
├── package.json                   # Project dependencies and scripts
├── .env.example                   # Template for environment variables
├── controllers/
│   └── authController.js          # Authentication, assessments, resources & admin logic
├── middleware/
│   ├── authMiddleware.js          # Route protection and role verification
│   └── uploadResourceImage.js     # Multer storage configuration for uploads
├── models/
│   ├── User.js                    # User schema (profile & assessment results)
│   └── Resource.js                # Resource schema (articles, categories, images)
├── public/
│   ├── css/                       # Static stylesheets
│   ├── js/                        # Client-side scripts
│   └── uploads/                   # Uploaded images and media
├── routes/
│   └── authRoutes.js              # Application routing definitions
└── views/                         # EJS templates
    ├── index.ejs                  # Landing page
    ├── login.ejs                  # User login
    ├── register.ejs               # User registration
    ├── select-questions.ejs       # Assessment selection page
    ├── breast-assessment.ejs      # Breast cancer assessment tool
    ├── prostate-assessment.ejs    # Prostate cancer assessment tool
    ├── admin-dashboard.ejs        # Admin dashboard overview
    ├── assessments.ejs            # Admin assessment statistics
    ├── users.ejs                  # Admin user management
    ├── resources.ejs              # Admin resource management
    └── partials/                  # Reusable UI partials
```

---

## Prerequisites

Before running the application, ensure you have the following installed:

1. **[Node.js](https://nodejs.org/)** (v18.x or higher recommended)
2. **[npm](https://www.npmjs.com/)** (comes bundled with Node.js)
3. **[MongoDB](https://www.mongodb.com/)** (running locally on port 27017 or a MongoDB Atlas connection string)

---

## Installation & Setup

### 1. Clone or Open the Repository
```bash
git clone <repository-url>
cd Cancer-Awareness-Platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and set your configuration:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cancer_awareness
```

> **Note:** If you are using MongoDB Atlas (cloud database), replace `MONGO_URI` with your connection URI:
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/cancer_awareness?retryWrites=true&w=majority`

---

## Running the Application

### Start the Server
```bash
npm start
```
Or run directly with Node:
```bash
node app.js
```

### Access the Web App
Open your web browser and navigate to:
```
http://localhost:3000
```

---

## Default Admin Account

To access the Admin Portal (`/admin-dashboard`), register or log in using the pre-configured admin credentials:

- **Email:** `admin@gmail.com`
- **Password:** `admin`

Upon logging in with these credentials, you will be redirected to the **Admin Dashboard** where you can view analytics, manage users, and add resources.

---

## Application Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | Home Landing Page | Public |
| `GET` | `/register` | Registration Page | Public |
| `POST` | `/register` | Handle Account Creation | Public |
| `GET` | `/login` | Login Page | Public |
| `POST` | `/login` | Handle Authentication | Public |
| `GET` | `/select-questions` | Assessment Selector | Authenticated |
| `GET` | `/breast-assessment` | Breast Cancer Risk Assessment | Authenticated |
| `GET` | `/prostate-assessment`| Prostate Cancer Risk Assessment | Authenticated |
| `POST`| `/breast-cancer-risk` | Save Breast Risk Result | Authenticated |
| `POST`| `/prostate-cancer-risk`| Save Prostate Risk Result | Authenticated |
| `GET` | `/breast-resources` | Breast Cancer Educational Hub | Public |
| `GET` | `/prostate-resources` | Prostate Cancer Educational Hub | Public |
| `GET` | `/admin-dashboard` | Admin Analytics Dashboard | Admin |
| `GET` | `/users` | User Management | Admin |
| `POST`| `/users/delete/:id` | Delete User Account | Admin |
| `GET` | `/resources` | View & Manage Resources | Admin |
| `POST`| `/resources/:cancerType/:category` | Create New Educational Resource | Admin |
| `GET` | `/assessments` | Overall Assessment Statistics | Admin |

---

## License

This project is licensed under the [ISC License](file:///Users/masterkelvin/Splendour/Cancer-Awareness-Platform/package.json).
