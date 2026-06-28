const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const prisma = require('../prismaClient');
require('dotenv').config();

const plaidClient = new PlaidApi(new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
}));

async function bankToken(req, res) {
    const userId = req.user.userId;

    const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: String(userId) },
        client_name: 'Finance Tracker',
        products: ['transactions'],
        country_codes: ['GB'],
        language: 'en',
    });

    res.status(200).json({ link_token: response.data.link_token });
}

async function connectBank(req, res) {
    const userId = req.user.userId;
    const { public_token } = req.body;

    if (!public_token) {
        return res.status(400).json({ error: 'Missing public token' });
    }

    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = response.data.access_token;

    await prisma.user.update({
        where: { userId },
        data: { plaidAccessToken: accessToken },
    });

    res.status(200).json({ message: 'Bank connected successfully' });
}

async function bankDetails(req, res) {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
        where: { userId },
    });

    if (!user || !user.plaidAccessToken) {
        return res.status(400).json({ error: 'No bank account connected' });
    }

    const response = await plaidClient.transactionsGet({
        access_token: user.plaidAccessToken,
        start_date: '2025-01-01',
        end_date: new Date().toISOString().split('T')[0],
    });

    res.status(200).json({ transactions: response.data.transactions });
}

module.exports = { bankToken, connectBank, bankDetails };