// waiting for response from backend
export async function getBudgets() {

  // getting token from browser storage and attaching
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/budget/view', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to fetch budgets');

  return response.json();
}

// add a new budget
// (budget: any) = variable + type (ts)
export async function addBudget(budget: any) {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/budget/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // body = data but JSON.stringify before sending
    body: JSON.stringify(budget)
  });
  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }
  if (!response.ok) throw new Error('Failed to add budget');

  return response.json();
}

// budget id needs to be a string
export async function editBudget(id: string, budget: any) {
  const token = localStorage.getItem('token');
  // id needs to be sent as a param
  const response = await fetch(`http://localhost:3000/budget/edit/${id}`, {
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

  const response = await fetch(`http://localhost:3000/budget/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to delete budget');

  return response.json();
}