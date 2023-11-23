import { IUser } from './users.interface';
import { UserModel } from './users.model';

const createUserInDB = async (userData: IUser) => {
  const result = await UserModel.create(userData);
  return result;
};
const getAllUsersFromDB = async () => {
  const result = await UserModel.find().select({
    userId: 0,
    _id: 0,
    'fullName._id': 0,
    'address._id': 0,
    isActive: 0,
    hobbies: 0,
    __v: 0,
  });
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await UserModel.findOne({ userId: id });
  return result;
};

export const UserServices = {
  createUserInDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
};
