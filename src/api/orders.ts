import client from './client';

export const createOrder = async (orderData: { userId: number; items: { albumId: number; quantity: number; price: number }[] }) => {
    const response = await client.post('/orders', orderData);
    return response.data;
};

export const getUserOrders = async (userId: number) => {
    const response = await client.get(`/orders/user/${userId}`);
    return response.data;
};
