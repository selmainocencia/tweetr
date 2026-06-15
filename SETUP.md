# Tweetr — Complete Setup Guide

## What's included

A fully functional Twitter clone with:
- Next.js 14 App Router (all milestones M1–M5)
- Gold `#e6a80b` / Black / White Tailwind design, Inter font
- NextAuth.js authentication (login, register, sessions)
- MongoDB + Mongoose (with demo fallback mode — works without DB)
- TweetCard, CommentSection, Favorites, Profile, Header, Footer
- Context API for Favorites & Comments
- Middleware protecting `/profile`
- Docker Compose for local MongoDB
- Ready to deploy to Vercel

---

## Step 1 — Open in VS Code

1. Copy the `twitter-clone` folder to your preferred location (e.g. `~/Projects/`)
2. Open VS Code
3. File → Open Folder → select `twitter-clone`
4. Open the integrated terminal: `` Ctrl+` `` (or `Cmd+``)
5. Install dependencies:
   ```bash
   npm install
   ```

6. Copy the env file:
   ```bash
   cp .env.local.example .env.local
   ```

7. Run the dev server:
   ```bash
   npm run dev
   ```

8. Open http://localhost:3000 — the app works immediately in **demo mode** (no DB needed).

   Demo accounts: `john / password123` · `jane / password123` · `demo / demo`

---

## Step 2 — Connect MongoDB with Compass

### Start the local database with Docker

Make sure Docker Desktop is running, then:

```bash
npm run docker:dev
```

This starts:
- MongoDB on `localhost:27017`
- Mongo Express web UI at `http://localhost:8081`

### Open MongoDB Compass

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass) if you haven't.
2. Open Compass.
3. In the connection string field, paste:
   ```
   mongodb://admin:password123@localhost:27017/?authSource=admin
   ```
4. Click **Connect**.
5. You'll see your `twitter-clone` database appear after first use.

### Seed demo data

```bash
curl http://localhost:3000/api/demo-data
```

Or open http://localhost:3000/api/demo-data in your browser. This adds 3 demo users and 3 tweets to MongoDB.

---

## Step 3 — Push to GitHub

1. Go to https://github.com → click **New repository**
2. Name it `twitter-clone`, set to Public, click **Create**
3. In your terminal (inside the project folder):
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Twitter Clone"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/twitter-clone.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 4 — Deploy to Vercel

### Option A — Via Vercel website (easiest)

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New… → Project**
3. Import your `twitter-clone` repository
4. Vercel auto-detects Next.js — no build settings to change
5. Before deploying, add **Environment Variables**:

   | Name | Value |
   |------|-------|
   | `NEXTAUTH_SECRET` | any random string (e.g. `my-super-secret-2024`) |
   | `NEXTAUTH_URL` | your Vercel URL (e.g. `https://twitter-clone-abc.vercel.app`) |
   | `MONGODB_URI` | your MongoDB Atlas connection string (see below) |

6. Click **Deploy**

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Follow the prompts, then add env vars in the Vercel dashboard.

### MongoDB in Production — Use MongoDB Atlas (free)

Vercel can't connect to your local Docker MongoDB. Use Atlas instead:

1. Go to https://cloud.mongodb.com → create a free account
2. Create a free cluster (M0 Sandbox)
3. Database Access → Add a DB user (username + password)
4. Network Access → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
5. Clusters → Connect → Connect your application → copy the connection string
   - Replace `<password>` with your DB user password
   - Replace `myFirstDatabase` with `twitter-clone`
6. Paste as `MONGODB_URI` in your Vercel environment variables
7. Redeploy from the Vercel dashboard

---

## VS Code Extensions (Recommended)

Install these for the best experience:

- **ES7+ React/Redux/React-Native snippets** — fast component creation
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **Prettier** — code formatting
- **MongoDB for VS Code** — browse your DB from VS Code
- **Thunder Client** — test your API routes without Postman

---

## File Structure

```
twitter-clone/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js   ← NextAuth
│   │   ├── tweets/route.js               ← GET/POST/DELETE tweets
│   │   ├── tweets/[id]/route.js          ← GET/PATCH single tweet
│   │   ├── comments/route.js             ← GET/POST/DELETE comments
│   │   ├── register/route.js             ← User registration
│   │   └── demo-data/route.js            ← Seed DB
│   ├── tweet/[id]/page.jsx               ← Single tweet page
│   ├── login/page.jsx
│   ├── register/page.jsx
│   ├── favorites/page.jsx
│   ├── profile/page.jsx
│   ├── layout.jsx                        ← Root layout
│   ├── page.jsx                          ← Home feed
│   └── globals.css
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Providers.jsx
│   ├── TweetCard.jsx
│   ├── AddTweetForm.jsx
│   └── CommentSection.jsx
├── context/
│   ├── FavoritesContext.jsx
│   └── CommentsContext.jsx
├── lib/
│   └── db.js                             ← MongoDB connection
├── models/
│   ├── Tweet.js
│   ├── User.js
│   └── Comment.js
├── middleware.js                          ← Route protection
├── tailwind.config.js
├── docker-compose.yml
└── .env.local                            ← Your secrets (not in git)
```

---

## How demo mode works

If `MONGODB_URI` is not set or MongoDB is unreachable, the app falls back to in-memory mock data automatically. All features work — tweets, login, favorites, comments — without a database. This is great for quick demos and bootcamp presentations.
