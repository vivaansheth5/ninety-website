let csrfToken = null;

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function ensureCsrfToken() {
  const existing = readCookie('ninety_csrf');
  if (existing) {
    csrfToken = existing;
    return csrfToken;
  }
  const res = await fetch('/api/csrf-token', { credentials: 'same-origin' });
  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

async function apiFetch(path, { method = 'GET', body, needsCsrf = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (needsCsrf) {
    const token = await ensureCsrfToken();
    headers['X-CSRF-Token'] = token;
  }

  const res = await fetch(path, {
    method,
    headers,
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export function fetchProducts() {
  return apiFetch('/api/products');
}

export function createOrder(items) {
  return apiFetch('/api/orders', { method: 'POST', body: { items }, needsCsrf: true });
}

export function verifyPayment(payload) {
  return apiFetch('/api/payment/verify', { method: 'POST', body: payload, needsCsrf: true });
}
