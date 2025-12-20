# Environment Variables Setup

This project uses environment variables to store sensitive configuration data like Firebase API keys.

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your actual values:**
   - Open `.env` file
   - Replace all placeholder values with your actual Firebase credentials
   - Get your Firebase config from [Firebase Console](https://console.firebase.google.com/)

3. **Never commit `.env` file:**
   - The `.env` file is already in `.gitignore`
   - Only commit `.env.example` as a template

## Environment Variables

### Required Variables

All Firebase configuration variables are prefixed with `VITE_` to be accessible in the client-side code:

- `VITE_FIREBASE_API_KEY` - Firebase Web API Key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase Auth Domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase Project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase Storage Bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase Messaging Sender ID
- `VITE_FIREBASE_APP_ID` - Firebase App ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Firebase Analytics Measurement ID
- `VITE_FIREBASE_VAPID_KEY` - Firebase VAPID Key for Web Push Notifications (Cloud Messaging)

## Usage in Code

### In TypeScript/React Components

```typescript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
```

### In Service Worker

The service worker uses `public/firebase-config.js` which is automatically updated during build with values from your `.env` file.

## Deployment

### Vercel
1. Go to Project Settings > Environment Variables
2. Add all `VITE_*` variables
3. Redeploy

### Netlify
1. Go to your site dashboard on [Netlify](https://app.netlify.com/)
2. Navigate to **Site Settings** (gear icon in the top menu)
3. Click on **Environment variables** in the left sidebar
4. Click **Add a variable** button
5. Add each variable one by one:
   - **Key:** `VITE_FIREBASE_API_KEY` → **Value:** (your Firebase API key)
   - **Key:** `VITE_FIREBASE_AUTH_DOMAIN` → **Value:** (your auth domain)
   - **Key:** `VITE_FIREBASE_PROJECT_ID` → **Value:** (your project ID)
   - **Key:** `VITE_FIREBASE_STORAGE_BUCKET` → **Value:** (your storage bucket)
   - **Key:** `VITE_FIREBASE_MESSAGING_SENDER_ID` → **Value:** (your messaging sender ID)
   - **Key:** `VITE_FIREBASE_APP_ID` → **Value:** (your app ID)
   - **Key:** `VITE_FIREBASE_MEASUREMENT_ID` → **Value:** (your measurement ID)
   - **Key:** `VITE_FIREBASE_VAPID_KEY` → **Value:** (your VAPID key)
6. For each variable, you can set it for:
   - **All scopes** (recommended for most cases)
   - **Production** only
   - **Deploy previews** only
   - **Branch deploys** only
7. After adding all variables, go to **Deploys** tab
8. Click **Trigger deploy** → **Deploy site** to rebuild with the new environment variables

**Note:** Netlify will automatically use these variables during the build process. Make sure to rebuild after adding them.

### GitHub Actions / Other CI/CD
1. Add environment variables as secrets in your repository settings
2. Reference them in your workflow files

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to version control
- Rotate API keys immediately if they are exposed in git history
- Use different keys for development and production
- Review Firebase security rules regularly

## Getting Firebase Credentials

### Firebase Config Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app (or create one)
6. Copy the configuration values

### VAPID Key (for Web Push Notifications)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Click on the "Cloud Messaging" tab
5. Scroll down to "Web Push certificates" section
6. If no key exists, click "Generate key pair"
7. Copy the "Key pair" value - this is your VAPID key
8. Add it to `.env` as `VITE_FIREBASE_VAPID_KEY`

**Note:** VAPID keys are public keys meant to be sent to clients, but it's still good practice to keep them in environment variables for configuration management.

## Troubleshooting

### Environment variables not working?

1. Make sure variables start with `VITE_` prefix
2. Restart the dev server after changing `.env`
3. Check that `.env` file is in the project root
4. Verify variable names match exactly (case-sensitive)

### Service worker not getting updated config?

1. Clear browser cache
2. Unregister service worker in DevTools > Application > Service Workers
3. Rebuild the project: `npm run build`

