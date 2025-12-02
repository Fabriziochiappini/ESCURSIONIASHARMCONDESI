const ADMIN_AUTH_KEY = "admin_auth_token";
const AUTH_EXPIRY_DAYS = 7;

export function isAuthValid(): boolean {
  try {
    const stored = localStorage.getItem(ADMIN_AUTH_KEY);
    if (!stored) return false;
    const { expiry } = JSON.parse(stored);
    return new Date().getTime() < expiry;
  } catch {
    return false;
  }
}

export function setAuthToken() {
  const expiry = new Date().getTime() + (AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({ expiry }));
}

export function clearAuthToken() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
}
