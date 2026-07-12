# Fintrak

A full-stack personal finance tracker. Log transactions, set category budgets, and see monthly spending broken down by category. Auth is JWT-based and there's a Plaid integration for pulling in example bank transactions (PLAID Sandbox).

## Stack

**Backend**
- Node.js + Express
- PostgreSQL, hosted on ElephantSQL
- Prisma 
- JWT for auth, bcrypt for password hashing
- Plaid Node SDK

**Frontend**
- React + TypeScript + Vite
- MUI v6
- Recharts for graphs
- React Router

**Dev**
- Thunder Client (VS Code) for hitting endpoints during development

## Project structure

```
finance-tracker/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/          # prisma schema + client
│   └── server.js
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        └── theme/
```

## Backend

### Database

Prisma manages the schema and migrations. Three models:

- **User** — `userId`, `name`, `email`, `password` (hashed), `createdAt`
- **Transaction** — `userId`, `plaidId` (nullable), `transactionId`, `value`, `payee`, `category`, `description`, `createdAt`
- **Budget** — `userId`, `budgetId`, `category`, `budgetValue`, `createdAt`

CRUD is handled through Prisma inside each controller.

### Endpoints

**Auth**
- `POST /auth/register` — register a new user
- `POST /auth/signIn` — sign in, returns a JWT
- `POST /auth/logout` — logout

**User**
- `GET /user/view` — get the current user's profile
- `PUT /user/edit` — update profile
- `DELETE /user/delete` — delete account

**Transactions**
- `GET /transaction/view` — list transactions
- `POST /transaction/add` — add a transaction
- `PUT /transaction/edit` — edit a transaction
- `DELETE /transaction/delete` — delete a transaction

**Budgets**
- `GET /budget/view` — list budgets
- `POST /budget/add` — create a budget
- `PUT /budget/edit` — edit a budget
- `DELETE /budget/delete` — delete a budget

**Plaid**
- `POST /plaid/createLinkToken` — create a Plaid link token
- `POST /plaid/exchangeToken` — exchange a public token for an access token
- `POST /plaid/transactions` — pull transactions from the connected bank

Everything except `/auth` sits behind the `authenticateToken` middleware.

### Architecture

Standard MVC:

```
backend/
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── transactionController.js
│   ├── budgetController.js
│   └── plaidController.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── transactionRoutes.js
│   ├── budgetRoutes.js
│   └── plaidRoutes.js
├── models/            # prisma
└── server.js
```

The view layer is the React frontend.

**Request flow**

```
Request comes in
      ↓
Route  (decides which controller handles it)
      ↓
Controller  (business logic)
      ↓
Prisma / model  (database query)
      ↓
Controller sends response back
```

Each endpoint gets tested in Thunder Client as it's built before moving on.

## Frontend

- `main.tsx` — Vite entry. Wraps the app in `AuthProvider`, the MUI `ThemeProvider`, and `BrowserRouter`.
- `App.tsx` — top-level `<Routes>`. Protected pages are wrapped in `<ProtectedRoute>`.

**pages/**
- `Login.tsx` — login form. Posts to `/auth/signIn`, stores the returned JWT in `localStorage`, redirects to the dashboard.
- `Register.tsx` — same idea for new users.
- `Dashboard.tsx` — overview: recent transactions, budget summary, and the Monthly Insights panel.
- `Transactions.tsx` — full transaction list with add/edit/delete.
- `Budgets.tsx` — budget list and creation form.
- `Settings.tsx` — profile and account settings.

**components/**
- `ProtectedRoute.tsx` — checks for a token in `localStorage`. If it's missing, kicks the user to `/login`.
- `MonthlyInsights.tsx` — the insights panel. Fetches monthly aggregates and renders MUI summary cards on top of a Recharts bar chart.

**api/**
Thin wrappers around `fetch`. No axios. Each helper grabs the JWT from `localStorage` and sets the `Authorization` header.
- `auth.ts` — sign in, register
- `transactions.ts` — get / add / edit / delete
- `budgets.ts` — get / add / edit / delete
- `plaid.ts` — create link token, exchange public token
- `user.ts` — profile updates

**context/**
- `AuthContext.tsx` — holds the token and user state, exposes `login`, `logout`, and `isAuthenticated`.

**theme/**
- Custom MUI theme — colours, typography, a few component overrides.

## Example request

Adding a transaction:

```http
POST /transaction/add
Host: localhost:5000
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "value": 12.50,
  "payee": "Tesco",
  "category": "Groceries",
  "description": "Weekly shop"
}
```

Response:

```json
{
  "transactionId": "clx7f2h3k0001abcd",
  "userId": "clx7f0abc0000xyzt",
  "plaidId": null,
  "value": 12.50,
  "payee": "Tesco",
  "category": "Groceries",
  "description": "Weekly shop",
  "createdAt": "2026-01-14T18:20:31.000Z"
}
```

If the token's missing or expired, `authenticateToken` will 401 before the controller runs.

## Running locally

Node 18+ and a PostgreSQL connection string.

**Backend**
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

`.env` needs:
- `DATABASE_URL`
- `JWT_SECRET`
- `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

`.env` needs `VITE_API_URL` pointing at the backend (e.g. `http://localhost:5000`).
