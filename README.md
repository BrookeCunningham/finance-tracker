
# Project Structure

This project is a full-stack web application with a **React frontend** and **Node.js/Express backend**.

```text
project/
├── client/                 # Frontend
└── server/                 # Backend
```

# Frontend

The frontend is built with **React, TypeScript and Vite**.

## Frontend Frameworks & Tools

- **React** — Builds the user interface.
- **TypeScript** — Adds static typing.
- **Vite** — Development server and build tool.
- **React Router** — Handles page navigation.
- **Material UI (MUI)** — Provides UI components and styling.
- **Emotion** — Handles MUI/React styling.
- **Axios / Fetch** — Sends requests to the backend API.
- **Recharts** — Creates charts and graphs.
- **react-plaid-link** — Integrates Plaid.
- **Oxlint** — Checks the code for problems.

## Frontend Structure

```text
client/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   ├── config.ts
│   ├── theme.ts
│   ├── App.css
│   └── index.css
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### `api/`

Contains functions that send HTTP requests to the backend.

### `components/`

Contains reusable UI components.

Examples:

```text
components/
├── Sidebar.tsx
├── ProtectedRoute.tsx
└── InsightsPanel.tsx
```

### `context/`

Contains shared React state.

`AuthContext` manages authentication information such as the user's JWT token and login/logout functions.

### `pages/`

Contains the main screens of the application.

```text
pages/
├── Login.tsx
├── Register.tsx
├── Dashboard.tsx
├── Transaction.tsx
├── Budget.tsx
└── Settings.tsx
```

### `App.tsx`

Main application component. Sets up the application's routes and page navigation.

### `main.tsx`

Entry point of the React application. Starts React and renders `App`.

### `config.ts`

Stores shared configuration such as the backend API URL.

### `theme.ts`

Defines the global MUI theme, including colours and fonts.

### `App.css`

Application-specific CSS.

### `index.css`

Global CSS.

---

# Backend

The backend is built with **Node.js, Express, Prisma and PostgreSQL**.

## Backend Frameworks & Tools

- **Node.js** — Runs JavaScript on the server.
- **Express** — Creates the backend server and API.
- **Prisma** — Communicates with the database.
- **PostgreSQL** — Stores application data.
- **JWT** — Handles authentication.
- **bcrypt** — Hashes and checks passwords.
- **CORS** — Controls cross-origin requests.

## Backend Structure

```text
server/
├── controllers/
├── routes/
├── middleware/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── server.js
├── package.json
└── .env
```

### `server.js`

Main backend entry point.

Responsible for:

- Creating the Express server.
- Registering middleware.
- Registering routes.
- Starting the server.

### `routes/`

Defines the API endpoints and connects them to controllers.

```text
routes/
   ↓
Which endpoint was requested?
   ↓
Which controller should handle it?
```

### `controllers/`

Contains the main backend logic.

Controllers can:

- Read request data.
- Validate information.
- Check passwords.
- Create JWTs.
- Query the database.
- Send responses.

### `middleware/`

Contains code that runs before controllers.

For example, JWT middleware checks whether a request has a valid authentication token.

```text
Request
   ↓
Middleware
   ↓
Check JWT
   ↓
Controller
```

### `prisma/`

Contains the database configuration and migrations.

#### `schema.prisma`

Defines the database models and structure.

#### `migrations/`

Contains records of database structure changes.

```text
Change schema
     ↓
Create migration
     ↓
Update database
```

### `.env`

Stores environment-specific configuration and secrets.

Examples include:

```text
DATABASE_URL
JWT_SECRET
PORT
```

---

# Database

The backend uses Prisma to communicate with PostgreSQL.

```text
Node.js
   ↓
Prisma
   ↓
PostgreSQL
```

- **Prisma** — Database access layer.
- **PostgreSQL** — Stores the actual data.
- **Prisma migrations** — Keep database changes organised.

---

# Full Application Structure

```text
                         APPLICATION
                              │
              ┌───────────────┴───────────────┐
              │                               │
          FRONTEND                         BACKEND
              │                               │
      React + TypeScript                  Node.js
              │                               │
            Vite                          Express
              │                               │
       Pages / Components                 Routes
              │                               │
           API calls                    Middleware
              │                               │
              └──────── HTTP ────────────────┘
                                              │
                                         Controllers
                                              │
                                           Prisma
                                              │
                                         PostgreSQL
```

# Setup

## Frontend

From the `client` directory:

```bash
npm install
npm run dev
```

Create any required frontend environment variables in `.env`.

## Backend

From the `server` directory:

```bash
npm install
```

Create a `.env` file containing the required configuration, for example:

```text
DATABASE_URL=...
JWT_SECRET=...
PORT=3000
```

Install/generate Prisma:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend using the project's configured npm start/development script.

## Development Flow

Both the frontend and backend need to be running during development.

```text
Frontend
   ↓
HTTP API Request
   ↓
Express Backend
   ↓
Controller
   ↓
Prisma
   ↓
PostgreSQL
   ↓
Response
   ↓
Frontend UI
```
````
