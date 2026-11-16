const JSON_HEADERS = { 'Content-Type': 'application/json' };
async function handleResponse(res) {
  if (res.status === 204) {
    return null;
  }

  let data = {};
  try {
    data = await res.json();
  } catch (err) {
  }

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

//categories
export async function getCategories() {
  const res = await fetch('/api/categories');
  return handleResponse(res);
}

export async function createCategory(name) {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ name }),
  });
  return handleResponse(res);
}

//expenses
export async function getExpenses(from, to) {
  let url = '/api/expenses';
  if (from && to) {
    url = `/api/expenses?from=${from}&to=${to}`;
  }
  const res = await fetch(url);
  return handleResponse(res);
}

export async function getExpense(id) {
  const res = await fetch(`/api/expenses/${id}`);
  return handleResponse(res);
}

export async function createExpense(data) {
  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateExpense(id, data) {
  const res = await fetch(`/api/expenses/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteExpense(id) {
  const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
