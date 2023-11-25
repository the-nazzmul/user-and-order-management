import { Request, Response } from 'express';
import { Services } from './services';
import userValidationSchema from './validations/users.validation';
import productValidationSchema from './validations/orders.validaton';

const createUser = async (req: Request, res: Response) => {
  try {
    const { user: userData } = req.body;
    const zodData = userValidationSchema.parse(userData);

    const result = await Services.createUserInDB(zodData);

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
    const result = await Services.getAllUsersFromDB();
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
    const result = await Services.getSingleUserFromDB(parsedUserId);
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
    const result = await Services.updateSingleUserInDB(userId, validatedData);
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
    await Services.deleteUserFromDB(userId);
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
const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const parsedUserId = parseInt(userId);
    const product = req.body;

    const zodParsedOrder = productValidationSchema.parse(product);

    const result = await Services.createOrderInDB(parsedUserId, zodParsedOrder);
    res.status(200).json({
      success: true,
      message: 'Successfully placed order',
      data: result,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Failed to place order',
      error: {
        status: 500,
        description: (err as Error) || 'Failed to place order',
      },
    });
  }
};

export const Controllers = {
  createUser,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteUser,
  createOrder,
};