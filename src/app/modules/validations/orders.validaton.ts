import { z } from 'zod';

const productValidationSchema = z
  .object({
    productName: z.string(),
    price: z.number(),
    quantity: z.number(),
  })
  .required();


export default productValidationSchema;
