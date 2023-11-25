import { z } from 'zod';

const productValidationSchema = z
  .object({
    productName: z.string(),
    productId: z.string(),
    price: z.string(),
    quantity: z.string(),
  })
  .required();

const orderValidationSchema = z
  .object({
    orderId: z.string(),
    userId: z.string(),
    orders: z.array(productValidationSchema).min(1),
  })
  .required();

export default orderValidationSchema;
