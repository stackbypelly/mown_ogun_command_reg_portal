import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const databaseName = process.env.MONGODB_DB || 'mow_ogun_portal';
const client = new MongoClient(uri);

export let db;

const areaCommands = [
  'Abeokuta South', 'Abeokuta North', 'Odeda', 'Ado-Odo', 'Ewekoro', 'Ifo',
  'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu-Ode', 'Ikenne',
  'Imeko-Afon', 'Ipokia', 'Obafemi/Owode', 'Odogbolu', 'Ogun Waterside',
  'Remo North', 'Sagamu', 'Yewa North', 'Yewa South',
];

export const connectDatabase = async () => {
  await client.connect();
  db = client.db(databaseName);

  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('members').createIndex({ registrationId: 1 }, { unique: true }),
    db.collection('members').createIndex({ createdAt: -1 }),
    db.collection('audit_logs').createIndex({ createdAt: -1 }),
  ]);

  await db.collection('users').updateOne(
    { email: 'admin@mowogun.gov.ng' },
    {
      $setOnInsert: {
        id: 'admin-1',
        name: 'Super Admin',
        email: 'admin@mowogun.gov.ng',
        password: '$2a$10$VBSxSv5h/042BVwm8Wfo2uMVi80TOxmKqyGlDw1bj.jVYE0q8RmiG',
        role: 'SUPER_ADMIN',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  const commands = db.collection('area_commands');
  for (const name of areaCommands) {
    await commands.updateOne(
      { id: name },
      { $setOnInsert: { id: name, name, status: 'active', createdAt: new Date(), updatedAt: new Date() } },
      { upsert: true }
    );
  }

  console.log(`Connected to MongoDB database: ${databaseName}`);
};

export const collection = (name) => {
  if (!db) throw new Error('MongoDB has not been initialized');
  return db.collection(name);
};

export const closeDatabase = () => client.close();
