# MongoDB Setup Guide for MOW Ogun Portal

## Prerequisites
- Node.js dependencies installed with `npm install`
- A MongoDB server, either local MongoDB or MongoDB Atlas

## Configure the connection

Set these values in `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=mow_ogun_portal
```

For MongoDB Atlas, set `MONGODB_URI` to the connection string provided by Atlas. Keep credentials out of source control.

## Start the backend

```bash
cd backend
npm install
npm start
```

At startup the backend connects to MongoDB, creates required indexes, and inserts the default admin and area commands if they do not already exist.

## Default Admin

- Email: `admin@mowogun.gov.ng`
- Password: `Admin@123`

Change this password after the first login.

## Collections

- `users` - Admin and user accounts
- `area_commands` - Man O' War area commands
- `members` - Member registration records
- `audit_logs` - System activity logs
