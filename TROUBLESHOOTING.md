# TaskMate Web App Troubleshooting Guide

## Common Issues and Solutions

### 1. UI Not Rendering on Local (localhost)

**Possible Causes:**
- Browser cache issues
- React rendering errors
- CSS not loading properly

**Solutions:**
1. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors (F12 → Console tab)
3. Restart the dev server:
   ```powershell
   cd "d:\Chirag's projects\taskmate-app"
   npm run dev
   ```
4. Check if Vite is running correctly on http://localhost:8080/

### 2. Authentication Not Working on Network Link

**Possible Causes:**
- Firebase OAuth redirect URI not configured for network IP
- CORS issues
- Firebase project settings

**Solutions:**

#### A. Add Authorized Domains in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `taskmate-e7cc9`
3. Navigate to: **Authentication** → **Settings** → **Authorized domains**
4. Add your network IP address (e.g., `10.20.252.141`)
5. Format: `10.20.252.141:8080` or just `10.20.252.141`

#### B. Configure Google OAuth
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** sign-in provider
3. Add authorized domains:
   - `localhost`
   - Your network IP (e.g., `10.20.252.141`)
   - `taskmate-e7cc9.firebaseapp.com`

#### C. Enable Email/Password Authentication
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Save changes

### 3. Google Sign-In Popup Blocked

**Solutions:**
1. Allow popups for localhost and your network IP in browser settings
2. Check if third-party cookies are enabled
3. Try using a different browser (Chrome recommended)

### 4. CORS Errors

**Solutions:**
1. Firebase should automatically handle CORS for authorized domains
2. If issues persist, check Firebase project settings
3. Ensure your domain is in the authorized list

### 5. Network Access Issues

**Current Configuration:**
- Vite server is configured to bind to all network interfaces (`host: "::"`)
- Accessible on both:
  - Local: http://localhost:8080/
  - Network: http://10.20.252.141:8080/

**Troubleshooting:**
1. Check firewall settings - ensure port 8080 is allowed
2. On Windows, you may need to allow Node.js through Windows Firewall
3. Verify your IP address hasn't changed:
   ```powershell
   ipconfig
   ```

### 6. Firebase Connection Issues

**Check Firebase Status:**
1. Verify Firebase project ID matches: `taskmate-e7cc9`
2. Check API key is correct in `src/lib/firebase.ts`
3. Ensure Firebase project has billing enabled (for production use)

### 7. Build Issues

**For Production Build:**
```powershell
# Build the app
npm run build

# Preview the production build locally
npm run preview
```

## Authentication Features

### Supported Sign-In Methods:
1. ✅ **Google Sign-In** - OAuth via Google account
2. ✅ **Email/Password** - Traditional email registration and login

### New Features:
- Tabbed interface for Sign In and Sign Up
- Form validation with user-friendly error messages
- Loading states during authentication
- Password confirmation for sign up
- Proper error handling for common issues:
  - User not found
  - Wrong password
  - Email already in use
  - Weak password
  - Invalid email

## Quick Checklist

Before reporting issues, check:
- [ ] Browser console shows no errors
- [ ] Dev server is running (`npm run dev`)
- [ ] Firebase console shows your project is active
- [ ] Email/Password and Google OAuth are enabled in Firebase
- [ ] Authorized domains include localhost and your network IP
- [ ] Browser allows popups and third-party cookies
- [ ] Windows Firewall allows Node.js (for network access)

## Useful Commands

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Check for TypeScript errors
npx tsc --noEmit
```

## Getting Help

If issues persist:
1. Check browser DevTools console (F12)
2. Check terminal output for server errors
3. Verify Firebase configuration in `src/lib/firebase.ts`
4. Test with a different browser
5. Try incognito/private mode to rule out extensions

## Network Testing

To test if the app is accessible on your network:
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from another device on same network: `http://YOUR_IP:8080`
3. Ensure both devices are on the same network
4. Check firewall isn't blocking port 8080
