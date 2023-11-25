import { Model } from 'mongoose';

export interface IUserName {
  firstName: string;
  lastName: string;
}

export interface IUserAddress {
  street: string;
  city: string;
  country: string;
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
  isDeleted: boolean;
}

export interface UserMethod extends Model<IUser> {
  idExists(userId: number): Promise<IUser | null>;
  userNameExists(username: string): Promise<IUser|null>
  emailExists(email: string): Promise<IUser|null>
}
