    import { MongoClient } from 'mongodb';
    import dotenv from 'dotenv';

    dotenv.config();

    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    const databaseName = process.env.MONGODB_DB || 'mow_ogun_portal';
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
      socketTimeoutMS: 2000,
    });

    export let db;

    const areaCommands = [
      'Abeokuta South', 'Abeokuta North', 'Odeda', 'Ado-Odo', 'Ewekoro', 'Ifo',
      'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu-Ode', 'Ikenne',
      'Imeko-Afon', 'Ipokia', 'Obafemi/Owode', 'Odogbolu', 'Ogun Waterside',
      'Remo North', 'Sagamu', 'Yewa North', 'Yewa South',
    ];

    const matchFilter = (doc, filter = {}) => {
      if (!filter || Object.keys(filter).length === 0) return true;

      for (const [key, expected] of Object.entries(filter)) {
        if (key === '$or') {
          if (!Array.isArray(expected) || !expected.some((subFilter) => matchFilter(doc, subFilter))) {
            return false;
          }
          continue;
        }

        if (key === '$and') {
          if (!Array.isArray(expected) || !expected.every((subFilter) => matchFilter(doc, subFilter))) {
            return false;
          }
          continue;
        }

        if (key === '$nor') {
          if (Array.isArray(expected) && expected.some((subFilter) => matchFilter(doc, subFilter))) {
            return false;
          }
          continue;
        }

        const actual = doc[key];

        if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
          if ('$regex' in expected) {
            const regex = new RegExp(expected.$regex, expected.$options || 'i');
            if (!regex.test(String(actual ?? ''))) return false;
            continue;
          }

          if ('$in' in expected) {
            if (!expected.$in.includes(actual)) return false;
            continue;
          }

          if ('$exists' in expected) {
            const exists = actual !== undefined;
            if (exists !== expected.$exists) return false;
            continue;
          }
        }

        if (Array.isArray(expected)) {
          if (!expected.includes(actual)) return false;
          continue;
        }

        if (actual !== expected) return false;
      }

      return true;
    };

    class MemoryCursor {
      constructor(docs, filter = {}, projection = {}, sortSpec = null, limitValue = null) {
        this.docs = docs;
        this.filter = filter;
        this.projection = projection;
        this.sortSpec = sortSpec;
        this.limitValue = limitValue;
      }

      project(spec = {}) {
        this.projection = spec;
        return this;
      }

      sort(spec = {}) {
        this.sortSpec = spec;
        return this;
      }

      limit(value) {
        this.limitValue = value;
        return this;
      }

      toArray() {
        let items = this.docs.filter((doc) => matchFilter(doc, this.filter));

        if (this.sortSpec && Object.keys(this.sortSpec).length) {
          items = [...items].sort((a, b) => {
            for (const [key, direction] of Object.entries(this.sortSpec)) {
              const dir = direction === -1 ? -1 : 1;
              const left = a[key] instanceof Date ? a[key].getTime() : a[key];
              const right = b[key] instanceof Date ? b[key].getTime() : b[key];
              if (left === right) continue;
              return left > right ? dir : -dir;
            }
            return 0;
          });
        }

        if (this.limitValue !== null && this.limitValue !== undefined) {
          items = items.slice(0, Number(this.limitValue));
        }

        if (!this.projection || Object.keys(this.projection).length === 0) {
          return items;
        }

        return items.map((doc) => {
          const projected = {};
          for (const [key, value] of Object.entries(this.projection)) {
            if (value === 1 && Object.prototype.hasOwnProperty.call(doc, key)) {
              projected[key] = doc[key];
            }
          }
          return projected;
        });
      }
    }

    class MemoryCollection {
      constructor() {
        this.documents = [];
      }

      async createIndex() {
        return null;
      }

      async insertOne(doc) {
        this.documents.push({ ...doc });
        return { insertedId: doc.id || doc._id || null };
      }

      async updateOne(filter, update = {}, options = {}) {
        const existing = this.documents.find((doc) => matchFilter(doc, filter));

        if (!existing && options.upsert) {
          const newDoc = {};
          const directFilter = Object.fromEntries(
            Object.entries(filter).filter(([key]) => !key.startsWith('$'))
          );

          Object.assign(newDoc, directFilter);

          if (update.$set) Object.assign(newDoc, update.$set);
          if (update.$setOnInsert) Object.assign(newDoc, update.$setOnInsert);

          this.documents.push(newDoc);
          return { matchedCount: 0, modifiedCount: 0, upsertedCount: 1 };
        }

        if (!existing) {
          return { matchedCount: 0, modifiedCount: 0, upsertedCount: 0 };
        }

        const index = this.documents.indexOf(existing);

        if (update.$set) {
          Object.assign(existing, update.$set);
        }

        if (update.$setOnInsert) {
          Object.keys(update.$setOnInsert).forEach((key) => {
            if (!(key in existing)) {
              existing[key] = update.$setOnInsert[key];
            }
          });
        }

        if (update.$unset) {
          Object.keys(update.$unset).forEach((key) => {
            delete existing[key];
          });
        }

        this.documents[index] = existing;
        return { matchedCount: 1, modifiedCount: 1, upsertedCount: 0 };
      }

      async deleteOne(filter) {
        const index = this.documents.findIndex((doc) => matchFilter(doc, filter));
        if (index === -1) {
          return { deletedCount: 0 };
        }
        this.documents.splice(index, 1);
        return { deletedCount: 1 };
      }

      async countDocuments(filter = {}) {
        return this.documents.filter((doc) => matchFilter(doc, filter)).length;
      }

      find(filter = {}) {
        return new MemoryCursor(this.documents, filter);
      }

      findOne(filter = {}, options = {}) {
        const result = this.find(filter).toArray();
        if (result.length === 0) return null;
        const doc = result[0];
        if (!options.projection || Object.keys(options.projection).length === 0) {
          return doc;
        }
        const projected = {};
        Object.entries(options.projection).forEach(([key, value]) => {
          if (value === 1 && Object.prototype.hasOwnProperty.call(doc, key)) {
            projected[key] = doc[key];
          }
        });
        return projected;
      }
    }

    const memoryCollections = new Map();

    const createMemoryDatabase = () => ({
      collection: (name) => {
        if (!memoryCollections.has(name)) {
          memoryCollections.set(name, new MemoryCollection());
        }
        return memoryCollections.get(name);
      },
    });

    export const connectDatabase = async () => {
      try {
        await client.connect();
        db = client.db(databaseName);
        console.log(`Connected to MongoDB database: ${databaseName}`);
      } catch (error) {
        console.warn('MongoDB connection unavailable, starting in-memory fallback database.');
        const memoryDb = createMemoryDatabase();
        db = memoryDb;
      }

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

      console.log(`Database ready: ${databaseName}`);
    };

    export const collection = (name) => {
      if (!db) throw new Error('Database has not been initialized');
      return db.collection(name);
    };

    export const closeDatabase = async () => {
      if (client?.topology?.isConnected?.()) {
        await client.close();
      }
    }; 
