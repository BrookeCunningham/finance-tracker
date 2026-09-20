
# Backend Notes

## Node.js

- Runs JavaScript outside the browser.
- Lets us build backend servers.

## Express

Framework for Node.js.

Makes it easier to build servers and APIs.

``
node server.js ``


Starts the server.

## CORS

CORS tells the browser which cross-origin requests are allowed to access the response.

**server.js**

Main file that sets up the backend.

- Imports middleware and route files.
- Registers the routes.
- Starts the server.

```js
const userRoutes = require('./routes/userRoutes')
app.use('/user', userRoutes)
```

`` app.use() ``

Registers middleware or routes with Express.

## Routes

Routes decide which controller should handle a request.

They:

- Import controller functions.
- Create a router.
- Define routes.
- Connect routes to controller functions.
- Export the router to `server.js`.

### Example

```js
router.post('/login', login)
```

**POST `/login` → `login` controller**

## Controllers

Controllers contain the actual logic.

They:

- Get data from the request.
- Talk to the database.
- Check passwords.
- Create tokens.
- Send responses.

### Get data

```js
const { email, password } = req.body;
```

### Find user

```js
const user = await prisma.user.findUnique({
    where: { email }
});
```

### Check password

```js
await bcrypt.compare(password, user.password);
```

### Create JWT

```js
const token = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);
```

### Send response

```js
res.status(200).json({
    message: "Login successful",
    token
});
```

## Middleware

Middleware runs before the controller.

JWT middleware checks if the user has a valid token.

### JWT Process

1. Get token from request header.
2. Remove `"Bearer"`.
3. Verify the token.
4. `decoded` = information inside the token.
5. Save decoded information as `req.user`.
6. `next()` continues to the controller.

### Flow

```text
Request
   ↓
Middleware
   ↓
Verify JWT
   ↓
req.user = decoded
   ↓
next()
   ↓
Controller
```

# Database

## PostgreSQL

The actual database.

Stores the application's data.

PostgreSQL is hosted on Render.

## Prisma

Tool that lets Node.js communicate with PostgreSQL.

```text
Node.js
   ↓
Prisma
   ↓
PostgreSQL
```

### Prisma Client

Used to query the database.

Example:

```js
prisma.user.findUnique(...)
```

Usually one Prisma Client instance is created and reused.

**schema.prisma**

Defines the database models and structure.

**Example**

```prisma
model User {
    userId    Int    @id @default(autoincrement())
    email     String @unique
    firstName String
    surname   String
    password  String
}
```

Think:

```text
schema.prisma
      ↓
What the database should look like
```

## Prisma Migrations

A migration is a record/instructions for changing the database.

### Example

```text
Change schema
     ↓
Create migration
     ↓
Migration updates database
```

Migrations are stored in:

```text
prisma/migrations
```

# Setup

## 1. Install dependencies

```bash
npm install
```

## 2. Create `.env`

```env
DATABASE_URL="..."
JWT_SECRET="..."
PORT=3000
```

## 3. Run Prisma migration

```bash
npx prisma migrate dev
```

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Start server

```bash
npm run dev
```

or:

```bash
npm start
```

# Overall Flow

```text
server.js
    ↓
middleware
    ↓
routes
    ↓
controllers
    ↓
Prisma
    ↓
PostgreSQL
```

# Simple Summary

- **`server.js`** → sets everything up
- **Middleware** → checks/processes requests
- **Routes** → decide where requests go
- **Controllers** → do the actual work
- **Prisma** → talks to the database
- **PostgreSQL** → stores the data
- **Render** → hosts the PostgreSQL database
````
