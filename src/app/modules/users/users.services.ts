import { IUser } from './users.interface';
import { UserModel } from './users.model';

const createUserInDB = async (userData: IUser) => {
  const result = await UserModel.create(userData);
  return result;
};
const getAllUsersInDB = async () => {
  const result = await UserModel.find();
  return result;
};

export const UserServices = {
  createUserInDB,
  getAllUsersInDB,
};
