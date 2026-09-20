Backend Notes
Node.js

Runs JavaScript outside the browser.

Lets us build backend servers.

Express

Framework for Node.js.

Makes it easier to build servers and APIs.

node server.js


→ Starts the server.

CORS

CORS tells the browser which cross-origin requests are allowed to access the response.

server.js

Main file that sets up the backend.

app.use('/auth', authRoutes)
app.use('/user', userRoutes)


Means:

/auth → authRoutes
/user → userRoutes


app.use() registers middleware or routes with Express.

Routes

Routes decide which controller runs.

They:

Import controller functions

Create a router

Define the route

Connect the route to the controller

Export the router

Example:

router.post('/login', login);

POST /login → login controller

Controllers

Controllers contain the actual logic.

They:

Get data from the request

Talk to the database

Check passwords

Create tokens

Send a response

Get data
const { email, password } = req.body;

Find user
const user = await prisma.user.findUnique({
    where: { email }
});

Check password
await bcrypt.compare(password, user.password);

Create JWT
const token = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

Send response
res.status(200).json({
    message: "Login successful",
    token
});

Middleware

Middleware runs before the controller.

JWT authentication:

Request
   ↓
Get token
   ↓
Verify token
   ↓
Valid?
   ↓
req.user = decoded
   ↓
next()
   ↓
Controller


JWT library verifies the token

Gets token from the header

Removes Bearer

Verifies token

decoded = information inside the token

Saves it as req.user

next() continues the request

Database
PostgreSQL

The actual database that stores the data.

In this project:

PostgreSQL → hosted on Render

Prisma

Tool that lets Node.js communicate with PostgreSQL.

Node.js
   ↓
Prisma
   ↓
PostgreSQL

Prisma Client

Used to query the database:

prisma.user.findUnique(...)


Usually one Prisma Client instance is created and reused.

schema.prisma

Defines the database models/structure.

Example:

model User {
    userId    Int    @id @default(autoincrement())
    email     String @unique
    firstName String
    surname   String
    password  String
}


Think:

schema.prisma
      ↓
What the database should look like

Migrations

A migration is a record/instructions for changing the database.

schema.prisma
      ↓
change model
      ↓
migration
      ↓
database updated


Migrations are stored in:

prisma/migrations

Setup
1. Install dependencies
npm install

2. Create .env

Contains things like:

DATABASE_URL="..."
JWT_SECRET="..."
PORT=3000

3. Run Prisma migration
npx prisma migrate dev

4. Generate Prisma Client
npx prisma generate

5. Start server
npm run dev


or:

npm start

Overall
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


server.js → sets everything up
middleware → checks/processes requests
routes → decide where requests go
controllers → do the work
Prisma → talks to database
PostgreSQL → stores data
