import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Order, mockOrders, mockDeliveryPartners } from '@/data/mock-data';
import { toast } from 'sonner';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByUser: (userId: string) => Order[];
  getOrdersByRestaurant: (restaurantId: string) => Order[];
  getOrdersByDeliveryPartner: (partnerId: string) => Order[];
  newOrderIds: string[];
  clearNewOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [newOrderIds, setNewOrderIds] = useState<string[]>([]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    // Auto-assign nearest available delivery partner
    const availablePartner = mockDeliveryPartners.find(dp => dp.isAvailable);
    
    const newOrder: Order = {
      ...orderData,
      deliveryPartnerId: orderData.deliveryPartnerId || availablePartner?.userId,
      id: `o${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    setNewOrderIds(prev => [...prev, newOrder.id]);
    
    // Notify restaurant owner
    toast.info(`🔔 New order #${newOrder.id.slice(-4)} received!`, {
      duration: 5000,
      description: `${newOrder.items.map(i => `${i.name} × ${i.quantity}`).join(', ')} • ₹${newOrder.totalAmount}`,
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
  };

  const clearNewOrder = useCallback((orderId: string) => {
    setNewOrderIds(prev => prev.filter(id => id !== orderId));
  }, []);

  const getOrdersByUser = (userId: string) => orders.filter(o => o.userId === userId);
  const getOrdersByRestaurant = (restaurantId: string) => orders.filter(o => o.restaurantId === restaurantId);
  const getOrdersByDeliveryPartner = (partnerId: string) => orders.filter(o => o.deliveryPartnerId === partnerId);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrdersByUser, getOrdersByRestaurant, getOrdersByDeliveryPartner, newOrderIds, clearNewOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
