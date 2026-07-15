import { API_URL } from '../config'

export async function getBudgets() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/budget/view`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to fetch budgets');

  return response.json();
}

export async function addBudget(budget: any) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/budget/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(budget)
  });
  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }
  if (!response.ok) throw new Error('Failed to add budget');

  return response.json();
}

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

export async function deleteBudget(id: string) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/budget/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to delete budget');

  return response.json();
}