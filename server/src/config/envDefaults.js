/**
 * Development-only defaults so `npm run dev` works without editing `.env`.
 * In production, set real secrets and MONGODB_URI explicitly.
 */
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  if (!process.env.JWT_SECRET?.trim()) {
    process.env.JWT_SECRET =
      'taskflow-dev-only-jwt-secret-minimum-32-characters-long';
    console.warn('[dev] JWT_SECRET not set — using a built-in development secret.');
  }
}
