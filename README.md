# The Curator

<p align="center">
  <strong>An AI-powered MERN blogging platform with a public reader experience, creator tools, and a React admin dashboard.</strong>
</p>

<p align="center">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-API-000000?style=for-the-badge&logo=express&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111111">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white">
</p>

---

## Overview

The Curator is a full-stack content platform built for modern blog publishing. It brings together user authentication, blog creation, rich media uploads, category-based discovery, an admin dashboard, and AI-assisted writing powered by Gemini.

The project is organized as a MERN application with three main workspaces:

```text
The_Curator/
  backend/       Express, MongoDB, auth, blogs, uploads, AI routes
  frontend/      Public/user-facing React application
  admin_panel/   React admin dashboard for managing platform content
```

## Features

### User Frontend

- Modern React and Vite application
- User signup, login, OTP verification, and token refresh flow
- Google OAuth support
- Profile pages and editable user details
- Blog feed with search and category filtering
- Blog creation and preview screens
- AI blog generator interface
- Responsive UI with Bootstrap, Tailwind CSS, and custom styling

### Backend API

- Express API mounted under `/thecurator`
- MongoDB data layer with Mongoose models
- JWT access and refresh token authentication
- Blog CRUD workflows with slug support
- Blog category model and seed script
- Cloudinary media upload integration
- Multer-based upload handling
- Email/OTP services using SMTP
- Google OAuth via Passport
- Gemini AI service for content generation

### Admin Dashboard

- Separate React dashboard in `admin_panel`
- Admin route protection
- Blog management dashboard
- User/profile management components
- Shared blog editor, upload, preview, and feed components
- Redux Toolkit state management

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, React Router, Redux Toolkit, Redux Persist |
| Styling | Bootstrap, React Bootstrap, Tailwind CSS, custom CSS |
| Forms and UI | Formik, Yup, React Select, SweetAlert2, React Toastify |
| Editor | TipTap |
| Backend | Node.js, Express, Mongoose |
| Auth | JWT, Passport Google OAuth, bcryptjs |
| Media | Multer, Cloudinary |
| AI | Google Generative AI SDK, Gemini |
| Email | Nodemailer |

## API Structure

The backend runs on port `5000` by default and exposes routes under:

```text
http://localhost:5000/thecurator
```

Main route groups:

| Route Group | Purpose |
| --- | --- |
| `/auth` | Signup, login, OTP, refresh tokens, Google auth |
| `/user` | User profile and account operations |
| `/admin` | Admin-only APIs |
| `/blog` | Blog creation, publishing, feeds, categories |
| `/ai` | AI blog/content generation |

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database
- Cloudinary account
- Google OAuth credentials
- Gemini API key
- SMTP email credentials

### 1. Clone the Repository

```bash
git clone https://github.com/sumit2jan/The_Curator.git
cd The_Curator
```

### 2. Configure Backend Environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

CLIENT_URL=http://localhost:5173
SUPER_ADMIN_EMAIL=admin@example.com

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_APP_NAME=The Curator
MAIL_FROM_ADDRESS=no-reply@example.com

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/thecurator/auth/google/callback

GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies

Install each workspace separately:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin_panel
npm install
```

### 4. Run the Project

Start the backend:

```bash
cd backend
npm run dev
```

Start the user frontend:

```bash
cd frontend
npm run dev
```

Start the admin dashboard:

```bash
cd admin_panel
npm run dev
```

Default local URLs:

| App | URL |
| --- | --- |
| Backend API | `http://localhost:5000` |
| User Frontend | `http://localhost:5173` |
| Admin Dashboard | Vite will print the local URL in the terminal |

## Useful Scripts

### Backend

```bash
npm run dev
```

### Frontend and Admin Panel

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Seed Blog Categories

```bash
cd backend
node seed/category.seed.js
```

## Project Highlights

- Full MERN architecture with clear separation between API, public frontend, and admin dashboard
- AI-assisted content generation built directly into the blogging workflow
- Rich blog editor experience with media upload support
- Production-minded authentication flow with access tokens, refresh tokens, OTP, and Google OAuth
- Admin dashboard designed as a dedicated React application instead of being mixed into the user frontend

## Repository Status

This project is under active development. Current focus areas include blog publishing, admin workflows, AI writing assistance, user profile management, and platform-level content curation.

## Author
