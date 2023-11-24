import { Request, Response } from 'express';
import { UserServices } from './users.services';
import userValidationSchema from './users.validation';
import { ZodError } from 'zod';

const createUser = async (req: Request, res: Response) => {
  const { user } = req.body;
  try {
    const zodData = userValidationSchema.parse(user);

    const result = await UserServices.createUserInDB(zodData);
    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: {
          code: 500,
          description: `${err.errors[0].path[0]} is ${err.errors[0].message}`,
        },
      });
    }
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: result,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Failed to fetch users',
      error: {
        code: 500,
        description: (err as Error).message || 'Failed to fetch users',
      },
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await UserServices.getSingleUserFromDB(parseInt(userId));
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: result,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Failed to fetch user',
      error: {
        code: 500,
        description: (err as Error).message || 'Failed to fetch user',
      },
    });
  }
};

const updateSingleUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { user } = req.body;
  try {
    const validatedData = userValidationSchema.parse(user);
    const result = await UserServices.updateSingleUserInDB(
      userId,
      validatedData,
    );
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: {
          code: 500,
          description: `${err.errors[0].path[0]} is ${err.errors[0].message}`,
        },
      });
    }
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    await UserServices.deleteUserFromDB(userId);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null,
    });
  } catch (err) {
    console.log(err);
  }
};

export const UserControllers = {
  createUser,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteUser,
};
