# Database Setup Guide for MOW Ogun Portal

## Prerequisites
- XAMPP installed with MySQL
- Node.js dependencies installed

## Step 1: Create the Database

### Option A: Using MySQL Command (Recommended)
Open your terminal and run:
```bash
cd backend
mysql -u root < config/schema.sql
```

If you have a password for MySQL root user:
```bash
mysql -u root -p < config/schema.sql
```

### Option B: Using phpMyAdmin
1. Open phpMyAdmin at `http://localhost/phpmyadmin`
2. Click on "SQL" tab
3. Copy and paste the contents of `config/schema.sql`
4. Click "Go"

### Option C: Using MySQL Workbench
1. Open MySQL Workbench
2. Create a new query window
3. Copy and paste the contents of `config/schema.sql`
4. Execute the query

## Step 2: Configure Database Connection

The `.env` file has been created with default XAMPP settings:
- Host: localhost
- Port: 3306
- User: root
- Password: (empty - change if you set a password)
- Database: mow_ogun_portal

If your MySQL setup is different, edit `.env` accordingly.

## Step 3: Test the Connection

Once the database is created, restart the backend server:
```bash
npm start
```

You should see "Backend running on port 5000" without any database connection errors.

## Default Credentials

After setup, you can log in with:
- Email: `admin@mowogun.gov.ng`
- Password: `Admin@123`

**Important**: Change this password after your first login!

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Ensure MySQL is running
- If you set a password for root, update it in `.env`

### Error: "Cannot find database 'mow_ogun_portal'"
- Run the schema creation commands again
- Check that all commands executed without errors

### Error: "table doesn't exist"
- The database tables weren't created properly
- Re-run the schema.sql file

## Database Structure

- **users** - Admin and user accounts
- **area_commands** - Man O' War area commands
- **members** - Member registration records
- **audit_logs** - System activity logs

For more details, see the schema.sql file.
