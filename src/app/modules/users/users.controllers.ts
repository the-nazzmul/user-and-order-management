import { Request, Response } from 'express';
import { UserServices } from './users.services';
import userValidationSchema from './users.validation';

const createUser = async (req: Request, res: Response) => {
  try {
    const { user: userData } = req.body;
    const zodData = userValidationSchema.parse(userData);

    const result = await UserServices.createUserInDB(zodData);

    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Failed to create user',
      error: {
        status: 500,
        description: (err as Error).message || 'Failed to create user',
      },
    });
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
        status: 500,
        description: (err as Error).message || 'Failed to fetch users',
      },
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const parsedUserId = parseFloat(userId);
  try {
    const result = await UserServices.getSingleUserFromDB(parsedUserId);
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
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Failed to update user',
      error: {
        status: 500,
        description: (err as Error).message || 'Failed to update user',
      },
    });
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
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Failed to delete user',
      error: {
        code: 500,
        description: (err as Error).message || 'Failed to delete user',
      },
    });
  }
};

export const UserControllers = {
  createUser,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteUser,
};
