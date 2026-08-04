import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query, getConnection } from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    cb(null, allowed.includes(file.mimetype));
  },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Note: data is persisted in MySQL. Use helpers below to interact with DB.

const areaCommandsFallback = [
  { id: 'ac-1', name: 'Abeokuta South', status: 'active' },
  { id: 'ac-2', name: 'Abeokuta North', status: 'active' },
  { id: 'ac-3', name: 'Odeda', status: 'active' },
];

const generateRegistrationId = async () => {
  try {
    const res = await query('SELECT COUNT(*) as cnt FROM members');
    const count = String((res[0]?.cnt || 0) + 1).padStart(6, '0');
    const year = new Date().getFullYear();
    return `MOW-OG-${year}-${count}`;
  } catch (error) {
    const year = new Date().getFullYear();
    return `MOW-OG-${year}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`;
  }
};

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const canManage = (req, res, next) => {
  if (!req.user || !['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows && rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status } });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const rows = await query('SELECT id, name, email, role, status, createdAt FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    const user = rows && rows[0];
    res.json({ user });
  } catch (error) {
    console.error('Me error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out' });
});

app.get('/api/commands', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, status FROM area_commands');
    if (!rows || rows.length === 0) return res.json(areaCommandsFallback);
    res.json(rows);
  } catch (error) {
    console.error('Commands error', error);
    res.json(areaCommandsFallback);
  }
});

