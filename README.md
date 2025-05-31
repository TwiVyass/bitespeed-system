# Bitespeed Identity Reconciliation API
This project implements the identity reconciliation backend for Bitespeed’s challenge. It receives user identities via email or phone number and returns a unified contact based on existing records, applying rules for merging and linking contacts.

# Features
- Identify users based on email, phoneNumber, or both

- Create new primary or secondary contacts as needed

- Reconcile and link existing contact records

- Powered by Node.js, Express, TypeScript, and Prisma

# Tech Stack
Node.js

Express

TypeScript

Prisma ORM


# Installation
Clone the repo:

git clone https://github.com/your-username/bitespeed-identity-reconciliation.git

cd bitespeed-identity-reconciliation

Install dependencies:
bash
Copy
Edit
npm install

Set up Prisma and DB:
npx prisma generate
npx prisma migrate dev --name init

# Running the Server
Use ts-node-dev for live reload while developing:
npx ts-node-dev src/index.ts

Server runs on:
http://localhost:3000

# API Usage
POST /identify
{
  "email": "twsha@example.com",
  "phoneNumber": "1234567890"
}

Response:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["twsha@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": []
  }
}


Scripts
npx prisma studio — View and manage your database in a web UI
npx prisma migrate dev — Apply schema changes
