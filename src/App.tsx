import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CustomerHome from "@/pages/customer/CustomerHome";
import RestaurantList from "@/pages/customer/RestaurantList";
import RestaurantDetail from "@/pages/customer/RestaurantDetail";
import Cart from "@/pages/customer/Cart";
import Checkout from "@/pages/customer/Checkout";
import OrderTracking from "@/pages/customer/OrderTracking";
import OrderHistory from "@/pages/customer/OrderHistory";
import Favorites from "@/pages/customer/Favorites";
import RestaurantDashboard from "@/pages/restaurant/RestaurantDashboard";
import MenuManagement from "@/pages/restaurant/MenuManagement";
import RestaurantOrders from "@/pages/restaurant/RestaurantOrders";
import DeliveryDashboard from "@/pages/delivery/DeliveryDashboard";
import DeliveryEarnings from "@/pages/delivery/DeliveryEarnings";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminRestaurants from "@/pages/admin/AdminRestaurants";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<MainLayout />}>
                  {/* Customer */}
                  <Route path="/" element={<CustomerHome />} />
                  <Route path="/restaurants" element={<RestaurantList />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order/:id" element={<OrderTracking />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/favorites" element={<Favorites />} />
                  {/* Restaurant Owner */}
                  <Route path="/restaurant" element={<RestaurantDashboard />} />
                  <Route path="/restaurant/menu" element={<MenuManagement />} />
                  <Route path="/restaurant/orders" element={<RestaurantOrders />} />
                  {/* Delivery Partner */}
                  <Route path="/delivery" element={<DeliveryDashboard />} />
                  <Route path="/delivery/earnings" element={<DeliveryEarnings />} />
                  {/* Admin */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/restaurants" element={<AdminRestaurants />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
