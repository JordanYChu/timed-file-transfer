import { Request, Response } from 'express';
import prisma from '../prisma';

export default async function newUserHandler(
  req: Request,
  res: Response
): Promise<void> {

  console.log("registerUserHandler", req.body);

  const { id, name, email } = req.body;
  if (!id || !name || !email) {
    res.status(400).json({ error: 'id, name, email not provided' });
    return;
  }


  // 2. Create a record in Postgres
  const fileRecord = await prisma.user.create({
    data: {
      id: id,
      name: name
      // email: email
    },
  });

  // 3. Return success
  res.json({
    id: fileRecord.id,
    name: fileRecord.name
  });
}
