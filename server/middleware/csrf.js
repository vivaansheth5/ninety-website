import crypto from 'node:crypto';

// Lightweight double-submit-cookie CSRF protection.
// - GET /api/csrf-token sets a readable cookie: `<random>.<hmac(random)>`
// - State-changing requests must echo that same token in the X-CSRF-Token header
// - The HMAC (signed with a server-only secret) stops an attacker from forging
//   a token from scratch; matching it against the cookie stops a cross-site
//   request (which can't read the cookie) from ever supplying the right header.
const SECRET = process.env.CSRF_SECRET;

if (!SECRET || SECRET.length < 16) {
  throw new Error('CSRF_SECRET must be set to a long random string (see .env.example)');
}

function sign(value) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

export function issueCsrfToken(req, res) {
  const random = crypto.randomBytes(24).toString('hex');
  const token = `${random}.${sign(random)}`;
  res.cookie('ninety_csrf', token, {
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 1000 * 60 * 60 * 2,
  });
  return token;
}

export function requireCsrf(req, res, next) {
  const cookieToken = req.cookies?.ninety_csrf;
  const headerToken = req.get('x-csrf-token');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }

  const [random, mac] = cookieToken.split('.');
  if (!random || !mac || sign(random) !== mac) {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }

  next();
}
