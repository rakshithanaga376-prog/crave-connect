export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'restaurant' | 'delivery' | 'admin';
  avatar?: string;
  address?: string;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  location: string;
  isActive: boolean;
  description: string;
  openingHours: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  rating: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  deliveryPartnerId?: string;
  items: OrderItem[];
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  scheduledTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DeliveryPartner {
  id: string;
  userId: string;
  name: string;
  phone: string;
  vehicleType: string;
  isAvailable: boolean;
  currentLocation: string;
  totalEarnings: number;
  totalDeliveries: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  restaurantId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  restaurantId: string;
  code: string;
  description: string;
  discountPercent: number;
  minOrder: number;
  isActive: boolean;
  validUntil: string;
}

// Mock Users
export const mockUsers: User[] = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', role: 'customer', address: '42, MG Road, Bengaluru' },
  { id: 'u2', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 87654 32109', role: 'customer', address: '15, Linking Road, Mumbai' },
  { id: 'u3', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 76543 21098', role: 'restaurant', address: 'Koramangala, Bengaluru' },
  { id: 'u4', name: 'Deepak Singh', email: 'deepak@example.com', phone: '+91 65432 10987', role: 'delivery', address: 'HSR Layout, Bengaluru' },
  { id: 'u5', name: 'Admin User', email: 'admin@example.com', phone: '+91 99999 00000', role: 'admin' },
  { id: 'u6', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 88888 77777', role: 'restaurant' },
  { id: 'u7', name: 'Vikram Joshi', email: 'vikram@example.com', phone: '+91 77777 66666', role: 'delivery' },
];

// Mock Restaurants
export const mockRestaurants: Restaurant[] = [
  { id: 'r1', ownerId: 'u3', name: 'Spice Garden', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', cuisine: 'North Indian', rating: 4.5, reviewCount: 234, deliveryTime: '30-40 min', deliveryFee: 30, location: 'Koramangala, Bengaluru', isActive: true, description: 'Authentic North Indian cuisine with rich flavors', openingHours: '10:00 AM - 11:00 PM' },
  { id: 'r2', ownerId: 'u6', name: 'Dosa Palace', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400', cuisine: 'South Indian', rating: 4.3, reviewCount: 189, deliveryTime: '25-35 min', deliveryFee: 25, location: 'Indiranagar, Bengaluru', isActive: true, description: 'Best dosas and South Indian thalis in town', openingHours: '7:00 AM - 10:00 PM' },
  { id: 'r3', ownerId: 'u3', name: 'Dragon Wok', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', cuisine: 'Chinese', rating: 4.1, reviewCount: 156, deliveryTime: '35-45 min', deliveryFee: 35, location: 'MG Road, Bengaluru', isActive: true, description: 'Indo-Chinese fusion with authentic flavors', openingHours: '11:00 AM - 11:00 PM' },
  { id: 'r4', ownerId: 'u6', name: 'Pizza Paradise', image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400', cuisine: 'Italian', rating: 4.6, reviewCount: 312, deliveryTime: '20-30 min', deliveryFee: 20, location: 'HSR Layout, Bengaluru', isActive: true, description: 'Wood-fired pizzas and fresh pastas', openingHours: '11:00 AM - 12:00 AM' },
  { id: 'r5', ownerId: 'u3', name: 'Biryani House', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', cuisine: 'Mughlai', rating: 4.7, reviewCount: 456, deliveryTime: '40-50 min', deliveryFee: 40, location: 'Whitefield, Bengaluru', isActive: true, description: 'Hyderabadi dum biryani and kebabs', openingHours: '11:00 AM - 11:00 PM' },
  { id: 'r6', ownerId: 'u6', name: 'Chai & Snacks', image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400', cuisine: 'Street Food', rating: 4.2, reviewCount: 178, deliveryTime: '15-25 min', deliveryFee: 15, location: 'BTM Layout, Bengaluru', isActive: true, description: 'Authentic Indian street food and chai', openingHours: '8:00 AM - 10:00 PM' },
  { id: 'r7', ownerId: 'u3', name: 'Green Bowl', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', cuisine: 'Healthy', rating: 4.4, reviewCount: 145, deliveryTime: '25-35 min', deliveryFee: 30, location: 'JP Nagar, Bengaluru', isActive: true, description: 'Fresh salads, smoothie bowls, and healthy meals', openingHours: '8:00 AM - 9:00 PM' },
  { id: 'r8', ownerId: 'u6', name: 'Tandoori Nights', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400', cuisine: 'North Indian', rating: 4.5, reviewCount: 267, deliveryTime: '35-45 min', deliveryFee: 35, location: 'Electronic City, Bengaluru', isActive: true, description: 'Premium tandoori specialties and curries', openingHours: '12:00 PM - 12:00 AM' },
];

// Mock Food Items
export const mockFoodItems: FoodItem[] = [
  // Spice Garden (r1)
  { id: 'f1', restaurantId: 'r1', name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken', price: 299, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300', category: 'Main Course', isVeg: false, isAvailable: true, rating: 4.6 },
  { id: 'f2', restaurantId: 'r1', name: 'Paneer Tikka Masala', description: 'Grilled paneer in spiced gravy', price: 249, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300', category: 'Main Course', isVeg: true, isAvailable: true, rating: 4.4 },
  { id: 'f3', restaurantId: 'r1', name: 'Garlic Naan', description: 'Soft naan bread with garlic butter', price: 59, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300', category: 'Breads', isVeg: true, isAvailable: true, rating: 4.5 },
  { id: 'f4', restaurantId: 'r1', name: 'Dal Makhani', description: 'Creamy black lentils slow-cooked overnight', price: 199, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300', category: 'Main Course', isVeg: true, isAvailable: true, rating: 4.7 },
  { id: 'f5', restaurantId: 'r1', name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 329, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300', category: 'Rice', isVeg: false, isAvailable: true, rating: 4.8 },

  // Dosa Palace (r2)
  { id: 'f6', restaurantId: 'r2', name: 'Masala Dosa', description: 'Crispy dosa with potato filling & chutneys', price: 129, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300', category: 'Dosas', isVeg: true, isAvailable: true, rating: 4.5 },
  { id: 'f7', restaurantId: 'r2', name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup', price: 99, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300', category: 'Breakfast', isVeg: true, isAvailable: true, rating: 4.3 },
  { id: 'f8', restaurantId: 'r2', name: 'Vada', description: 'Crispy lentil fritters with chutney', price: 89, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=300', category: 'Snacks', isVeg: true, isAvailable: true, rating: 4.2 },
  { id: 'f9', restaurantId: 'r2', name: 'Rava Dosa', description: 'Crispy semolina dosa with onions', price: 149, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=300', category: 'Dosas', isVeg: true, isAvailable: true, rating: 4.4 },
  { id: 'f10', restaurantId: 'r2', name: 'Filter Coffee', description: 'Traditional South Indian filter coffee', price: 49, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300', category: 'Beverages', isVeg: true, isAvailable: true, rating: 4.6 },

  // Dragon Wok (r3)
  { id: 'f11', restaurantId: 'r3', name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables', price: 179, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300', category: 'Noodles', isVeg: true, isAvailable: true, rating: 4.3 },
  { id: 'f12', restaurantId: 'r3', name: 'Manchurian', description: 'Crispy vegetable balls in tangy sauce', price: 199, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300', category: 'Starters', isVeg: true, isAvailable: true, rating: 4.1 },
  { id: 'f13', restaurantId: 'r3', name: 'Chilli Chicken', description: 'Spicy Indo-Chinese chicken', price: 249, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300', category: 'Main Course', isVeg: false, isAvailable: true, rating: 4.4 },
  { id: 'f14', restaurantId: 'r3', name: 'Fried Rice', description: 'Wok-tossed rice with vegetables', price: 169, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300', category: 'Rice', isVeg: true, isAvailable: true, rating: 4.2 },
  { id: 'f15', restaurantId: 'r3', name: 'Spring Rolls', description: 'Crispy rolls with vegetable filling', price: 149, image: 'https://images.unsplash.com/photo-1548507200-aba06cec9fa2?w=300', category: 'Starters', isVeg: true, isAvailable: true, rating: 4.0 },

  // Pizza Paradise (r4)
  { id: 'f16', restaurantId: 'r4', name: 'Margherita Pizza', description: 'Classic pizza with mozzarella & basil', price: 299, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300', category: 'Pizza', isVeg: true, isAvailable: true, rating: 4.5 },
  { id: 'f17', restaurantId: 'r4', name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni', price: 399, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300', category: 'Pizza', isVeg: false, isAvailable: true, rating: 4.6 },
  { id: 'f18', restaurantId: 'r4', name: 'Pasta Alfredo', description: 'Creamy white sauce pasta', price: 249, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300', category: 'Pasta', isVeg: true, isAvailable: true, rating: 4.3 },
  { id: 'f19', restaurantId: 'r4', name: 'Garlic Bread', description: 'Toasted bread with garlic butter & cheese', price: 149, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=300', category: 'Sides', isVeg: true, isAvailable: true, rating: 4.4 },
  { id: 'f20', restaurantId: 'r4', name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 199, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300', category: 'Desserts', isVeg: true, isAvailable: true, rating: 4.7 },

  // Biryani House (r5)
  { id: 'f21', restaurantId: 'r5', name: 'Hyderabadi Chicken Biryani', description: 'Dum-cooked biryani with aromatic spices', price: 349, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300', category: 'Biryani', isVeg: false, isAvailable: true, rating: 4.8 },
  { id: 'f22', restaurantId: 'r5', name: 'Mutton Biryani', description: 'Slow-cooked mutton dum biryani', price: 449, image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=300', category: 'Biryani', isVeg: false, isAvailable: true, rating: 4.9 },
  { id: 'f23', restaurantId: 'r5', name: 'Veg Biryani', description: 'Mixed vegetable biryani with raita', price: 249, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300', category: 'Biryani', isVeg: true, isAvailable: true, rating: 4.3 },
  { id: 'f24', restaurantId: 'r5', name: 'Seekh Kebab', description: 'Grilled minced meat skewers', price: 299, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300', category: 'Starters', isVeg: false, isAvailable: true, rating: 4.5 },
  { id: 'f25', restaurantId: 'r5', name: 'Raita', description: 'Cool yogurt with cucumber & spices', price: 69, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', category: 'Sides', isVeg: true, isAvailable: true, rating: 4.2 },

  // Chai & Snacks (r6)
  { id: 'f26', restaurantId: 'r6', name: 'Samosa', description: 'Crispy pastry with spiced potato filling', price: 39, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', category: 'Snacks', isVeg: true, isAvailable: true, rating: 4.4 },
  { id: 'f27', restaurantId: 'r6', name: 'Pav Bhaji', description: 'Spiced vegetable mash with buttered bread', price: 129, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=300', category: 'Street Food', isVeg: true, isAvailable: true, rating: 4.5 },
  { id: 'f28', restaurantId: 'r6', name: 'Masala Chai', description: 'Indian spiced tea with ginger', price: 29, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300', category: 'Beverages', isVeg: true, isAvailable: true, rating: 4.7 },
  { id: 'f29', restaurantId: 'r6', name: 'Chole Bhature', description: 'Spiced chickpeas with fried bread', price: 149, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=300', category: 'Main Course', isVeg: true, isAvailable: true, rating: 4.3 },
  { id: 'f30', restaurantId: 'r6', name: 'Pani Puri', description: 'Crispy puris with tangy water', price: 59, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', category: 'Street Food', isVeg: true, isAvailable: true, rating: 4.6 },

  // Green Bowl (r7)
  { id: 'f31', restaurantId: 'r7', name: 'Quinoa Bowl', description: 'Quinoa with roasted veggies & tahini', price: 299, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300', category: 'Bowls', isVeg: true, isAvailable: true, rating: 4.5 },
  { id: 'f32', restaurantId: 'r7', name: 'Acai Bowl', description: 'Acai blend with granola & fresh fruits', price: 349, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300', category: 'Bowls', isVeg: true, isAvailable: true, rating: 4.6 },
  { id: 'f33', restaurantId: 'r7', name: 'Caesar Salad', description: 'Romaine lettuce with parmesan & croutons', price: 199, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300', category: 'Salads', isVeg: true, isAvailable: true, rating: 4.3 },
  { id: 'f34', restaurantId: 'r7', name: 'Green Smoothie', description: 'Spinach, banana, mango smoothie', price: 149, image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=300', category: 'Beverages', isVeg: true, isAvailable: true, rating: 4.4 },
  { id: 'f35', restaurantId: 'r7', name: 'Avocado Toast', description: 'Multigrain toast with avocado & seeds', price: 179, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300', category: 'Breakfast', isVeg: true, isAvailable: true, rating: 4.5 },

  // Tandoori Nights (r8)
  { id: 'f36', restaurantId: 'r8', name: 'Tandoori Chicken', description: 'Marinated chicken grilled in tandoor', price: 349, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300', category: 'Tandoori', isVeg: false, isAvailable: true, rating: 4.7 },
  { id: 'f37', restaurantId: 'r8', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 249, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300', category: 'Tandoori', isVeg: true, isAvailable: true, rating: 4.5 },
  { id: 'f38', restaurantId: 'r8', name: 'Rogan Josh', description: 'Kashmiri-style lamb curry', price: 399, image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=300', category: 'Main Course', isVeg: false, isAvailable: true, rating: 4.6 },
  { id: 'f39', restaurantId: 'r8', name: 'Malai Kofta', description: 'Fried paneer balls in creamy gravy', price: 279, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300', category: 'Main Course', isVeg: true, isAvailable: true, rating: 4.4 },
  { id: 'f40', restaurantId: 'r8', name: 'Gulab Jamun', description: 'Deep-fried milk dumplings in syrup', price: 99, image: 'https://images.unsplash.com/photo-1666190094762-b36988770349?w=300', category: 'Desserts', isVeg: true, isAvailable: true, rating: 4.8 },
];

// Mock Orders
export const mockOrders: Order[] = [
  { id: 'o1', userId: 'u1', restaurantId: 'r1', deliveryPartnerId: 'u4', items: [{ foodItemId: 'f1', name: 'Butter Chicken', price: 299, quantity: 2 }, { foodItemId: 'f3', name: 'Garlic Naan', price: 59, quantity: 4 }], status: 'delivered', totalAmount: 864, deliveryAddress: '42, MG Road, Bengaluru', paymentMethod: 'upi', paymentStatus: 'paid', createdAt: '2026-04-04T18:30:00', updatedAt: '2026-04-04T19:15:00' },
  { id: 'o2', userId: 'u1', restaurantId: 'r5', deliveryPartnerId: 'u7', items: [{ foodItemId: 'f21', name: 'Hyderabadi Chicken Biryani', price: 349, quantity: 1 }, { foodItemId: 'f25', name: 'Raita', price: 69, quantity: 1 }], status: 'out_for_delivery', totalAmount: 458, deliveryAddress: '42, MG Road, Bengaluru', paymentMethod: 'card', paymentStatus: 'paid', createdAt: '2026-04-05T12:00:00', updatedAt: '2026-04-05T12:45:00' },
  { id: 'o3', userId: 'u2', restaurantId: 'r4', deliveryPartnerId: 'u4', items: [{ foodItemId: 'f16', name: 'Margherita Pizza', price: 299, quantity: 1 }, { foodItemId: 'f19', name: 'Garlic Bread', price: 149, quantity: 1 }], status: 'preparing', totalAmount: 468, deliveryAddress: '15, Linking Road, Mumbai', paymentMethod: 'cod', paymentStatus: 'pending', createdAt: '2026-04-05T13:00:00', updatedAt: '2026-04-05T13:10:00' },
  { id: 'o4', userId: 'u2', restaurantId: 'r2', items: [{ foodItemId: 'f6', name: 'Masala Dosa', price: 129, quantity: 2 }, { foodItemId: 'f10', name: 'Filter Coffee', price: 49, quantity: 2 }], status: 'placed', totalAmount: 381, deliveryAddress: '15, Linking Road, Mumbai', paymentMethod: 'upi', paymentStatus: 'paid', scheduledTime: '2026-04-05T19:00:00', createdAt: '2026-04-05T14:00:00', updatedAt: '2026-04-05T14:00:00' },
  { id: 'o5', userId: 'u1', restaurantId: 'r3', deliveryPartnerId: 'u4', items: [{ foodItemId: 'f11', name: 'Hakka Noodles', price: 179, quantity: 1 }, { foodItemId: 'f13', name: 'Chilli Chicken', price: 249, quantity: 1 }], status: 'delivered', totalAmount: 463, deliveryAddress: '42, MG Road, Bengaluru', paymentMethod: 'upi', paymentStatus: 'paid', createdAt: '2026-04-03T19:00:00', updatedAt: '2026-04-03T19:45:00' },
];

// Mock Delivery Partners
export const mockDeliveryPartners: DeliveryPartner[] = [
  { id: 'dp1', userId: 'u4', name: 'Deepak Singh', phone: '+91 65432 10987', vehicleType: 'Bike', isAvailable: true, currentLocation: 'HSR Layout', totalEarnings: 45600, totalDeliveries: 342 },
  { id: 'dp2', userId: 'u7', name: 'Vikram Joshi', phone: '+91 77777 66666', vehicleType: 'Scooter', isAvailable: true, currentLocation: 'Koramangala', totalEarnings: 38900, totalDeliveries: 287 },
];

// Mock Reviews
export const mockReviews: Review[] = [
  { id: 'rv1', userId: 'u1', userName: 'Rahul Sharma', restaurantId: 'r1', orderId: 'o1', rating: 5, comment: 'Amazing butter chicken! Best I have had in Bengaluru.', createdAt: '2026-04-04T20:00:00' },
  { id: 'rv2', userId: 'u2', userName: 'Priya Patel', restaurantId: 'r4', orderId: 'o3', rating: 4, comment: 'Great pizza, slightly late delivery but food was hot.', createdAt: '2026-04-03T21:00:00' },
  { id: 'rv3', userId: 'u1', userName: 'Rahul Sharma', restaurantId: 'r3', orderId: 'o5', rating: 4, comment: 'Good noodles, but could use more spice.', createdAt: '2026-04-03T20:30:00' },
];

// Mock Offers
export const mockOffers: Offer[] = [
  { id: 'of1', restaurantId: 'r1', code: 'SPICE20', description: '20% off on orders above ₹500', discountPercent: 20, minOrder: 500, isActive: true, validUntil: '2026-04-30' },
  { id: 'of2', restaurantId: 'r4', code: 'PIZZA50', description: '₹50 off on all pizzas', discountPercent: 15, minOrder: 300, isActive: true, validUntil: '2026-04-15' },
  { id: 'of3', restaurantId: 'r5', code: 'BIRYANI10', description: '10% off on biryani orders', discountPercent: 10, minOrder: 200, isActive: true, validUntil: '2026-05-01' },
];

// Cuisine categories
export const cuisineCategories = [
  { name: 'North Indian', icon: '🍛', count: 2 },
  { name: 'South Indian', icon: '🥘', count: 1 },
  { name: 'Chinese', icon: '🥡', count: 1 },
  { name: 'Italian', icon: '🍕', count: 1 },
  { name: 'Mughlai', icon: '🍗', count: 1 },
  { name: 'Street Food', icon: '🌮', count: 1 },
  { name: 'Healthy', icon: '🥗', count: 1 },
];
