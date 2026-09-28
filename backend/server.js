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
import { collection, connectDatabase } from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const uploadDir = path.join(__dirname, 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    cb(null, allowed.includes(file.mimetype));
  },
});

app.use('/uploads', express.static(uploadDir));


const areaCommandsFallback = [
  { id: 'ac-1', name: 'Abeokuta South', status: 'active' },
  { id: 'ac-2', name: 'Abeokuta North', status: 'active' },
  { id: 'ac-3', name: 'Odeda', status: 'active' },
];

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
    const user = await collection('users').findOne({ email });
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
    const user = await collection('users').findOne(
      { id: req.user.id },
      { projection: { _id: 0, id: 1, name: 1, email: 1, role: 1, status: 1, createdAt: 1 } }
    );
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
    const rows = await collection('area_commands').find(
      {},
      { projection: { _id: 0, id: 1, name: 1, status: 1 } }
    ).toArray();
    if (rows.length === 0) return res.json(areaCommandsFallback);
    res.json(rows);
  } catch (error) {
    console.error('Commands error', error);
    res.json(areaCommandsFallback);
  }
});

app.post('/api/members', upload.single('passportPhoto'), async (req, res) => {
  const payload = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'Passport photograph is required.' });
  }
  const registrationId = payload.membershipNumber?.trim();
  if (!registrationId) {
    return res.status(400).json({ message: 'Membership / Service Number is required.' });
  }
  const filePath = req.file ? `/uploads/${req.file.filename}` : '';
  try {
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
      'registrationStatus',
      'createdAt',
      'updatedAt',
    ];
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
      registrationId,
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
      payload.registrationStatus || 'Pending',
      now,
      now,
    ];
    const member = Object.fromEntries(columns.map((column, index) => [column, values[index]]));
    await collection('members').insertOne(member);
    await collection('audit_logs').insertOne({
      id: uuidv4(), userId: null, action: 'Member registered', entityType: 'member', entityId: id,
      details: { registrationId }, createdAt: now,
    });
    const created = await collection('members').findOne({ id }, { projection: { _id: 0 } });
    res.status(201).json(created);
  } catch (error) {
    console.error('Create member error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/members', authMiddleware, canManage, async (req, res) => {
  const { status, search } = req.query;
  try {
    const filter = {};
    if (status) {
      filter.registrationStatus = status;
    }
    if (search) {
      const escapedSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matching = { $regex: escapedSearch, $options: 'i' };
      filter.$or = [
        { registrationId: matching }, { firstName: matching }, { surname: matching },
        { phone: matching }, { email: matching },
      ];
    }
    const rows = await collection('members').find(filter).project({ _id: 0 }).sort({ createdAt: -1 }).limit(100).toArray();
    res.json(rows);
  } catch (error) {
    console.error('List members error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/members/:id', authMiddleware, canManage, async (req, res) => {
  try {
    const member = await collection('members').findOne({ id: req.params.id }, { projection: { _id: 0 } });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    console.error('Get member error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/members/:id', authMiddleware, canManage, async (req, res) => {
  try {
    const fields = Object.fromEntries(Object.entries(req.body).filter(([key]) =>
      !['_id', 'id', 'createdAt', 'updatedAt'].includes(key) && !key.startsWith('$') && !key.includes('.')
    ));
    fields.updatedAt = new Date();
    await collection('members').updateOne({ id: req.params.id }, { $set: fields });
    await collection('audit_logs').insertOne({
      id: uuidv4(), userId: req.user.id, action: 'Updated member', entityType: 'member',
      entityId: req.params.id, details: fields, createdAt: new Date(),
    });
    res.json(await collection('members').findOne({ id: req.params.id }, { projection: { _id: 0 } }));
  } catch (error) {
    console.error('Update member error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/members/:id/status', authMiddleware, canManage, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    await collection('members').updateOne(
      { id: req.params.id },
      { $set: { registrationStatus: status, rejectionReason: rejectionReason || '', updatedAt: new Date() } }
    );
    await collection('audit_logs').insertOne({
      id: uuidv4(), userId: req.user.id, action: 'Updated status', entityType: 'member',
      entityId: req.params.id, details: { status, rejectionReason }, createdAt: new Date(),
    });
    res.json(await collection('members').findOne({ id: req.params.id }, { projection: { _id: 0 } }));
  } catch (error) {
    console.error('Patch status error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/members/:id', authMiddleware, canManage, async (req, res) => {
  try {
    await collection('members').deleteOne({ id: req.params.id });
    await collection('audit_logs').insertOne({
      id: uuidv4(), userId: req.user.id, action: 'Deleted member', entityType: 'member',
      entityId: req.params.id, details: {}, createdAt: new Date(),
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete member error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/audit-logs', authMiddleware, canManage, async (req, res) => {
  try {
    const rows = await collection('audit_logs').find({}).project({ _id: 0 }).sort({ createdAt: -1 }).limit(200).toArray();
    res.json(rows);
  } catch (error) {
    console.error('Audit logs error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/stats', authMiddleware, canManage, async (req, res) => {
  try {
    const members = collection('members');
    const [total, approved, pending, rejected, active] = await Promise.all([
      members.countDocuments(),
      members.countDocuments({ registrationStatus: 'Approved' }),
      members.countDocuments({ registrationStatus: 'Pending' }),
      members.countDocuments({ registrationStatus: 'Rejected' }),
      members.countDocuments({ membershipStatus: 'Active' }),
    ]);
    res.json({ total, approved, pending, rejected, active });
  } catch (error) {
    console.error('Stats error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users', authMiddleware, canManage, async (req, res) => {
  try {
    const rows = await collection('users').find(
      {},
      { projection: { _id: 0, id: 1, name: 1, email: 1, role: 1, status: 1, createdAt: 1 } }
    ).sort({ createdAt: -1 }).toArray();
    res.json(rows);
  } catch (error) {
    console.error('Users error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Only the Super Admin can create admin accounts.' });
  }

  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  try {
    const existing = await collection('users').findOne({ email }, { projection: { _id: 0, id: 1 } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);
    await collection('users').insertOne({
      id, name, email, password: hashedPassword, role: 'ADMIN', status: 'active',
      createdAt: new Date(), updatedAt: new Date(),
    });
    const created = await collection('users').findOne(
      { id },
      { projection: { _id: 0, id: 1, name: 1, email: 1, role: 1, status: 1, createdAt: 1 } }
    );
    res.status(201).json(created);
  } catch (error) {
    console.error('Create admin user error', error);
    res.status(500).json({ message: 'Unable to create admin account.' });
  }
});

app.get('/api/export', authMiddleware, canManage, async (req, res) => {
  try {
    const rows = await collection('members').find(
      {},
      { projection: { _id: 0, registrationId: 1, surname: 1, firstName: 1, phone: 1, email: 1, registrationStatus: 1, membershipStatus: 1, createdAt: 1 } }
    ).sort({ createdAt: -1 }).toArray();
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

// Serve frontend production build if available (placed after API routes so /api/* is handled)
const clientDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const initServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
};

initServer();
