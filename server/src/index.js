import 'dotenv/config';
import './config/envDefaults.js';
import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const PORT = Number(process.env.PORT) || 5000;

await connectDatabase();

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

async function shutdown(signal) {
  console.log(`\n${signal} received, shutting down...`);
  await new Promise((resolve) => server.close(resolve));
  await disconnectDatabase();
  process.exit(0);
}

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => shutdown(sig));
}
