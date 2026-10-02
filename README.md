# Women for Change Platform

A complete college community platform for Student, Alumni, Mentor, Teacher, and Admin roles with LinkedIn-style profiles, task management, achievements, announcements, and private messaging.

## Features
- Role-based login and dashboards
- LinkedIn-like community profile discovery
- Admin panel for adding users and sending credentials
- Task assignment and submission flows
- Achievement tracking
- Community announcements and notices
- Teacher activity updates and class posts
- One-to-one messaging between users
- Demo data based on your WFC student and staff records

## Stack
- Node.js
- Express
- SQLite
- EJS templates
- bcryptjs

## Run locally

1. Install dependencies:
   npm install

2. Copy environment file:
   cp .env.example .env

3. Start app:
   npm start

4. Open in browser:
   http://localhost:3000

## Default demo logins

Admin:
- Email: admin@wfc.com
- Password: Admin@123

Teacher:
- Email: teacher@wfc.com
- Password: Teacher@123

Student demo:
- Email: prachiprajapati0512@gmail.com
- Password: WFC@123

Mentor demo:
- Email: minette@womenforchange.org.au
- Password: WFC@123

## Notes
- The app is demo-ready and stores data in SQLite locally.
- Auto-emailing is implemented as a logged service that can be connected to real SMTP later.
- Password generation and account setup can be managed from the admin panel.
