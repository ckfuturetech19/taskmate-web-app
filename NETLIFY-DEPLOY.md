# Netlify Deployment Guide

This guide will help you deploy TaskMate web app to Netlify with environment variables configured.

## Prerequisites

- Netlify account ([Sign up here](https://app.netlify.com/signup))
- Your project connected to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Connect Your Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Choose your Git provider and authorize Netlify
4. Select your `taskmate-app` repository
5. Configure build settings:
   - **Build command:** `npm run build` (or `npm run build:dev` for development)
   - **Publish directory:** `dist`
6. Click **Deploy site**

## Step 2: Configure Environment Variables

After your site is created, you need to add environment variables:

1. In your site dashboard, go to **Site Settings** (gear icon in top menu)
2. Click **Environment variables** in the left sidebar
3. Click **Add a variable** button
4. Add each of these variables:

### Required Environment Variables

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | `AIzaSyBU1on-3Dn33IsUfdoHYi3kluC63FIA2bs` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `taskmate-e7cc9.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `taskmate-e7cc9` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `taskmate-e7cc9.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `425325230785` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:425325230785:web:5471398c240d7d8d46b240` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Analytics Measurement ID | `G-0921EG4E7W` |
| `VITE_FIREBASE_VAPID_KEY` | Firebase VAPID Key for Web Push | `BHrlSHy_rMLo1MTfY5AT7LITdy95mPQlyV7mMy85MKUNWQ_cr2eSxRUgJE1RCkSoKG1MPDKVLaWqQnoOn0OOk28` |

### Setting Variable Scopes

For each variable, you can choose the scope:
- **All scopes** - Available in all environments (recommended)
- **Production** - Only in production builds
- **Deploy previews** - Only in pull request previews
- **Branch deploys** - Only in branch deployments

**Recommendation:** Set all variables to **All scopes** for simplicity.

## Step 3: Rebuild Your Site

After adding all environment variables:

1. Go to the **Deploys** tab in your site dashboard
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete
4. Your site will be live with the new environment variables

## Step 4: Verify Deployment

1. Visit your Netlify site URL (e.g., `https://your-site-name.netlify.app`)
2. Open browser DevTools (F12)
3. Check the Console for any Firebase initialization errors
4. Test Firebase authentication and other features

## Troubleshooting

### Environment Variables Not Working?

1. **Check variable names:** Make sure they all start with `VITE_` prefix
2. **Rebuild required:** Environment variables only apply to new builds
3. **Check build logs:** Go to Deploys → Click on a deploy → View build log
4. **Verify values:** Make sure there are no extra spaces or quotes in the values

### Firebase Not Initializing?

1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Make sure your Firebase project allows your Netlify domain
4. Go to Firebase Console → Authentication → Settings → Authorized domains
5. Add your Netlify domain (e.g., `your-site.netlify.app`)

### Service Worker Not Working?

1. Clear browser cache
2. Unregister service worker in DevTools → Application → Service Workers
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Check that `firebase-config.js` is being served correctly

## Quick Reference: Environment Variables Checklist

- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_FIREBASE_MEASUREMENT_ID`
- [ ] `VITE_FIREBASE_VAPID_KEY`

## Additional Netlify Configuration

### Custom Domain

1. Go to **Site Settings** → **Domain management**
2. Click **Add custom domain**
3. Follow the DNS configuration instructions

### Continuous Deployment

Netlify automatically deploys when you push to your main branch. To configure:
1. Go to **Site Settings** → **Build & deploy**
2. Configure branch settings
3. Set up build hooks if needed

### Environment-Specific Variables

You can set different values for production vs. previews:
- Production: Use for live site
- Deploy previews: Use for testing with different Firebase project
- Branch deploys: Use for feature branches

## Support

If you encounter issues:
1. Check [Netlify Documentation](https://docs.netlify.com/)
2. Check [Firebase Documentation](https://firebase.google.com/docs)
3. Review build logs in Netlify dashboard
4. Check browser console for runtime errors

