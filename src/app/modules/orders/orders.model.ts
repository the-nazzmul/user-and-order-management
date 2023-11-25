import { Schema, model } from 'mongoose';
import { IOrder } from './orders.interface';

const productSchema = new Schema({
  productName: { type: String, required: true },
  productId: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: String, required: true },
});

const orderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  orders: [productSchema],
});

export const OrderModel = model<IOrder>('Order', orderSchema);
