const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, '..', 'server');
const example = path.join(serverDir, '.env.example');
const target = path.join(serverDir, '.env');

if (!fs.existsSync(target) && fs.existsSync(example)) {
  fs.copyFileSync(example, target);
  console.log('[postinstall] Created server/.env from server/.env.example');
} else if (fs.existsSync(target) && fs.existsSync(example)) {
  // One-time migration: old template forced localhost Mongo; comment it so dev uses in-memory DB.
  let content = fs.readFileSync(target, 'utf8');
  if (/^MONGODB_URI=mongodb:\/\/127\.0\.0\.1:27017\/taskflow\r?\n/m.test(content)) {
    content = content.replace(
      /^MONGODB_URI=mongodb:\/\/127\.0\.0\.1:27017\/taskflow\r?\n/m,
      '# MONGODB_URI=mongodb://127.0.0.1:27017/taskflow\n'
    );
    fs.writeFileSync(target, content);
    console.log('[postinstall] Updated server/.env: localhost Mongo line commented → in-memory Mongo in dev.');
  }
}
