import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const userAddressValidationSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
});

const productValidationSchema = z.object({
  productName: z.string(),
  price: z.number(),
  quantity: z.number(),
});

const userValidationSchema = z
  .object({
    userId: z.number().int().positive(),
    username: z.string().min(1),
    password: z.string().min(1),
    fullName: userNameValidationSchema,
    age: z.number().int().positive(),
    email: z.string().email(),
    isActive: z.boolean(),
    hobbies: z.array(z.string()),
    address: userAddressValidationSchema,
    orders: z.array(productValidationSchema),
    isDeleted: z.boolean().optional().default(false),
  })
  .required({
    userId: true,
    username: true,
    password: true,
    fullName: true,
    age: true,
    email: true,
    address: true,
  });

export default userValidationSchema;
