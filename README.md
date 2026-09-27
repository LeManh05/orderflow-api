# OrderFlow API

OrderFlow API là một RESTful API backend cho hệ thống bán hàng, được xây dựng bằng Node.js, Express và MongoDB.

Project tập trung vào các chức năng chính:

- Authentication & Authorization
- User management
- Product management
- Shopping cart
- Checkout & Order
- Customer Order Management
- Admin Order Management
- Order status lifecycle
- Validation & Error Handling

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- Postman

---

## Project Structure

```text
orderflow-api/
├── src/
│   ├── controllers/
│   │   ├── cart.js
│   │   ├── order.js
│   │   ├── product.js
│   │   └── user.js
│   │
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── role.js
│   │
│   ├── models/
│   │   ├── cart.js
│   │   ├── order.js
│   │   ├── product.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── order.js
│   │   ├── product.js
│   │   └── admin-order.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## How to install

Clone repository:

```bash
git clone https://github.com/LeManh05/orderflow-api.git
cd orderflow-api
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/orderflow
JWT_SECRET=your_jwt_secret
```

---

## How to run

Start the server:

```bash
npm start
```

The API will run at:

```text
http://localhost:3000
```

Health check:

```http
GET /api/health
```

---

## API Documentation

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Customer/Admin |
| GET | `/auth/admin` | Admin |

### Products

| Method | Endpoint | Access |
|---|---|---|
| POST | `/products/create` | Admin |
| GET | `/products` | Authenticated |
| GET | `/products/:id` | Authenticated |
| PATCH | `/products/update/:id` | Admin |
| DELETE | `/products/delete/:id` | Admin |

### Cart

| Method | Endpoint | Access |
|---|---|---|
| POST | `/cart/items` | Authenticated |
| GET | `/cart` | Authenticated |
| PATCH | `/cart/items/:productId` | Authenticated |
| DELETE | `/cart/items/:productId` | Authenticated |
| DELETE | `/cart` | Authenticated |

### Customer Orders

| Method | Endpoint | Access |
|---|---|---|
| POST | `/order/create` | Customer |
| GET | `/order` | Customer |
| GET | `/order/:id` | Customer |
| PATCH | `/order/:id/cancel` | Customer |

### Admin Orders

| Method | Endpoint | Access |
|---|---|---|
| GET | `/admin/order` | Admin |
| GET | `/admin/order/:id` | Admin |
| PATCH | `/admin/order/:id/status` | Admin |

---

## Database Design

### User

| Field | Type | Description |
|---|---|---|
| name | String | User name |
| email | String | Unique email |
| password | String | Hashed password |
| role | String | `customer` or `admin` |

### Product

| Field | Type | Description |
|---|---|---|
| name | String | Product name |
| description | String | Product description |
| price | Number | Product price |
| stock | Number | Available stock |
| isActive | Boolean | Product active status |

### Cart

| Field | Type | Description |
|---|---|---|
| customer | ObjectId | Reference to User |
| items | Array | Products and quantities |

Each cart item contains:

- `product`: Reference to Product
- `quantity`: Product quantity

### Order

| Field | Type | Description |
|---|---|---|
| customer | ObjectId | Reference to User |
| items | Array | Ordered products |
| totalPrice | Number | Total order price |
| status | String | Order status |

Each order item contains:

- `product`: Reference to Product
- `quantity`: Ordered quantity
- `price`: Product price snapshot

---

## Business Rules

### Authentication

- User registers with name, email and password.
- Email must be unique.
- Password is hashed before storing.
- Login returns a JWT token.
- Protected APIs require a valid JWT token.
- Admin APIs require the user to have `admin` role.

### Product

- Product must have name, price and stock.
- Only Admin can create, update and delete products.
- Inactive products cannot be added to cart or ordered.
- Product stock cannot be exceeded when adding to cart or creating an order.

### Cart

- Each customer has their own cart.
- Adding the same product increases its quantity.
- Cart quantity must be greater than 0.
- Cart quantity cannot exceed product stock.

### Order

- Customer can only create an order from their cart.
- Cart cannot be empty when creating an order.
- Product must exist and be active.
- Product stock is decreased when an order is created.
- The product price is stored as a snapshot in the order.
- Cart is deleted after successful order creation.

### Order Status

Order status follows:

`pending → confirmed → shipping → completed`

Customer can cancel an order only when its status is:

`pending → cancelled`

When an order is cancelled, the product stock is restored.

### Order Authorization

- Customer can only view their own orders.
- Customer cannot access Admin Order APIs.
- Only Admin can update order status.