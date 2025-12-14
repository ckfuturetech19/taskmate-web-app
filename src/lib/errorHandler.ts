// User-friendly error messages for Firestore errors
export const getFirestoreErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // Permission errors
    'permission-denied': 'You don\'t have permission to perform this action.',
    'unauthenticated': 'Please sign in to continue.',
    
    // Network errors
    'unavailable': 'Service temporarily unavailable. Please try again.',
    'deadline-exceeded': 'Request timed out. Please check your connection and try again.',
    'cancelled': 'Operation was cancelled. Please try again.',
    
    // Data errors
    'not-found': 'The requested item was not found.',
    'already-exists': 'This item already exists.',
    'invalid-argument': 'Invalid data provided. Please check and try again.',
    'failed-precondition': 'Operation cannot be performed. Please try again.',
    
    // Quota errors
    'resource-exhausted': 'Too many requests. Please try again later.',
    'out-of-range': 'Value is out of valid range.',
    
    // Internal errors
    'internal': 'An internal error occurred. Please try again.',
    'data-loss': 'Data error occurred. Please try again.',
    'unknown': 'An unknown error occurred. Please try again.',
    
    // Default
    'default': 'An error occurred. Please try again.',
  };

  return errorMessages[errorCode] || errorMessages['default'];
};

// Format Firestore error for display
export const formatFirestoreError = (error: any): string => {
  if (error?.code) {
    return getFirestoreErrorMessage(error.code);
  }
  
  if (error?.message) {
    // If it's already a user-friendly message, return it
    if (!error.message.includes('FirebaseError') && !error.message.includes('firestore/')) {
      return error.message;
    }
  }
  
  return getFirestoreErrorMessage('default');
};

// Generic error formatter that works with both Auth and Firestore errors
export const formatError = (error: any): string => {
  if (!error) return 'An error occurred. Please try again.';
  
  // Check if it's already a formatted Error object
  if (error instanceof Error && !error.message.includes('Firebase') && !error.message.includes('auth/') && !error.message.includes('firestore/')) {
    return error.message;
  }
  
  // Try to extract error code
  const code = error?.code || '';
  
  // Determine if it's an auth or firestore error
  if (code.startsWith('auth/')) {
    const { formatFirebaseError } = require('./authErrors');
    return formatFirebaseError(error);
  }
  
  return formatFirestoreError(error);
};
