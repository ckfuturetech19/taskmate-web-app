// User-friendly error messages for Firebase Auth errors
export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // Google Sign-In errors
    'auth/popup-closed-by-user': 'Sign-in cancelled. Please try again.',
    'auth/popup-blocked': 'Pop-up blocked by browser. Please allow pop-ups and try again.',
    'auth/unauthorized-domain': 'This domain is not authorized. Please contact support.',
    'auth/cancelled-popup-request': 'Sign-in cancelled. Please try again.',
    
    // Email/Password errors
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    
    // Network & General errors
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    'auth/requires-recent-login': 'Please sign out and sign in again to continue.',
    
    // Token errors
    'auth/invalid-action-code': 'Invalid or expired verification link.',
    'auth/expired-action-code': 'This verification link has expired.',
    
    // Configuration errors
    'auth/invalid-api-key': 'Authentication configuration error. Please contact support.',
    'auth/app-not-authorized': 'App not authorized. Please contact support.',
    'auth/invalid-user-token': 'Your session has expired. Please sign in again.',
    'auth/user-token-expired': 'Your session has expired. Please sign in again.',
    
    // Default
    'default': 'An error occurred. Please try again.',
  };

  return errorMessages[errorCode] || errorMessages['default'];
};

// Format Firebase error for display
export const formatFirebaseError = (error: any): string => {
  if (error?.code) {
    return getAuthErrorMessage(error.code);
  }
  
  if (error?.message) {
    // If it's already a user-friendly message, return it
    if (!error.message.includes('Firebase') && !error.message.includes('auth/')) {
      return error.message;
    }
  }
  
  return getAuthErrorMessage('default');
};