app.post('/api/members', upload.single('passportPhoto'), async (req, res) => {
  const payload = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const registrationId = await generateRegistrationId();
    const id = uuidv4();
    const now = new Date();
    const columns = [
      'id',
      'registrationId',
      'passportPhotoPath',
      'surname',
      'firstName',
      'middleName',
      'gender',
      'dateOfBirth',
      'maritalStatus',
      'nationality',
      'stateOfOrigin',
      'lgaOfOrigin',
      'placeOfBirth',
      'bloodGroup',
      'genotype',
      'phone',
      'whatsapp',
      'email',
      'residentialAddress',
      'stateOfResidence',
      'lgaOfResidence',
      'emergencyContactName',
      'emergencyContactPhone',
      'emergencyContactRelationship',
      'membershipNumber',
      'dateJoined',
      'yearJoined',
      'areaCommandId',
      'unit',
      'currentRank',
      'previousRank',
      'currentAppointment',
      'previousAppointment',
      'training',
      'qualification',
      'membershipStatus',
      'previousCommand',
      'dateTransferred',
      'education',
      'institution',
      'course',
      'occupation',
      'employer',
      'officeAddress',
      'skills',
      'certifications',
      'religion',
      'nextOfKin',
      'nextOfKinPhone',
      'nextOfKinAddress',
      'additionalInformation',
      'createdAt',
      'updatedAt',
    ];
    const insertSql = `INSERT INTO members (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(',')})`;
    const values = [
      id,
      registrationId,
      filePath,
      payload.surname || null,
      payload.firstName || null,
      payload.middleName || null,
      payload.gender || null,
      payload.dateOfBirth || null,
      payload.maritalStatus || null,
      payload.nationality || null,
      payload.stateOfOrigin || null,
      payload.lgaOfOrigin || null,
      payload.placeOfBirth || null,
      payload.bloodGroup || null,
      payload.genotype || null,
      payload.phone || null,
      payload.whatsapp || null,
      payload.email || null,
      payload.residentialAddress || null,
      payload.stateOfResidence || null,
      payload.lgaOfResidence || null,
      payload.emergencyContactName || null,
      payload.emergencyContactPhone || null,
      payload.emergencyContactRelationship || null,
      payload.membershipNumber || null,
      payload.dateJoined || null,
      payload.yearJoined || null,
      payload.areaCommandId || null,
      payload.unit || null,
      payload.currentRank || null,
      payload.previousRank || null,
      payload.currentAppointment || null,
      payload.previousAppointment || null,
      payload.training || null,
      payload.qualification || null,
      payload.membershipStatus || 'Pending',
      payload.previousCommand || null,
      payload.dateTransferred || null,
      payload.education || null,
      payload.institution || null,
      payload.course || null,
      payload.occupation || null,
      payload.employer || null,
      payload.officeAddress || null,
      payload.skills || null,
      payload.certifications || null,
      payload.religion || null,
      payload.nextOfKin || null,
      payload.nextOfKinPhone || null,
      payload.nextOfKinAddress || null,
      payload.additionalInformation || null,
      now,
      now,
    ];
    await query(insertSql, values);
    await query('INSERT INTO audit_logs (id, userId, action, entityType, entityId, details) VALUES (?,?,?,?,?,?)', [uuidv4(), null, 'Member registered', 'member', id, JSON.stringify({ registrationId })]);
    const [created] = await query('SELECT * FROM members WHERE id = ? LIMIT 1', [id]);
    res.status(201).json(created);
  } catch (error) {
    console.error('Create member error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/members', authMiddleware, canManage, async (req, res) => {
  const { status, search } = req.query;
  try {
    let sql = 'SELECT * FROM members WHERE 1=1';
    const params = [];
    if (status) {
      sql += ' AND registrationStatus = ?';
      params.push(status);
    }
    if (search) {
      sql += ' AND (registrationId LIKE ? OR firstName LIKE ? OR surname LIKE ? OR phone LIKE ? OR email LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }
    sql += ' ORDER BY createdAt DESC LIMIT 100';
    const rows = await query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('List members error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/members/:id', authMiddleware, canManage, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM members WHERE id = ? LIMIT 1', [req.params.id]);
    const member = rows && rows[0];
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    console.error('Get member error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/members/:id', authMiddleware, canManage, async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const params = [];
    Object.keys(fields).forEach((k) => {
      sets.push(`${k} = ?`);
      params.push(fields[k]);
    });
    params.push(new Date());
    const sql = `UPDATE members SET ${sets.join(', ')}, updatedAt = ? WHERE id = ?`;
    params.push(req.params.id);
    await query(sql, params);
    await query('INSERT INTO audit_logs (id, userId, action, entityType, entityId, details) VALUES (?,?,?,?,?,?)', [uuidv4(), req.user.id, 'Updated member', 'member', req.params.id, JSON.stringify(fields)]);
    const rows = await query('SELECT * FROM members WHERE id = ? LIMIT 1', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Update member error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/members/:id/status', authMiddleware, canManage, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    await query('UPDATE members SET registrationStatus = ?, rejectionReason = ?, updatedAt = ? WHERE id = ?', [status, rejectionReason || '', new Date(), req.params.id]);
    await query('INSERT INTO audit_logs (id, userId, action, entityType, entityId, details) VALUES (?,?,?,?,?,?)', [uuidv4(), req.user.id, 'Updated status', 'member', req.params.id, JSON.stringify({ status, rejectionReason })]);
    const rows = await query('SELECT * FROM members WHERE id = ? LIMIT 1', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Patch status error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/members/:id', authMiddleware, canManage, async (req, res) => {
  try {
    await query('DELETE FROM members WHERE id = ?', [req.params.id]);
    await query('INSERT INTO audit_logs (id, userId, action, entityType, entityId, details) VALUES (?,?,?,?,?,?)', [uuidv4(), req.user.id, 'Deleted member', 'member', req.params.id, JSON.stringify({})]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete member error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/audit-logs', authMiddleware, canManage, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM audit_logs ORDER BY createdAt DESC LIMIT 200');
    res.json(rows);
  } catch (error) {
    console.error('Audit logs error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/stats', authMiddleware, canManage, async (req, res) => {
  try {
    const rows = await query(`SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN registrationStatus = 'Approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN registrationStatus = 'Pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN registrationStatus = 'Rejected' THEN 1 ELSE 0 END) as rejected,
      SUM(CASE WHEN membershipStatus = 'Active' THEN 1 ELSE 0 END) as active
      FROM members`);
    res.json(rows[0] || { total: 0, approved: 0, pending: 0, rejected: 0, active: 0 });
  } catch (error) {
    console.error('Stats error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users', authMiddleware, canManage, async (req, res) => {
  try {
    const rows = await query('SELECT id, name, email, role, status, createdAt FROM users ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error('Users error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/export', authMiddleware, canManage, async (req, res) => {
  try {
    const rows = await query('SELECT registrationId, surname, firstName, phone, email, registrationStatus, membershipStatus, createdAt FROM members ORDER BY createdAt DESC');
    const headers = ['Registration ID', 'Surname', 'First Name', 'Phone', 'Email', 'Registration Status', 'Membership Status', 'Created At'];
    const csv = [headers.join(',')].concat(
      rows.map((row) => [
        row.registrationId,
        row.surname || '',
        row.firstName || '',
        row.phone || '',
        row.email || '',
        row.registrationStatus || '',
        row.membershipStatus || '',
        row.createdAt ? new Date(row.createdAt).toISOString() : '',
      ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="members-export.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/settings', authMiddleware, canManage, async (req, res) => {
  try {
    res.json({
      mode: 'production',
      currentYear: new Date().getFullYear(),
      allowRegistration: true,
      exportEnabled: true,
    });
  } catch (error) {
    console.error('Settings error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const ensureSchema = async () => {
  try {
    await query('ALTER TABLE members ADD COLUMN rejectionReason TEXT');
    console.log('Applied schema update: added members.rejectionReason column');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME' || error.errno === 1060) {
      return;
    }
    console.error('Schema migration error', error);
  }
};

// Serve frontend production build if available (placed after API routes so /api/* is handled)
const clientDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const initServer = async () => {
  await ensureSchema();
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
};

initServer();
