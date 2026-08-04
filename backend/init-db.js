import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  // First, create connection without database to create it
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true,
  });

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'config', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 Executing SQL schema...\n');
    await connection.execute(schema);

    console.log('✅ Database initialized successfully!\n');
    console.log('📋 Default Admin Credentials:');
    console.log('   Email: admin@mowogun.gov.ng');
    console.log('   Password: Admin@123\n');
    console.log('⚠️  Please change this password after first login!\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Ensure MySQL is running (check XAMPP Control Panel)');
    console.error('2. If you have a password for MySQL root user, update .env');
    console.error('3. Check that the database name "mow_ogun_portal" is not already in use');
    process.exit(1);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
