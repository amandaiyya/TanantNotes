# 📝 Tenant Notes - Multi-Tenant SaaS Notes Application

## 🌟 Overview
**Tenant Notes** is a multi-tenant SaaS Notes application built with **Next.js**, deployed on **Vercel**. It allows multiple tenants (companies) to securely manage their users and notes with role-based access control and subscription limits.  

This project demonstrates multi-tenancy, authentication, subscription-based feature gating, and a minimal but functional frontend using **ShadCN UI**, **React Hot Toast**, and modern React features.

---

## 🚀 Features

### 🏢 Multi-Tenancy
- Supports multiple tenants (e.g., **Acme** and **Globex**).
- 🔒 Strict data isolation between tenants.
- Tenants have their own subscription plans (**Free** or **Pro**).
- Backend enforces tenant isolation in all routes.

### 🔐 Authentication & Authorization
- JWT-based authentication stored in **HttpOnly cookies**.
- Roles:
  - **Admin**: Can invite users and upgrade subscriptions.
  - **Member**: Can create, view, edit, and delete notes.
- Predefined test accounts:

| Email               | Role   | Tenant  |
|--------------------|--------|--------|
| admin@acme.test     | Admin  | Acme   |
| user@acme.test      | Member | Acme   |
| admin@globex.test   | Admin  | Globex |
| user@globex.test    | Member | Globex |

### 💳 Subscription Feature Gating
- **Free Plan**: Tenant limited to 3 notes.
- **Pro Plan**: Unlimited notes.
- Admins can upgrade subscription via:  
  `POST /api/tenants/:slug/upgrade`
- Subscription changes are enforced immediately.

### 📝 Notes API (CRUD)
All notes operations are tenant-aware and role-checked:
- `POST /api/notes` → Create a note
- `GET /api/notes` → List all notes for current tenant
- `GET /api/notes/:id` → Retrieve a single note
- `PUT /api/notes/:id` → Update a note
- `DELETE /api/notes/:id` → Delete a note

**Backend rules**:
- JWT validation for all protected routes.
- Tenant isolation enforced.
- Role-based restrictions enforced where applicable.

### 🖥️ Frontend
- Minimal frontend using **Next.js + ShadCN UI**.
- Supports login with predefined accounts.
- List, create, edit, and delete notes.
- Displays "Upgrade to Pro" when Free tenants reach their limit.
- Uses **React Hot Toast** for notifications.
- Handles form state with `useState` and `useEffect`.

### 🛠️ Tech Stack & Libraries
**Frontend**
- Next.js
- React
- Tailwind CSS
- Axios
- ShadCN UI
- React Hot Toast

**Backend**
- Next.js API routes
- MongoDB + Mongoose
- Bcrypt for password hashing
- JWT for authentication
- CORS support for automated scripts and dashboards
- Cookie-based authentication (HttpOnly cookies)

---

## 💾 Database Models

### 🏢 Tenant
| Field  | Type    | Description |
|--------|---------|-------------|
| name   | String  | Tenant company name |
| slug   | String  | URL-friendly identifier (e.g., `acme`) |
| plan   | String  | Subscription plan (`free` or `pro`) |
| createdAt | Date | Timestamp |
| updatedAt | Date | Timestamp |

### 👤 User
| Field       | Type                  | Description |
|-------------|----------------------|-------------|
| email       | String               | User email |
| password    | String               | Hashed password |
| role        | String               | `admin` or `member` |
| tenantId    | ObjectId             | Reference to Tenant |
| createdAt   | Date                 | Timestamp |
| updatedAt   | Date                 | Timestamp |

### 📝 Note
| Field       | Type                  | Description |
|-------------|----------------------|-------------|
| title       | String               | Note title |
| content     | String               | Note content |
| tenantId    | ObjectId             | Reference to Tenant |
| owner   | ObjectId             | Reference to User who created note |
| createdAt   | Date                 | Timestamp |
| updatedAt   | Date                 | Timestamp |

---

## 🔐 Authentication & Security
- Passwords are **hashed with bcrypt**.
- JWT stored in **HttpOnly cookies**.
- Middleware enforces authentication and role-based authorization.
- CORS headers configured to allow automated scripts and dashboards to access the API.

---

## 🚀 Deployment
- **Frontend and Backend** hosted on **Vercel**.
- Health endpoint: `GET /api/health` → `{ "status": "ok" }`
- Cookie-based JWT authentication works across frontend and API routes.
- CORS enabled for external scripts.

---

## ⚡ Running the Project Locally
1. Clone the repository
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Setup .env by copying .env.sample contents
4. Run development server:
   ```bash
   npm run dev
   ```

---

## 📝 Usage Notes
- Login: Use one of the predefined test accounts.
- Notes CRUD: Members and admins can manage notes for their tenant.
- Upgrade: Only admins can upgrade the tenant’s subscription.
- Tenant Isolation: Users cannot access notes from other tenants.

---