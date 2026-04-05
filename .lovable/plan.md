

# 🍕 Food Delivery System — Full MVP Plan

## Design System
- **Theme:** Dark backgrounds (#0a0a0a / #111) with neon accent colors (green #22c55e for success/delivery, orange #f97316 for food/CTA, cyan #06b6d4 for info)
- **Currency:** Indian Rupees (₹) throughout
- **Typography:** Clean sans-serif, bold headings, subtle glow effects on key elements
- **Cards:** Glass-morphism style with subtle borders and hover glow effects
- **Animations:** Smooth page transitions, hover effects, loading states

## Auth & Role System (Mock)
- Login/Register pages with role selection (Customer, Restaurant Owner, Delivery Partner, Admin)
- Mock JWT auth stored in React context
- Role-based routing — same app, different dashboards based on role
- Role switcher in navbar for demo purposes

## Pages & Features

### 🔑 Auth Pages
- **Login** — email/password with role indicator
- **Register** — sign up with role selection

### 👤 Customer Pages
1. **Home** — Featured restaurants, cuisine categories, search bar
2. **Restaurant List** — Filter by cuisine, rating, location; grid cards with images
3. **Restaurant Detail** — Menu with food items (image, description, price in ₹), add to cart
4. **Cart** — Items list, quantity controls, total calculation
5. **Checkout** — Address, payment method (UPI/Card/COD), order scheduling (date/time picker)
6. **Order Tracking** — Order status timeline (Ordered → Preparing → Out for Delivery → Delivered)
7. **Order History** — Past orders with reorder option
8. **Ratings & Reviews** — Rate restaurant and delivery after order
9. **Favorites** — Saved restaurants/items

### 🍽️ Restaurant Owner Pages
1. **Dashboard** — Sales overview, today's orders count, revenue chart
2. **Menu Management** — Add/edit/delete food items with images and prices
3. **Orders Received** — Live incoming orders, accept/reject buttons, status updates
4. **Offers & Discounts** — Create/manage discount codes
5. **Restaurant Profile** — Edit restaurant info, hours, location

### 🚴 Delivery Partner Pages
1. **Dashboard** — Active deliveries, today's earnings
2. **Assigned Orders** — List of orders with pickup/delivery addresses
3. **Delivery Detail** — Full address, map placeholder, customer contact, status update buttons (Picked Up / Delivered)
4. **Earnings** — Earnings history, daily/weekly/monthly breakdown

### 🧑‍💼 Admin Pages
1. **Dashboard** — System overview: total users, orders, revenue, active restaurants
2. **User Management** — View/manage all users by role
3. **Restaurant Management** — Approve/suspend restaurants
4. **Order Management** — View all orders, filter by status
5. **Analytics** — Charts for popular items, peak hours, order trends

## Mock Data
- 8-10 restaurants with Indian cuisine variety
- 5-6 food items per restaurant with images (placeholder)
- Sample orders, users, delivery partners
- Realistic Indian pricing (₹99 - ₹599 range)

## Key UI Elements
- Neon-glow buttons and active states
- Animated order status timeline
- Glass-morphism cards with subtle gradients
- Responsive sidebar navigation for dashboards
- Mobile-friendly bottom navigation for customer app
- Dark/light mode toggle (dark default)

## Component Architecture
- Shared layout components (Navbar, Sidebar, Footer)
- Role-based route guards
- Reusable food card, order card, stat card components
- Context providers for auth, cart, and orders

