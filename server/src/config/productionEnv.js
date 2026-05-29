const REQUIRED_PRODUCTION_ENV = [
  {
    key: 'MONGODB_URI',
    aliases: ['MONGO_URI', 'MONGO_URL', 'DATABASE_URL'],
    description: 'MongoDB Atlas or another production MongoDB connection string',
  },
  {
    key: 'JWT_SECRET',
    description: 'long random secret used to sign authentication tokens',
  },
  {
    key: 'CLIENT_ORIGIN',
    description: 'deployed frontend URL, for example https://todolist-web.onrender.com',
  },
];

export function normalizeProductionEnv() {
  for (const { key, aliases = [] } of REQUIRED_PRODUCTION_ENV) {
    if (process.env[key]?.trim()) {
      continue;
    }

    const alias = aliases.find((name) => process.env[name]?.trim());
    if (alias) {
      process.env[key] = process.env[alias].trim();
    }
  }
}

export function validateProductionEnv() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  normalizeProductionEnv();

  const missing = REQUIRED_PRODUCTION_ENV.filter(
    ({ key }) => !process.env[key]?.trim()
  );

  if (missing.length === 0) {
    return;
  }

  console.error('\nProduction environment is not configured correctly.');
  console.error('Set these variables in Render > Environment, then redeploy:\n');

  for (const { key, aliases = [], description } of missing) {
    const aliasText = aliases.length ? ` (aliases accepted: ${aliases.join(', ')})` : '';
    console.error(`- ${key}${aliasText}: ${description}`);
  }

  console.error(
    '\nFor Render manual deploys, add MONGODB_URI, JWT_SECRET, and CLIENT_ORIGIN on the API service.'
  );

  process.exit(1);
}
