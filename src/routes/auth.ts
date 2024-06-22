import { Router, Request, Response } from 'express';
import { AppDataSource } from '../database';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  const user = new User();
  user.username = username;
  user.password = password;
  user.role = role;

  await AppDataSource.manager.save(user);
  res.status(201).send('User created');
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await AppDataSource.manager.findOneBy(User, { username });

  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });

  res.send({ token });
});

export default router;
