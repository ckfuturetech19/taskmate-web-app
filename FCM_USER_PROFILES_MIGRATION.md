# FCM Token Storage - user_profiles Integration

## Changes Made

Updated FCM token storage to use `user_profiles` collection instead of subcollection `users/{userId}/fcmTokens`.

### Benefits:
✅ **Accessible everywhere** - user_profiles is already used throughout the app
✅ **Single source of truth** - All user data in one document
✅ **Easier queries** - No need for subcollection queries
✅ **Consistent with mobile** - Mobile app also uses user_profiles
✅ **Better performance** - Fewer Firestore reads

## New Structure

### Before (Subcollection):
```
users/
  {userId}/
    fcmTokens/
      {token1}/ → { token, platform, browser, ... }
      {token2}/ → { token, platform, browser, ... }
```

### After (Array in user_profiles):
```
user_profiles/
  {userId}/
    fcmTokens: [
      { token: "...", platform: "web", browser: "...", lastUpdated: "..." },
      { token: "...", platform: "android", browser: "...", lastUpdated: "..." },
      { token: "...", platform: "ios", browser: "...", lastUpdated: "..." }
    ]
```

## Files Updated

### Web App:
1. **src/services/fcmService.ts**
   - `saveTokenToFirestore()` - Saves to user_profiles as array
   - `deleteToken()` - Removes from user_profiles array
   - `cleanupOldTokens()` - Filters user_profiles array

### Cloud Functions:
2. **functions/reminder_notifications.js**
   - `checkPersonalTaskReminders()` - Reads from user_profiles
   - `checkGroupTaskReminders()` - Reads from user_profiles
   - `cleanupInvalidTokens()` - Updates user_profiles array

### Documentation:
3. **FCM_SETUP.md** - Updated Firestore structure examples
4. **FCM_IMPLEMENTATION.md** - Updated token management details

## How It Works

### 1. Token Registration (Login/Permission):
```typescript
user_profiles/{userId}
  .fcmTokens.push({
    token: "fcm_xyz...",
    platform: "web",
    browser: "Chrome/...",
    lastUpdated: "2025-12-14T10:30:00Z"
  })
```

### 2. Token Retrieval (Cloud Function):
```javascript
const userProfile = await db.collection('user_profiles').doc(userId).get();
const tokens = userProfile.data().fcmTokens.map(t => t.token);
// Send notifications to all tokens
```

### 3. Token Deletion (Logout):
```typescript
user_profiles/{userId}
  .fcmTokens = fcmTokens.filter(t => t.token !== currentToken)
```

### 4. Invalid Token Cleanup:
```javascript
user_profiles/{userId}
  .fcmTokens = fcmTokens.filter(t => !invalidTokens.includes(t.token))
```

## Testing

### Check tokens are saved:
1. Login to web app
2. Allow notifications
3. Go to Firestore → `user_profiles/{userId}`
4. Verify `fcmTokens` array exists with your token

### Check Cloud Function reads correctly:
1. Set a reminder 2 minutes in future
2. Wait for reminder time
3. Check function logs: `firebase functions:log`
4. Should see: "Found X due reminders for user Y"
5. Should see: Tokens array being used

### Check token cleanup on logout:
1. Login and verify token exists
2. Logout
3. Check Firestore → token should be removed from array

## Migration (If Needed)

If you have existing tokens in `users/{userId}/fcmTokens` subcollection, run this migration:

```javascript
// One-time migration script
async function migrateTokens() {
  const usersSnapshot = await db.collection('users').get();
  
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const tokensSnapshot = await db.collection('users').doc(userId).collection('fcmTokens').get();
    
    if (!tokensSnapshot.empty) {
      const tokens = tokensSnapshot.docs.map(doc => ({
        token: doc.id,
        ...doc.data()
      }));
      
      await db.collection('user_profiles').doc(userId).set(
        { fcmTokens: tokens },
        { merge: true }
      );
      
      console.log(`Migrated ${tokens.length} tokens for user ${userId}`);
    }
  }
}
```

## Deployment

1. **Deploy Cloud Function**:
   ```bash
   cd functions
   firebase deploy --only functions:checkAndSendReminders
   ```

2. **Clear browser cache** (optional but recommended):
   - Logout from web app
   - Clear site data
   - Login again to register new token

3. **Test notifications**:
   - Set reminder 2 minutes in future
   - Wait and verify notification received

## Advantages Over Subcollection

| Aspect | Subcollection | user_profiles Array |
|--------|--------------|---------------------|
| **Reads per notification** | 2 (profile + tokens query) | 1 (profile only) |
| **Write complexity** | Simple (addDoc) | Moderate (array management) |
| **Token lookup** | Query required | Direct array access |
| **Data consistency** | Separate documents | Single document |
| **Mobile compatibility** | Different structure | Same structure |
| **Query cost** | Higher | Lower |

## Notes

- **Array size limit**: Firestore documents have 1MB limit, but ~100 tokens would fit easily
- **Concurrent writes**: Firestore handles array updates atomically
- **Token refresh**: Automatically replaces existing token when browser/device refreshes
- **Platform detection**: Web tokens have `platform: "web"` and browser user agent
