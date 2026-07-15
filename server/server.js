// loads .env variables into process.env
require('dotenv').config();
// imports libraries
const express = require('express');
// create express app / server object
const app = express();
// cross origin resource sharing
const cors = require('cors');
// middleware
// maybe specify origin in future
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}))

// imports route files
// next step in the pipeline
const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const budgetRoutes = require('./routes/budgetRoutes')
const plaidRoutes = require('./routes/plaidRoutes')
const userRoutes = require('./routes/userRoutes')
const insightsRoutes = require('./routes/insightsRoutes')


// if client sends json make it a js object
app.use(express.json());
app.use((req,res,next)=>{
  console.log("REQUEST:", req.method, req.path);
  next();
});

// register routes and redirect
app.use('/auth', authRoutes)
app.use('/transaction', transactionRoutes)
app.use('/budget', budgetRoutes)
app.use('/plaid', plaidRoutes)
app.use('/user', userRoutes)
app.use('/insights', insightsRoutes)

// starts server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
})