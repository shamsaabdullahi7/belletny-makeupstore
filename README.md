# Belletny Luxury Makeup Store

Belletny is a full-stack MERN e-commerce application for a luxury beauty brand. Customers can browse premium makeup products, create an account, manage their wishlist and shopping cart, securely place orders and track their purchases. Administrators can manage products and customer orders through a dedicated dashboard.

---

##  Features

### Customer Features

- User registration and login using JWT Authentication
- Browse makeup products
- Search products
- Filter by category and brand
- Sort products
- Product details page
- Shopping cart
- Wishlist
- Secure checkout
- M-Pesa STK Push payment integration
- View personal order history
- Responsive design

### Admin Features

- Admin dashboard
- View all customer orders
- Update order status
  - Processing
  - Shipped
  - Delivered
- Cancel/Delete customer orders
- Add new products
- Edit products
- Delete products
- Upload product images using Cloudinary

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary
- Daraja API (M-Pesa STK Push)

---

# 📁 Project Structure

```
belletny-makeupstore/

├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/shamsaabdullahi7/belletny-makeupstore.git
```

Navigate into the project

```bash
cd belletny-makeupstore
```

---

## Install Backend

```bash
cd backend

npm install

npm run dev
```

---

## Install Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=belletny

MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=your_callback_url
```

---

# 📡 API Endpoints

## Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

---

## Products

- GET `/api/products`
- GET `/api/products/:id`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

---

## Orders

- POST `/api/orders`
- GET `/api/orders/myorders`
- GET `/api/orders/:id`

### Admin

- GET `/api/orders`
- PUT `/api/orders/:id/status`
- PUT `/api/orders/:id/cancel`

---

## Payments

- POST `/api/payments/stkpush`

---

#  Admin Access

All newly registered users are standard users.

To make a user an administrator:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  {
    $set: {
      isAdmin: true,
    },
  }
);
```



#  Author

**Shamsa Abdullahi**

GitHub

https://github.com/shamsaabdullahi7

---

