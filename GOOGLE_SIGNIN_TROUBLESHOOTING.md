# Google Sign-In Troubleshooting Guide

## Common Issues and Solutions

### 1. **Popup Blocked Error**
**Symptom:** User sees "Popup blocked" or "Sign-in cancelled" message

**Solutions:**
- Allow popups for your site in browser settings
- The app will automatically try redirect method as fallback
- Check browser's address bar for popup block icon

### 2. **Unauthorized Domain Error**
**Symptom:** "This domain is not authorized for Google Sign-In"

**Solution:**
Go to Firebase Console:
1. Navigate to **Authentication** → **Settings** → **Authorized domains**
2. Add your domain:
   - For localhost: `localhost` (should be there by default)
   - For development: Add your dev URL (e.g., `myapp.local`)
   - For production: Add your production domain

### 3. **Network Error**
**Symptom:** "Network error. Please check your internet connection."

**Solutions:**
- Check internet connection
- Verify firewall isn't blocking Firebase domains
- Try disabling VPN/proxy
- Check browser's developer console for CORS errors

### 4. **Operation Not Allowed**
**Symptom:** "Google Sign-In is not enabled"

**Solution:**
Go to Firebase Console:
1. Navigate to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle to **Enable**
4. Add support email
5. Save changes

## Testing Google Sign-In Locally

### Required Firebase Console Configuration:

1. **Enable Google Sign-In Provider:**
   - Firebase Console → Authentication → Sign-in method
   - Enable Google provider
   - Add support email

2. **Authorize localhost:**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Ensure `localhost` is in the list (added by default)

3. **For Custom Local Domains:**
   If using custom domain like `taskmate.local`:
   - Add to authorized domains in Firebase Console
   - Update your `/etc/hosts` file (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
     ```
     127.0.0.1 taskmate.local
     ```

## Debugging Tips

### Check Browser Console
The app logs helpful debug information:
```
✅ Firebase initialized successfully
📍 Auth Domain: taskmate-e7cc9.firebaseapp.com
🌐 Current Origin: http://localhost:5173
💡 Make sure this domain is authorized in Firebase Console
```

### Test with Different Browsers
- Chrome: Usually works well with popups
- Firefox: May block popups more aggressively
- Safari: Has strict popup policies
- Edge: Similar to Chrome

### Enable Popups
**Chrome:**
1. Click the popup blocked icon in address bar
2. Select "Always allow popups from this site"

**Firefox:**
1. Click the shield icon in address bar
2. Turn off Enhanced Tracking Protection for this site

**Safari:**
1. Safari → Preferences → Websites → Pop-up Windows
2. Allow for your domain

## User-Friendly Error Messages

The app now shows clear, actionable error messages instead of technical Firebase errors:

| Firebase Error | User-Friendly Message |
|---------------|----------------------|
| `auth/popup-closed-by-user` | "Sign-in cancelled. Please try again." |
| `auth/popup-blocked` | "Pop-up blocked by browser. Please allow pop-ups and try again." (Then tries redirect) |
| `auth/unauthorized-domain` | "This domain is not authorized for Google Sign-In." |
| `auth/network-request-failed` | "Network error. Please check your internet connection." |
| `auth/operation-not-allowed` | "Google Sign-In is not enabled. Please contact support." |

## Fallback to Redirect

If popup is blocked, the app automatically tries redirect method:
1. User clicks "Sign in with Google"
2. If popup is blocked, automatically redirects to Google
3. After authentication, redirects back to app
4. App automatically completes sign-in

## Production Deployment

Before deploying to production:

1. **Add Production Domain:**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add your production URL (e.g., `taskmate.app`)

2. **Update OAuth Consent Screen:**
   - Google Cloud Console → APIs & Services → OAuth consent screen
   - Add production domain to authorized domains
   - Verify app information is accurate

3. **Test Thoroughly:**
   - Test with different browsers
   - Test with popup blockers enabled
   - Test redirect fallback
   - Verify error messages are user-friendly

## Support Contacts

If issues persist:
- Check Firebase Console for any service outages
- Review Firebase Authentication documentation
- Check browser compatibility with Firebase
