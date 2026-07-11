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

// ---- HELPERS ----

// converts Plaid's category array (e.g. ["Food and Drink", "Restaurants"])
// into one of your app's categories
function mapPlaidCategory(plaidCategories) {
  if (!plaidCategories || plaidCategories.length === 0) return 'Other';
  const top = plaidCategories[0].toLowerCase();
  if (top.includes('food')) return 'Food';
  if (top.includes('travel') || top.includes('transport')) return 'Transport';
  if (top.includes('shop')) return 'Shopping';
  if (top.includes('recreation') || top.includes('restaurant')) return 'Eating Out';
  if (top.includes('service') || top.includes('subscription')) return 'Subscriptions';
  if (top.includes('transfer') || top.includes('deposit')) return 'Income';
  return 'Other';
}

// shared sync function — called by connectBank AND syncTransactions
async function syncPlaidTransactions(userId, accessToken) {
  let cursor = null;
  let added = [];
  let hasMore = true;

  while (hasMore) {
    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
      cursor: cursor ?? undefined,
    });

    added = added.concat(response.data.added);
    hasMore = response.data.has_more;
    cursor = response.data.next_cursor;
  }

  for (const tx of added) {
    await prisma.transaction.upsert({
      where: { plaidId: tx.transaction_id },
      update: {},
      create: {
        userId,
        plaidId: tx.transaction_id,
        description: tx.name,
        amount: -tx.amount,
        category: mapPlaidCategory(tx.category),
        createdAt: new Date(tx.date),
        source: 'plaid',
      },
    });
  }
}
// ---- ROUTE HANDLERS ----

// creates a link token so the frontend can open Plaid Link
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

// exchanges public_token for access_token, stores it, and pulls initial transactions
async function connectBank(req, res) {

    console.log('req.body:', req.body);
  console.log('public_token:', req.body?.public_token);
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

  // NEW: pull transactions into DB straight away
  await syncPlaidTransactions(userId, accessToken);

  res.status(200).json({ message: 'Bank connected and transactions synced' });
}

// manually re-sync transactions (for a "Sync" button on the frontend)
async function syncTransactions(req, res) {
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user || !user.plaidAccessToken) {
    return res.status(400).json({ error: 'No bank account connected' });
  }

  await syncPlaidTransactions(userId, user.plaidAccessToken);
  res.status(200).json({ message: 'Transactions synced' });
}

module.exports = { bankToken, connectBank, syncTransactions };