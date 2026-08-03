# Man O' War Nigeria Ogun State Command Membership Portal

## Overview
This project delivers a responsive membership registration portal with a public landing and registration workflow plus a protected admin dashboard for managing member records.

## Architecture
- Frontend: React + Vite + Tailwind CSS + React Router
- Backend: Node.js + Express
- Storage: local file upload handling for passport photos and in-memory demo data for members and stats
- Authentication: JWT-based admin authentication with a demo admin account

## Demo Admin
- Email: admin@mowogun.gov.ng
- Password: Admin@123

## Run locally
- Frontend: npm run dev in the frontend folder
- Backend: npm start in the backend folder

## Main routes
- Public: /, /register
- Admin: /admin/login, /admin/dashboard, /admin/members, /admin/statistics
