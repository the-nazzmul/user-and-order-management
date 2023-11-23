import { Schema, model } from 'mongoose';
import { IUserAddress, IUserName, Iuser } from './users.interface';

const userNameSchema = new Schema<IUserName>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
});

const userAddressSchema = new Schema<IUserAddress>({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  country: { type: String, trim: true },
});

const userSchema = new Schema<Iuser>({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: userNameSchema, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  isActive: { type: Boolean, default: true },
  hobbies: { type: [String] },
  address: { type: userAddressSchema },
});

export const User = model<Iuser>('User', userSchema);
