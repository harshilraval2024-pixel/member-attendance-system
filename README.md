# Member Management & Attendance Analytics System

A full-stack web application for managing members, recording weekly attendance, and viewing analytics dashboards with charts and statistics.

## Tech Stack

### Frontend
- **React.js** - UI framework
- **MobX** - State management
- **Formik + Yup** - Form handling & validation
- **Bootstrap 5** - UI styling
- **FontAwesome** - Icons
- **Recharts** - Interactive charts
- **Axios** - API requests
- **React Router** - SPA navigation
- **React Toastify** - Toast notifications

### Backend
- **Node.js + Express.js** - REST API server
- **MongoDB + Mongoose** - Database & ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/member-attendance
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Seed Database (Optional)

```bash
cd backend
npm run seed
```
This creates:
- Admin account: `admin@example.com` / `admin123`
- 8 sample members
- 64 attendance records (8 weeks)

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register admin |
| POST | /api/auth/login | Admin login |
| GET | /api/auth/me | Get current admin |

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/members | List all members (paginated, searchable) |
| POST | /api/members | Create new member |
| GET | /api/members/:id | Get member by ID |
| PUT | /api/members/:id | Update member |
| DELETE | /api/members/:id | Delete member + attendance |
| GET | /api/members/skills/all | Get all unique skills |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/attendance | List attendance records |
| POST | /api/attendance | Record single attendance |
| POST | /api/attendance/bulk | Bulk record attendance |
| GET | /api/attendance/member/:id | Get member attendance + stats |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stats/dashboard | Dashboard aggregated stats |
| GET | /api/stats/member/:id | Member-specific analytics |

---

## Features

### Member Registration
- Formik form with Yup validation
- Conditional fields (studying/working)
- Dynamic skills & interests tags
- Bootstrap-styled with FontAwesome icons

### Attendance Tracking
- Dropdown member selection
- Duplicate prevention (same member + date)
- Paginated records table

### Dashboard
- Stat cards (total members, attendance rate, most active)
- Weekly & monthly attendance trend charts
- Skills distribution bar chart
- Study vs Job pie chart

### Member Profile
- Full member details
- Attendance stats (present/absent/efficiency)
- Attendance history chart
- Weekly participation line chart

### Authentication
- JWT-based admin login
- Protected routes
- Token persistence

---

## Project Structure

```
member-attendance-system/
├── backend/
│   ├── config/          # DB connection & env config
│   ├── controllers/     # Route handlers
│   ├── middlewares/      # Auth, error handling, rate limiting
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── seed.js          # Database seeder
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── charts/  # Recharts components
│       │   ├── common/  # Reusable UI components
│       │   ├── forms/   # Formik forms
│       │   └── layout/  # Navbar
│       ├── pages/       # Route pages
│       ├── services/    # Axios API layer
│       ├── stores/      # MobX stores
│       └── utils/       # Helpers & validation schemas
```
