export async function getMonthlyInsights(month?: number, year?: number) {
  const token = localStorage.getItem('token');

  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());

  const query = params.toString() ? `?${params.toString()}` : '';

  const response = await fetch(`http://localhost:3000/insights/monthly${query}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Failed to fetch insights');

  return response.json();
}