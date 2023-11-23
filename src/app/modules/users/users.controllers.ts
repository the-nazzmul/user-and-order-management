import { Request, Response } from 'express';
import { UserServices } from './users.services';

const createUser = async (req: Request, res: Response) => {
  const { user } = req.body;
  try {
    const result = await UserServices.createUserInDB(user);
    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  } catch (err) {
    // res.status(500).json({
    //   success: false,
    //   message: 'Failed to create user',
    //   error: {
    //     code: 500,
    //     description: 'Failed to create user',
    //   },
    // });
    console.log(err);
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
  } catch (err) {
    console.log(err);
  }
};

const getSingleUser = async (req:Request,res:Response)=>{
    const {userId} = req.params
    try{
        const result = await UserServices.getSingleUserFromDB(userId)
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: result
        })
    }catch(err){
        console.log(err);
    }
}

export const UserControllers = {
  createUser,
  getAllUser,
  getSingleUser,
};
