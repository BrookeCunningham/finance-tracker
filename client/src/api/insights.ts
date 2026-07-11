// function to return the insights when given the date
// returns prev month v current month
// optionally accepts = ?
export async function getMonthlyInsights(month?: number, year?: number) {
  const token = localStorage.getItem('token');

  // object to build url query para,s
  const params = new URLSearchParams();

  // if params given then append 
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());

  // construct query
  const query = params.toString() ? `?${params.toString()}` : '';

  const response = await fetch(`http://localhost:3000/insights/monthly${query}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!response.ok) throw new Error('Failed to fetch insights');

  return response.json();
}