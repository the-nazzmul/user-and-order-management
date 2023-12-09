import { IProducts, IUpdatePayload, IUser } from './interface';
import { UserModel } from './model';

// Create user
const createUserInDB = async (userData: IUser) => {
  if (await UserModel.idExists(userData.userId)) {
    throw new Error('User already exists!');
  }
  if (await UserModel.userNameExists(userData.username)) {
    throw new Error('username already exists!');
  }
  if (await UserModel.emailExists(userData.email)) {
    throw new Error('Email already exists!');
  }

  const result = await UserModel.create(userData);
  return result;
};

// get all users

const getAllUsersFromDB = async () => {
  const result = await UserModel.find().select({
    userId: 0,
    // _id: 0,
    'fullName._id': 0,
    'address._id': 0,
    isActive: 0,
    hobbies: 0,
    __v: 0,
    orders: 0,
  });
  return result;
};

// get single user

const getSingleUserFromDB = async (userId: number) => {
  const existingUser = await UserModel.idExists(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }
  const result = await UserModel.findOne({ userId: userId }).select({
    orders: 0,
  });

  return result;
};

// update a user

const updateSingleUserInDB = async (
  userId: number,
  userData: IUpdatePayload,
) => {
  const existingUserFromParams = await UserModel.idExists(userId);
  const existingUserIdInDB = await UserModel.idExists(
    userData.userId as number,
  );
  const existingUserNameInDB = await UserModel.userNameExists(
    userData.username as string,
  );
  const existingEmailIdInDB = await UserModel.emailExists(
    userData.email as string,
  );

  // error conditions

  if (!existingUserFromParams) {
    throw new Error("User doesn't exist!");
  }

  if (existingUserFromParams.userId === existingUserIdInDB?.userId) {
    throw new Error(
      'Your are already using this user id. Please choose a new one',
    );
  }

  if (existingUserIdInDB) {
    throw new Error('Someone else has the user id. Please try a new one.');
  }

  if (existingUserFromParams.username === existingUserNameInDB?.username) {
    throw new Error(
      'Your are already using this username. Please choose a new one',
    );
  }

  if (existingUserNameInDB) {
    throw new Error('Someone else has the username. Please try a new one.');
  }

  if (existingUserFromParams.email === existingEmailIdInDB?.email) {
    throw new Error(
      'Your are already using this email. Please choose a new one',
    );
  }

  if (existingEmailIdInDB) {
    throw new Error('Someone else has the email. Please try a new one.');
  }

  const result = await UserModel.findOneAndUpdate(
    { userId: userId },
    userData,
    { new: true, runValidators: true },
  );
  return result;
};

// delete a user

const deleteUserFromDB = async (userId: string) => {
  const existingUser = await UserModel.idExists(Number(userId));
  if (!existingUser) {
    throw new Error("User doesn't exist");
  }
  const result = await UserModel.updateOne({ userId }, { isDeleted: true });
  return result;
};

const createOrderInDB = async (userId: number, product: IProducts) => {
  const existingUser = await UserModel.idExists(userId);
  if (!existingUser) {
    throw new Error("User doesn't exists!");
  }
  if (!existingUser.orders) {
    await UserModel.findOneAndUpdate(
      { userId: userId },
      { $set: { orders: [product] } },
      { new: true },
    );
    return null;
  }
  await UserModel.findOneAndUpdate(
    { userId: userId },
    { $push: { orders: product } },
    { new: true },
  );
  return null;
};

const getAllOrdersFromDB = async (userId: number) => {
  const existingUser = await UserModel.idExists(userId);

  if (!existingUser) {
    throw new Error("User doesn't exists!");
  }

  if (!existingUser.orders || existingUser.orders?.length === 0) {
    throw new Error("You haven't ordered any product");
  }

  const result = await UserModel.findOne({ userId }, { 'orders._id': 0 });
  return result;
};

const getTotalOrderPriceFromDB = async (userId: number) => {
  const existingUser = await UserModel.idExists(userId);

  if (!existingUser) {
    throw new Error("User not found");
  }
  if (!existingUser.orders) {
    throw new Error("You haven't ordered anything");
  }

  const result = await UserModel.aggregate([
    { $match: { userId: userId } },
    { $unwind: '$orders' },
    {
      $group: {
        _id: null,
        totalPrice: {
          $sum: { $multiply: ['$orders.price', '$orders.quantity'] },
        },
      },
    },
    { $project: { _id: 0 } },
  ]);
  return result;
};

export const Services = {
  createUserInDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateSingleUserInDB,
  deleteUserFromDB,
  createOrderInDB,
  getAllOrdersFromDB,
  getTotalOrderPriceFromDB,
};
