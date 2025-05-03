import { Request, Response, NextFunction } from 'express';
import admin from '@libs/authentication-middleware';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('awaaaa   '+ req)
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return; // Exit the function after sending the response
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decodedToken; // Attach the decoded token to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("auth.ts Error:" + error)
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return; // Exit the function after sending the response
  }
};
