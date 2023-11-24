import { IUser } from './users.interface';
import { UserModel } from './users.model';

const createUserInDB = async (userData: IUser) => {
  if (await UserModel.userExists(userData.userId)) {
    throw new Error('User already exists');
  }
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

const getSingleUserFromDB = async (userId: number) => {
  const result = await UserModel.findOne({ userId });
  return result;
};

const updateSingleUserInDB = async (userId: string, userData: IUser) => {
  const query = { userId };
  const result = await UserModel.findOneAndUpdate(
    query,
    { $set: userData },
    { new: true, runValidators: true },
  );
  return result;
};

const deleteUserFromDB = async (userId: string) => {
  const result = await UserModel.updateOne({ userId }, { isDeleted: true });
  return result;
};

export const UserServices = {
  createUserInDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateSingleUserInDB,
  deleteUserFromDB,
};
