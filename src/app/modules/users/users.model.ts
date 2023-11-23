import { Schema, model } from 'mongoose';
import { IUserAddress, IUserName, IUser } from './users.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userNameSchema = new Schema<IUserName>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
});

const userAddressSchema = new Schema<IUserAddress>({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  country: { type: String, trim: true },
});

const userSchema = new Schema<IUser>(
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

// middle for hashing the password
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// emptying the password field
userSchema.post('save', function (doc, next) {
  doc.password = '';
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

export const UserModel = model<IUser>('User', userSchema);
