import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'SECRET_KEY', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      (req as any).user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user.role !== 'admin') {
    return res.sendStatus(403);
  }
  next();
};
