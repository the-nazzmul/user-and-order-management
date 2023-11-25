// import { Error } from 'mongoose';
import { IProducts, IUser } from './interface';
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
    _id: 0,
    'fullName._id': 0,
    'address._id': 0,
    isActive: 0,
    hobbies: 0,
    __v: 0,
  });
  return result;
};

// get single user

const getSingleUserFromDB = async (userId: number) => {
  const result = await UserModel.idExists(userId);
  if (!result) {
    throw new Error("User doesn't exist");
  }
  return result;
};

// update a user

const updateSingleUserInDB = async (userId: string, userData: IUser) => {
  const query = { userId };
  if (await !UserModel.idExists(userData.userId)) {
    throw new Error("You can't change userId");
  } else if (await UserModel.idExists(userData.userId)) {
    throw new Error("You can't change userId");
  } else if (await UserModel.userNameExists(userData.username)) {
    throw new Error('username already exists');
  } else if (await UserModel.emailExists(userData.email)) {
    throw new Error('Email already exists');
  }
  const result = await UserModel.findOneAndUpdate(
    query,
    { $set: userData },
    { new: true, runValidators: true },
  );
  return result;
};

// delete a user

const deleteUserFromDB = async (userId: string) => {
  const result = await UserModel.updateOne({ userId }, { isDeleted: true });
  return result;
};

const createOrderInDB = async (userId: number, product: IProducts) => {
  const existingUser = await UserModel.idExists(userId);
  if (!existingUser) {
    throw new Error("User doesn't exists!");
  } else if (
    await !UserModel.findOne({
      orders: { $and: [{ $exists: true }, { $type: { $ne: null } }] },
    })
  ) {
    await UserModel.findOneAndUpdate(
      { userId: userId },
      { $set: { orders: [product] } },
      { new: true },
    );
    return null;
  } else {
    await UserModel.findOneAndUpdate(
      { userId: userId },
      { $push: { orders: product } },
      { new: true },
    );
    return null;
  }
};

const getAllOrdersFromDB = async (userId: number) => {
  const existingUser = await UserModel.idExists(userId);
  if (!existingUser) {
    throw new Error("User doesn't exists!");
  }
  if (await UserModel.findOne({ orders: { $exists: false } })) {
    throw new Error("You haven't ordered any product");
  }

  const result = await UserModel.findOne({ userId }, { 'orders._id': 0 });
  return result;
};

const getTotalOrderPriceFromDB = async (userId: number) => {
  const existingUser = await UserModel.idExists(userId);
  if (!existingUser) {
    throw new Error("User doesn't exists");
  }
  if (await UserModel.findOne({ orders: { $exists: false } })) {
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
