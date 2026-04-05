import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, mockOrders } from '@/data/mock-data';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByUser: (userId: string) => Order[];
  getOrdersByRestaurant: (restaurantId: string) => Order[];
  getOrdersByDeliveryPartner: (partnerId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `o${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
  };

  const getOrdersByUser = (userId: string) => orders.filter(o => o.userId === userId);
  const getOrdersByRestaurant = (restaurantId: string) => orders.filter(o => o.restaurantId === restaurantId);
  const getOrdersByDeliveryPartner = (partnerId: string) => orders.filter(o => o.deliveryPartnerId === partnerId);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrdersByUser, getOrdersByRestaurant, getOrdersByDeliveryPartner }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
