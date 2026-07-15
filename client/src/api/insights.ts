import { API_URL } from '../config'

export async function getMonthlyInsights(month?: number, year?: number) {
  const token = localStorage.getItem('token');

  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());

  const query = params.toString() ? `?${params.toString()}` : '';

  const response = await fetch(`${API_URL}/insights/monthly${query}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to fetch insights');

  return response.json();
}