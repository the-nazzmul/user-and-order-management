import { Model } from 'mongoose';
import { z } from 'zod';
import userValidationSchema from './validations/users.validation';

export interface IUserName {
  firstName: string;
  lastName: string;
}

export interface IUserAddress {
  street: string;
  city: string;
  country: string;
}
export interface IProducts {
  productName: string;
  price: number;
  quantity: number;
}

export interface IUser {
  userId: number;
  username: string;
  password: string;
  fullName: IUserName;
  age: number;
  email: string;
  isActive: boolean;
  hobbies: string[];
  address: IUserAddress;
  orders?: IProducts[] | undefined;
  isDeleted: boolean;
}

const payload = userValidationSchema.partial()

export type IUpdatePayload = z.infer<typeof payload>

export interface UserMethod extends Model<IUser> {
  idExists(userId: number): Promise<IUser | null>;
  userNameExists(username: string): Promise<IUser | null>;
  emailExists(email: string): Promise<IUser | null>;
}
