
# Frontend

The frontend is built with **React, TypeScript and Vite**.

## Project Structure

```text
client/
└── src/
    ├── api/
    ├── components/
    ├── context/
    ├── pages/
    ├── App.tsx
    ├── main.tsx
    ├── config.ts
    ├── theme.ts
    ├── App.css
    └── index.css
```

## Tech Stack

- **React** → Builds the UI.
- **TypeScript** → Adds types and error checking.
- **Vite** → Runs and builds the frontend.
- **MUI** → Provides ready-made UI components.
- **Emotion** → Handles styling.
- **MUI Icons** → Provides icons.
- **React Router** → Handles page navigation.
- **Axios / Fetch** → Sends requests to the backend.
- **Recharts** → Creates charts and graphs.
- **react-plaid-link** → Connects the app to Plaid.
- **Oxlint** → Checks code for problems.

## `pages/`

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

**Page = a complete screen.**

Example:

```text
/login        → Login
/register     → Register
/dashboard    → Dashboard
/transactions → Transactions
/budgets      → Budget
/settings     → Settings
```

## `components/`

Contains reusable pieces of UI.

Examples:

```text
components/
├── Sidebar.tsx
├── ProtectedRoute.tsx
└── InsightsPanel.tsx
```

**Component = a reusable part of a page.**

For example:

```text
Dashboard
├── Sidebar
├── Balance Card
├── Spending Chart
└── Transaction List
```

## `context/`

Contains shared React state that multiple components need.

Your `AuthContext` manages authentication:

```text
AuthContext
├── token
├── login()
└── logout()
```

Components access it using:

```tsx
const { token, login, logout } = useAuth();
```

The component must be inside the `AuthProvider`.

## `api/`

Contains functions that communicate with the backend.

```text
Page
 ↓
API function
 ↓
HTTP request
 ↓
Backend
```

Common operations:

- **GET** → Retrieve data
- **POST** → Create data
- **PUT** → Update data
- **DELETE** → Delete data

Protected requests include the JWT token:

```text
Authorization: Bearer <token>
```

## `App.tsx`

The main React component that sets up the application's routes.

It connects URLs to pages and protects pages that require authentication.

```text
App
 ↓
React Router
 ├── /login → Login
 ├── /register → Register
 ├── /dashboard → Dashboard
 ├── /transactions → Transactions
 ├── /budgets → Budget
 └── /settings → Settings
```

Protected pages use `ProtectedRoute` to check authentication.

## `main.tsx`

The entry point of the React application.

It starts React and renders `App` in the browser.

```text
main.tsx
   ↓
App
   ↓
Application
```

## `config.ts`

Stores shared configuration, such as the backend API URL.

This avoids hardcoding the backend URL throughout the application.

## `theme.ts`

Defines the global MUI theme:

- Colours
- Background
- Text colours
- Font

```text
theme.ts
   ↓
MUI Theme
   ├── Colours
   ├── Background
   └── Typography
```

## CSS Files

### `App.css`

Contains styling specific to the application.

### `index.css`

Contains global CSS used across the frontend.

# Common React Patterns

```text
useState()
→ Store and change component data

useEffect()
→ Run code when a component loads or changes

.map()
→ Turn an array of data into UI

.filter()
→ Select specific data

.reduce()
→ Calculate a value from data

condition ? A : B
→ Show different UI based on a condition

<Component prop={value} />
→ Pass data to a component
```

# Typical Data Flow

```text
User opens page
      ↓
React component loads
      ↓
useEffect()
      ↓
API function
      ↓
Backend request
      ↓
Data returned
      ↓
useState()
      ↓
.map() / .filter() / .reduce()
      ↓
UI displayed
```

# Overall Frontend Structure

```text
src/
│
├── pages/       → Full screens
├── components/  → Reusable UI
├── context/     → Shared state/auth
├── api/         → Backend requests
│
├── App.tsx      → Routes/app structure
├── main.tsx     → Starts React
├── config.ts    → Configuration
├── theme.ts     → MUI theme
├── App.css      → App styling
└── index.css    → Global styling
```

## In Short

**Pages** are the screens.

**Components** are reusable UI.

**Context** manages shared state such as authentication.

**API** files communicate with the backend.

**`App.tsx`** manages the application's routes.

**`main.tsx`** starts the React application.
````
