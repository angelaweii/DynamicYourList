# Deployment Guide

## Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `DynamicMyList` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: (Leave blank for now - you'll add your Render URL after backend deployment)
6. Click "Deploy"

## Backend (Render)

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect your `DynamicMyList` repository
4. Configure:
   - **Name**: `dynamicmylist-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
5. Click "Create Web Service"
6. Wait for deployment (first build takes ~5 minutes)
7. Copy your backend URL (e.g., `https://dynamicmylist-backend.onrender.com`)

## Update Frontend with Backend URL

1. Go back to your Vercel project
2. Go to Settings → Environment Variables
3. Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
4. Redeploy from the Deployments tab

## Update CORS in Backend

The backend needs to allow requests from your Vercel domain. This is already configured to accept all origins in development, but you may want to restrict it in production.

## Your Live URLs

- Frontend: `https://your-project.vercel.app`
- Backend: `https://dynamicmylist-backend.onrender.com`
- API Docs: `https://dynamicmylist-backend.onrender.com/docs`

## Notes

- ⏰ Free tier backend on Render spins down after 15 minutes of inactivity
- 🔄 First request after sleep takes ~30 seconds to wake up
- 🌍 Both services auto-deploy when you push to GitHub main branch
- 🔒 Consider upgrading to private repo after deployment if needed

