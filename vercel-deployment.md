# Vercel Deployment Guide

This project contains a **monorepo-like layout** with a separate `frontend` (React + Vite) and `backend` (Express + TypeScript). To host them successfully on Vercel, you should deploy them as **two separate projects** in the Vercel Dashboard. 

Here is the step-by-step guide to doing this:

---

## 1. Deploy the Backend Project

The backend acts as the AI Agentops proxy and hosts the database/Gemini logic.

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Select your GitHub repository `hackathon-automation-platform`.
3. In the configure screen:
   - **Project Name:** `hackathon-automation-backend` (or any name you prefer).
   - **Framework Preset:** Choose **Other** or **Express**.
   - **Root Directory:** Set this to **`backend`**.
4. Open the **Environment Variables** section and add all variables from your `backend/.env` file:
   - `GEMINI_API_KEY` (Your Gemini API Key)
   - `SUPABASE_URL` (Your Supabase URL)
   - `SUPABASE_KEY` (Your Supabase service role or anon key)
   - `DATABASE_URL` (Connection string)
   - `ENCRYPTION_SECRET` (A secure 32-character string)
   - `STAGE_1_WEBHOOK` (Stage 1 Intake webhook URL)
   - `STAGE_3_WEBHOOK` (Stage 3 Build webhook URL)
   - `STAGE_4_WEBHOOK` (Stage 4 Delivery webhook URL)
5. Click **Deploy**.
6. Once deployed, copy the **Deployment URL** (e.g., `https://hackathon-automation-backend.vercel.app`).

---

## 2. Deploy the Frontend Project

The frontend connects to the backend to generate the HTML script tags and render the dashboards.

1. Go back to the Vercel Dashboard, click **Add New** > **Project**.
2. Select the same GitHub repository `hackathon-automation-platform`.
3. In the configure screen:
   - **Project Name:** `hackathon-automation-frontend`.
   - **Framework Preset:** Choose **Vite**.
   - **Root Directory:** Set this to **`frontend`**.
4. Open the **Environment Variables** section and add the connection variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Paste your backend deployment URL copied from Step 1 (e.g., `https://hackathon-automation-backend.vercel.app`). Do *not* add a trailing slash.
5. Click **Deploy**.

---

## Technical Details

- **Dynamic Script Tags:** The backend automatically detects the domain it is running on. When an entrepreneur requests a script, it generates a tag pointing to `<BACKEND_URL>/embed.js`.
- **Stateless CORS:** The backend has CORS enabled, permitting the frontend Vite app to securely fetch the `/api/automations/generate-prompt` route.
