# Cross-Device Reminder Notifications Setup Guide

This guide explains how to complete the setup of cross-device push notifications for TaskMate.

## Overview

The system uses:
- **Firebase Cloud Messaging (FCM)** for push notifications
- **Cloud Functions** for scheduled reminder checks (runs every minute)
- **Service Worker** for background notifications on web
- **Firestore** for token management across devices

## Setup Steps

### 1. Generate VAPID Key (Web Push Certificate)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **taskmate-e7cc9**
3. Go to **Project Settings** → **Cloud Messaging** tab
4. Scroll to **Web Push certificates** section
5. Click **Generate key pair** if you don't have one
6. Copy the key

### 2. Update VAPID Key in Code

Open `src/services/fcmService.ts` and replace the placeholder:

```typescript
const VAPID_KEY = 'YOUR_ACTUAL_VAPID_KEY_HERE';
```

With your actual key from Firebase Console.

### 3. Deploy Cloud Function

```bash
cd functions
npm install
firebase deploy --only functions:checkAndSendReminders
```

This deploys the scheduled function that checks for due reminders every minute.

### 4. Add Logo Images (Optional)

Add these images to `public/` directory:
- `logo.png` - Main app logo (192x192px recommended)
- `badge.png` - Small badge icon (96x96px recommended)

### 5. Configure Firebase Console

1. Go to **Cloud Messaging** → **Firebase Cloud Messaging API**
2. Make sure **Firebase Cloud Messaging API (V1)** is **enabled**
3. If not enabled, click "Enable" and follow the prompts

### 6. Test the Setup

#### On Web:

1. Start the dev server: `npm run dev`
2. Login to your account
3. Create a task with a reminder 2-3 minutes in the future
4. When prompted, allow notifications
5. Wait for the reminder time
6. You should receive a notification

#### Check Logs:

```bash
# View Cloud Function logs
firebase functions:log --only checkAndSendReminders

# Or in Firebase Console
# Go to Functions → checkAndSendReminders → Logs
```

## How It Works

### 1. **Token Registration** (on login/permission grant)
```
User logs in → FCM token generated → Saved to Firestore
user_profiles/{userId} → fcmTokens array
```

### 2. **Reminder Set** (web or mobile)
```
User sets reminder → Task saved with reminder timestamp
userSyncData/{userId}/tasks/{taskId} or groups/{groupId}/tasks/{taskId}
```

### 3. **Scheduled Check** (every minute)
```
Cloud Function runs → Queries tasks with reminders due → Sends FCM to all user tokens
```

### 4. **Notification Delivery**
- **App Open (Foreground)**: Service worker shows notification
- **App Closed (Background)**: Service worker shows notification
- **Mobile App**: Native notification via FCM

## Firestore Structure

### FCM Tokens in user_profiles
```
user_profiles/
  {userId}/
    fcmTokens: [
      {
        token: "fcm_token_string"
        platform: "web" | "android" | "ios"
        browser: "user_agent_string"
        lastUpdated: "2025-12-14T10:30:00.000Z"
      },
      ...
    ]
```

### Tasks with Reminders
```
userSyncData/
  {userId}/
    tasks/
      {taskId}/
        title: "Task title"
        reminder: "2025-12-14T10:30:00.000Z"
        isCompleted: 0
        ...

groups/
  {groupId}/
    tasks/
      {taskId}/
        title: "Group task"
        reminder: "2025-12-14T10:30:00.000Z"
        groupMembers: ["userId1", "userId2"]
        ...
```

## Testing Checklist

- [ ] VAPID key updated in `fcmService.ts`
- [ ] Cloud Function deployed successfully
- [ ] Service worker registered (`/firebase-messaging-sw.js` accessible)
- [ ] Login generates FCM token
- [ ] Token saved in Firestore under `users/{userId}/fcmTokens`
- [ ] Set reminder and receive notification at due time
- [ ] Notification works with app open
- [ ] Notification works with app closed
- [ ] Multiple devices receive notification for same user
- [ ] Mobile app receives notification (if using mobile app)

## Troubleshooting

### No notification received

1. **Check Cloud Function logs:**
   ```bash
   firebase functions:log --only checkAndSendReminders
   ```

2. **Verify token exists:**
   - Go to Firestore
   - Check `user_profiles/{userId}` document
   - Should have `fcmTokens` array with at least one token

3. **Check notification permission:**
   - Browser settings → Notifications
   - Ensure site has permission granted

4. **Verify service worker:**
   - Open DevTools → Application → Service Workers
   - Should see `firebase-messaging-sw.js` active

5. **Check task has reminder:**
   - Verify task document has `reminder` field
   - Format should be ISO string: "2025-12-14T10:30:00.000Z"
   - Task should have `isCompleted: 0` and `isDeleted: 0`

### VAPID key error

Error: `Messaging: The VAPID key is not set correctly`

**Solution:** Update the VAPID_KEY in `src/services/fcmService.ts` with your actual key from Firebase Console.

### Service worker not found

Error: `404 /firebase-messaging-sw.js`

**Solution:** Ensure the service worker file is in `public/` directory and the dev server is serving static files correctly.

### Invalid token errors in logs

This is normal - Cloud Function automatically cleans up invalid tokens. Tokens become invalid when:
- User clears browser data
- User uninstalls app
- Token expires (rare)

## Security Considerations

1. **VAPID Key**: Keep it in your code, it's meant to be public (sent to client)
2. **FCM Tokens**: Store securely, auto-cleanup old tokens
3. **Cloud Function**: Runs with admin privileges, validate all data
4. **Notification Content**: Don't include sensitive data in notification body

## Production Deployment

1. Build the web app: `npm run build`
2. Deploy to Firebase Hosting: `firebase deploy --only hosting`
3. Deploy Cloud Functions: `firebase deploy --only functions`
4. Monitor function execution in Firebase Console
5. Set up alerts for function errors

## Cost Considerations

- **Cloud Functions**: Free tier includes 2M invocations/month
  - This function runs every minute = ~44,640 invocations/month
  - Well within free tier
- **FCM**: Free for unlimited messages
- **Firestore**: Charged per read/write
  - Function reads all users + tasks each run
  - Optimize by indexing `reminder` field

## Next Steps

1. Add notification preferences (user can disable)
2. Add snooze functionality
3. Add custom notification sounds
4. Add notification history
5. Add analytics for notification engagement
