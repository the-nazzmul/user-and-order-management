import { Request, Response } from 'express';
import { UserServices } from './users.services';

const createUser = async (req: Request, res: Response) => {
  const { user } = req.body;
  try {
    const result = await UserServices.createUserInDB(user);
    res.status(400).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: {
        code: 500,
        description: 'Failed to create user',
      },
    });
  }
};

export const UserControllers = {
  createUser,
};
