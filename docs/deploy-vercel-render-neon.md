# Deploy With Vercel, Render, and Neon

This is the recommended no-cost deployment path for this project:

- Frontend: `Vercel`
- Backend + WebSockets: `Render` free web service
- Database: `Neon` free Postgres

## 1. Create Neon Postgres

1. Create a free Neon project.
2. Copy the pooled connection string.
3. Save it for Render as `DATABASE_URL`.

Notes:

- Neon free is a better fit than Render free Postgres because Neon does not have the 30-day expiration limit.
- Use the standard Postgres connection string Neon gives you.

## 2. Deploy Backend to Render

This repo includes:

- `Dockerfile.api`
- `render.yaml`

### Option A: Blueprint

1. Push the repo to GitHub.
2. In Render, create a new Blueprint using this repo.
3. Render should detect `render.yaml`.
4. Set these env vars in Render:
   - `DATABASE_URL` = your Neon connection string
   - `CORS_ORIGIN` = your future Vercel site URL, for example `https://your-app.vercel.app`
5. Deploy.

### Option B: Manual Web Service

If you do not want to use Blueprint:

1. Create a new `Web Service` in Render from the repo.
2. Choose:
   - Runtime: `Docker`
   - Plan: `Free`
3. Set env vars:
   - `DATABASE_URL`
   - `CORS_ORIGIN`
   - `HOST=0.0.0.0`
   - `PORT=3333`
4. Deploy.

### Verify Backend

After deploy, confirm:

- `GET https://<render-service>.onrender.com/healthz`
- `GET https://<render-service>.onrender.com/readyz`

The WebSocket base URL will be:

- `wss://<render-service>.onrender.com`

## 3. Deploy Frontend to Vercel

This repo includes `vercel.json` for SPA routing.

1. Import the GitHub repo into Vercel.
2. Vercel should detect Vite automatically.
3. Set environment variables for the frontend project:
   - `VITE_API_BASE_URL=https://<render-service>.onrender.com`
   - `VITE_WS_BASE_URL=wss://<render-service>.onrender.com`
4. Deploy.

## 4. Update Render CORS Origin

Once Vercel gives you the final production URL:

1. Go back to Render.
2. Set `CORS_ORIGIN` to the exact Vercel URL.
3. Redeploy the backend if needed.

If you later attach a custom frontend domain, update `CORS_ORIGIN` again.

## 5. Smoke Test

Verify all of this in production:

- app loads
- dashboard creation works
- autosave works
- refresh keeps dashboard state
- `/dashboards/:dashboardId` routes load correctly
- presence connects
- multi-tab WebSocket behavior works

## 6. Optional Demo Seed

After backend deploy:

```bash
API_BASE_URL="https://<render-service>.onrender.com" npm run seed:demo
```

That prints a shareable demo dashboard URL.

## Known Free-Tier Caveats

- Render free services spin down after inactivity.
- Cold starts can make the first request slow.
- WebSocket connections can drop on deploys or restarts.
- This setup is fine for a portfolio demo, but not ideal for production-critical realtime behavior.
