# Deployment Guide

This repo contains two main parts:

* **`next_app/`** → Next.js (TypeScript) frontend using Prisma
* **`backend/`** → Node backend with Socket server + Redis

This guide covers:

* Local development setup
* Frontend deployment to Vercel
* Backend deployment to Render
* Redis setup basics

Not exhaustive — just enough to get started quickly.

---

# 1. Local Development Setup

## 1.1 Install

# frontend
cd next_app
npm install

# backend
cd ../backend
npm install
```

---

## 1.2 Environment Variables

Each folder has its own `.env.example`.

Create local env files:

```bash
cp next_app/.env.example next_app/.env.local
cp backend/.env.example backend/.env
```

Fill in the values according to your environment.

Important notes:

* Prisma DB connection string goes in `next_app/.env.local`
* Redis URL goes in `backend/.env`
* Any API URLs should point to localhost during dev

---

## 1.3 Database (Prisma)

Inside `next_app`:

```bash
npx prisma generate
npx prisma migrate dev
```

---

## 1.4 Run Locally

Run both services separately:

### Frontend

```bash
cd next_app
npm run dev
```

Usually runs on:

```
http://localhost:3000
```

### Backend

```bash
cd backend
npm run dev
```

Make sure Redis is running locally.

---

## 1.5 Local Redis

Quick Docker option:

```bash
docker run -p 6379:6379 redis
```

Or install Redis locally.

Set:

```
REDIS_URL=redis://localhost:6379
```

---

# 2. Frontend Deployment (Vercel)

## Steps

1. Import the **`next_app` folder** as a Vercel project.
2. Set framework to **Next.js** (auto-detected usually).
3. Add environment variables from:

```
next_app/.env.example
```

4. Deploy.

### Important Notes

* Ensure database is accessible publicly (hosted DB).
* Update API/backend URLs to production backend URL.

---

# 3. Backend Deployment (Render)

## 3.1 Create Web Service

1. Create new Web Service on Render.
2. Select repo.
3. Root directory:

```
backend
```

4. Build command:

```bash
npm install && npm run build
```

5. Start command:

```bash
npm start
```

(Adjust if your project differs.)

---

## 3.2 Environment Variables

Copy all values from:

```
backend/.env.example
```

into Render dashboard environment settings.

Important ones typically include:

* Redis connection URL
* Port configs (Render usually sets PORT automatically)
* Any secrets/API keys

---

# 4. Redis Setup on Render

Simplest option:

### Render Managed Redis

1. Create a Redis instance in Render.
2. Copy the internal Redis URL.
3. Add to backend env:

```
REDIS_URL=<render-redis-url>
```

This is recommended.

---


# 5. Connecting Frontend to Backend

After backend deploy:

1. Copy backend public URL.
2. Update frontend env variables on Vercel:

```
NEXT_PUBLIC_SOCKET_URL=
```

3. Redeploy frontend.

---


# 6. Minimal Deployment Checklist

## Local

* [ ] `.env` files created
* [ ] DB migrations run
* [ ] Redis accessible
* [ ] Both apps run locally

## Production

* [ ] Frontend deployed to Vercel
* [ ] Backend deployed to Render
* [ ] Redis configured
* [ ] Environment variables set
* [ ] Frontend pointing to production backend

---

That's it — this should get the project running locally and deployed with minimal setup.
