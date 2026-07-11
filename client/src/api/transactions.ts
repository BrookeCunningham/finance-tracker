export async function getTransactions() {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/transaction/view', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to fetch transactions');
  

  return response.json();
}

// transaction object
export async function addTransaction(transaction: any) {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/transaction/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(transaction)
  });
  
  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to add transaction');

  return response.json();
}

export async function editTransaction(id: string, transaction: any) {
  const token = localStorage.getItem('token');

  const response = await fetch(`http://localhost:3000/transaction/edit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(transaction)
  });

  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to edit transaction');

  return response.json();
}

export async function deleteTransaction(id: string) {
  const token = localStorage.getItem('token');

  const response = await fetch(`http://localhost:3000/transaction/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to delete transaction');

  return response.json();
}
