# SkillCheck Deployment Guide

## 1. Google Apps Script Backend (The Database)

This application uses Google Sheets as a database via a Google Apps Script Web App.

### Setup Instructions:
1.  Go to [Google Apps Script](https://script.google.com/home).
2.  Click **"New Project"**.
3.  Name it "SkillCheck Backend".
4.  Copy the code from `backend/Code.gs` in this project and paste it into the script editor (replace everything there).
5.  **Important:** Run the `setup()` function manually once.
    *   Select `setup` from the dropdown in the toolbar.
    *   Click "Run".
    *   Accept the permissions (Advanced -> Go to ... (unsafe)).
    *   This will create the required tabs in your Google Sheet (`Students`, `MCQ`, `Typing`, `Results`).
6.  **Deploy as Web App**:
    *   Click "Deploy" -> "New deployment".
    *   Select type: "Web app".
    *   Description: "v1".
    *   Execute as: **"Me" (your email)**.
    *   Who has access: **"Anyone"**. (Crucial: "Anyone" means anyone with the link can access, which allows the React app to talk to it without complex OAuth).
    *   Click "Deploy".
7.  **Copy the Web App URL** (starts with `https://script.googleusercontent.com/...` or `https://script.google.com/...`).

## 2. Frontend Connection

1.  Create a file named `.env` in the root of the `Exam-Software` folder.
2.  Add the following line:
    ```
    VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
    ```
    (Replace with your actual copied URL).

## 3. Running Locally

1.  Open terminal in project folder.
2.  Run `npm run dev`.
3.  Open the local URL (e.g., `http://localhost:5173`).

## 4. Admin Access

*   URL: `/admin`
*   Key: `admin123`
*   Use this dashboard to add students to the `Students` sheet.

## 5. Deployment to GitHub Pages

1.  Update `vite.config.js` with `base: '/repo-name/'` if deploying to a project page.
2.  Run `npm run build`.
3.  Deploy the `dist` folder.
