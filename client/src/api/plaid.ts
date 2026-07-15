import { API_URL } from "../config";
const BASE = `${API_URL}/plaid`;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const check401 = (res: Response) => {
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return res;
};

export async function getLinkToken() {
  const res = await fetch(`${BASE}/createLinkToken`, {
    method: 'POST',
    headers: authHeaders(),
  });
  check401(res);
  if (!res.ok) throw new Error('Failed to fetch link token');
  return res.json();
}

export async function exchangeToken(public_token: string, metadata?: any) {
  const res = await fetch(`${BASE}/exchangeToken`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ public_token, metadata }),
  });
  check401(res);
  if (!res.ok) throw new Error('Failed to exchange public token');
  return res.json();
}

export async function getPlaidTransactions() {
  const res = await fetch(`${BASE}/transactions`, {
    method: 'GET',
    headers: authHeaders(),
  });
  check401(res);
  if (!res.ok) throw new Error('Failed to fetch Plaid transactions');
  return res.json();
}
export async function syncPlaidTransactions() {
  const res = await fetch(`${BASE}/transactions`, {
    method: 'POST',
    headers: authHeaders(),
  });
  check401(res);
  if (!res.ok) throw new Error('Failed to sync transactions');
  return res.json();
}