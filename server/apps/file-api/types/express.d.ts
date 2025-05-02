import { DecodedIdToken  } from 'firebase-admin/auth';  // Import the type of the user from Firebase Admin

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken ;  // Extend the Request interface to include a 'user' property
    }
  }
}