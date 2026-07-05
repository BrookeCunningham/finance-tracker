// imports plaid library
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const prisma = require('../prismaClient');
// env variables under process.env
require('dotenv').config();

// create an API object 
// configuration object - how to connect
// 
const plaidClient = new PlaidApi(new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        // authentication headers
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
}));

// function to create a link token for the user
async function bankToken(req, res) {

    // grab userid
    const userId = req.user.userId;

    // create a link token for the user using plaid api object
    const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: String(userId) },
        client_name: 'Finance Tracker',
        products: ['transactions'],
        country_codes: ['GB'],
        language: 'en',
    });

    // return the link token to the client
    res.status(200).json({ link_token: response.data.link_token });
}

// converts temp token into access token and stores it in the database
async function connectBank(req, res) {
    // grab userid from middleware 
    const userId = req.user.userId;
    // extract public token from request body
    const { public_token } = req.body;

    if (!public_token) {
        return res.status(400).json({ error: 'Missing public token' });
    }

    // exchange public token
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = response.data.access_token;

    // save to database for user
    await prisma.user.update({
        where: { userId },
        data: { plaidAccessToken: accessToken },
    });

    // return success message
    res.status(200).json({ message: 'Bank connected successfully' });
}

// function to get bank details for the user from api
async function bankDetails(req, res) {
    // grab userid from middleware
    const userId = req.user.userId;

    // find user in database from userid
    const user = await prisma.user.findUnique({
        where: { userId },
    });

    // if user does not exist or does not have a plaid access token, return error
    if (!user || !user.plaidAccessToken) {
        return res.status(400).json({ error: 'No bank account connected' });
    }

    // get transactions from plaid api using access token and date range
    const response = await plaidClient.transactionsGet({
        access_token: user.plaidAccessToken,
        start_date: '2025-01-01',
        end_date: new Date().toISOString().split('T')[0],
    });

    // return transactions to client
    res.status(200).json({ transactions: response.data.transactions });
}

// export the functiosn to route level
module.exports = { bankToken, connectBank, bankDetails };