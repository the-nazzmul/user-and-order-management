import { Schema, model } from 'mongoose';
import {
  IUserAddress,
  IUserName,
  IUser,
  UserMethod,
  IProducts,
} from './interface';
import bcrypt from 'bcrypt';
import config from '../config';

/*________________________SCHEMAS_________________________ */

const userNameSchema = new Schema<IUserName>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
});

const userAddressSchema = new Schema<IUserAddress>({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  country: { type: String, trim: true },
});

const productSchema = new Schema<IProducts>({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

// schema for users
const userSchema = new Schema<IUser, UserMethod>(
  {
    userId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    fullName: { type: userNameSchema, required: true },
    age: { type: Number, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: { type: Boolean, default: true },
    hobbies: { type: [String] },
    address: { type: userAddressSchema },
    orders: { type: [productSchema], default: undefined },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform: function (_doc, modified) {
        delete modified.password;
        delete modified.fullName._id;
        delete modified.address._id;
        delete modified._id;
        delete modified.__v;
        delete modified.isDeleted;
      },
    },
  },
);

/*__________________________MIDDLEWARES___________________ */

// middle for hashing the password
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// middleware for deleted data
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// middleware for findOne operation
userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//middleware for aggregate
userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

/*________________________CUSTOM STATICS______________________*/

// static for already existing userId
userSchema.statics.idExists = async function (userId: number) {
  const existingUser = await UserModel.findOne({ userId }).select({
    orders: 0,
  });
  return existingUser;
};
// static for already existing username
userSchema.statics.userNameExists = async function (username: string) {
  const existingUser = await UserModel.findOne({ username });
  return existingUser;
};
// static for already existing email
userSchema.statics.emailExists = async function (email: string) {
  const existingUser = await UserModel.findOne({ email });
  return existingUser;
};

/*___________________________MODELS___________________________*/

export const UserModel = model<IUser, UserMethod>('User', userSchema);
