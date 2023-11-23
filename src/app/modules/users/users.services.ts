import { IUser } from './users.interface';
import { UserModel } from './users.model';

const createUserInDB = async (userData: IUser) => {
  const result = await UserModel.create(userData);
  return result;
};

export const UserServices = {
  createUserInDB,
};
