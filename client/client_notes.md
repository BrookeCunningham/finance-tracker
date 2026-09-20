FRONTEND
serverside frameworks/ tools used
- Frontend Stack — Quick Explanation
React → Builds the frontend/UI.

TypeScript → Adds types and catches errors.

Vite → Runs and builds the React app.

MUI → Provides ready-made UI components.

Emotion → Handles styling for MUI/React.

MUI Icons → Provides icons.

React Router → Handles frontend page navigation.

Axios → Sends requests to the backend API.

Recharts → Creates charts and graphs.

react-plaid-link → Connects the app to Plaid/bank accounts.

Oxlint → Checks code for problems.

React DOM → Renders React into the browser.

@types/* → TypeScript definitions for React/Node libraries.

Overall
React + TypeScript
       ↓
     Vite
       ↓
MUI + Emotion → UI & Styling
       ↓
React Router → Pages
       ↓
Axios → Backend API
       ↓
Express Backend



/client/ random files
App.tsx → Main React component. Defines the main application UI and brings pages/components together.

main.tsx → Entry point of the React app. Starts React and renders <App /> into the browser.

App.css → CSS specifically for the App component/UI.

index.css → Global CSS. Styles that apply across the whole application.

theme.ts → Defines the application's MUI theme, such as colours, fonts, spacing, and component styling.

config.ts → Stores configuration values used throughout the app, such as the backend API URL, instead of hardcoding them in multiple files.

/api
typescript - CRUD ops to be sent to the server side via http requests ie
export async function editBudget(id: string, budget: any) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/budget/edit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(budget)
  });
  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to edit budget');

  return response.json();
}
send with token all the tim, thius formatting is ?


/componants = reusable blocks in it
all tsx = typescript and jsx - typescript and html like react code together
useState:
useEfffect: 

/context = Context is used to store information that multiple components need to access without passing it through every component manually.
AuthContext
│
├── token
├── login()
└── logout()

to access use hook 
import { useAuth } from './context/AuthContext';

function Dashboard() {
    const { token, logout } = useAuth();

    return (
        
    );
}
needs to be inside auth componant

/pages
src/
├── components/    → Reusable UI pieces
├── pages/         → Full pages/screens
├── context/       → Shared application data
├── App.tsx
└── main.tsx

omponent → Small reusable piece
             ↓
          Navbar
          Button
          Card

Page → Complete screen
        ↓
     Login
     Dashboard
     Profile

useState()
   ↓
Store/change data

useEffect()
   ↓
Run something when component loads/changes

.map()
   ↓
Turn data into UI

.filter()
   ↓
Select specific data

.reduce()
   ↓
Calculate a value from data

condition ? A : B
   ↓
Show different UI depending on condition

<Component prop={value} />
   ↓
Pass information to components

Overall flow
Dashboard loads
      ↓
useEffect()
      ↓
getTransactions()
      ↓
transactions state
      ↓
filter / reduce
      ↓
Calculate income, expenses, balance
      ↓
.map()
      ↓
Display cards + transactions

/              → Redirect to /login
/login         → Login
/register      → Register
/dashboard     → Dashboard
/transactions  → Transactions
/budgets       → Budget
/settings      → Settings
User visits /dashboard
        ↓
ProtectedRoute
        ↓
Check authentication/token
        ↓
     ┌──┴──┐
     ↓     ↓
   Valid  Invalid
     ↓     ↓
Dashboard  Login

theme.ts
   ↓
MUI Theme
   │
   ├── Colours
   │     ├── Primary blue
   │     ├── Background
   │     └── Text colours
   │
   └── Typography
         └── Inter font

Simple definition:

theme.ts defines the consistent colours, fonts, and general styling used throughout your MUI application.

npm install
set up .env folder
npm run dev

