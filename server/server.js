// dependencies
require('dotenv').config();
const express = require('express');
// create express app
const app = express();
const cors = require('cors');

// define routes
const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const budgetRoutes = require('./routes/budgetRoutes')
const plaidRoutes = require('./routes/plaidRoutes')
const userRoutes = require('./routes/userRoutes')
const insightsRoutes = require('./routes/insightsRoutes')

// add specific origin 
app.use(cors());
app.use(express.json());

// register routes
app.use('/auth', authRoutes)
app.use('/transaction', transactionRoutes)
app.use('/budget', budgetRoutes)
app.use('/plaid', plaidRoutes)
app.use('/user', userRoutes)
app.use('/insights', insightsRoutes)

// starts server/express app
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
})