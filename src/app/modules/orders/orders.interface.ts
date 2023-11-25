export interface IOrder {
  orderId: string;
  userId: string;
  orders: [
    {
      productName: string;
      productId: string;
      price: string;
      quantity: string;
    },
  ];
}
