# Vendor-Buddy API Documentation

This document provides comprehensive documentation for the Vendor-Buddy REST API.

## Base URL

```
http://localhost:8080/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "data": {}, // Response data
  "message": "Success", // Optional message
  "error": null // Error details if any
}
```

## Error Responses

```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user (vendor or supplier).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "VENDOR", // or "SUPPLIER"
  "phoneNumber": "9876543210",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "New Delhi, India"
  }
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "VENDOR",
    "phoneNumber": "9876543210",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090,
      "address": "New Delhi, India"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "User registered successfully"
}
```

### Login User

**POST** `/auth/login`

Authenticate a user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "VENDOR"
  },
  "message": "Login successful"
}
```

### Get Current User

**GET** `/auth/me`

Get the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "VENDOR",
  "phoneNumber": "9876543210",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "New Delhi, India"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update Profile

**PUT** `/auth/me`

Update the current user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phoneNumber": "9876543211",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "Updated Address"
  }
}
```

---

## Products Endpoints

### Get All Products

**GET** `/products`

Get a paginated list of products with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)
- `search` (optional): Search term
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `sortBy` (optional): Sort field (default: "name")
- `sortDir` (optional): Sort direction (default: "asc")

**Example:**
```
GET /products?page=0&size=10&search=onions&category=Vegetables&minPrice=20&maxPrice=100
```

**Response:**
```json
{
  "products": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Fresh Onions",
      "category": "Vegetables",
      "unitPrice": 50.0,
      "unitType": "kg",
      "stock": 100,
      "deliveryRange": 10,
      "imageUrl": "https://example.com/onions.jpg",
      "description": "Fresh red onions",
      "supplierId": "507f1f77bcf86cd799439012",
      "rating": 4.5,
      "reviewCount": 25,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "currentPage": 0,
  "totalItems": 150,
  "totalPages": 15
}
```

### Get Product by ID

**GET** `/products/{id}`

Get a specific product by its ID.

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Fresh Onions",
  "category": "Vegetables",
  "unitPrice": 50.0,
  "unitType": "kg",
  "stock": 100,
  "deliveryRange": 10,
  "imageUrl": "https://example.com/onions.jpg",
  "description": "Fresh red onions",
  "supplierId": "507f1f77bcf86cd799439012",
  "rating": 4.5,
  "reviewCount": 25,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Create Product (Supplier Only)

**POST** `/products`

Create a new product (requires SUPPLIER role).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Fresh Tomatoes",
  "category": "Vegetables",
  "unitPrice": 40.0,
  "unitType": "kg",
  "stock": 200,
  "deliveryRange": 15,
  "imageUrl": "https://example.com/tomatoes.jpg",
  "description": "Fresh red tomatoes"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "name": "Fresh Tomatoes",
  "category": "Vegetables",
  "unitPrice": 40.0,
  "unitType": "kg",
  "stock": 200,
  "deliveryRange": 15,
  "imageUrl": "https://example.com/tomatoes.jpg",
  "description": "Fresh red tomatoes",
  "supplierId": "507f1f77bcf86cd799439012",
  "rating": 0.0,
  "reviewCount": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update Product (Supplier Only)

**PUT** `/products/{id}`

Update an existing product (requires SUPPLIER role).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Updated Tomatoes",
  "unitPrice": 45.0,
  "stock": 150
}
```

### Delete Product (Supplier Only)

**DELETE** `/products/{id}`

Delete a product (requires SUPPLIER role).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

### Get Products by Supplier

**GET** `/products/supplier/{supplierId}`

Get all products for a specific supplier.

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Fresh Onions",
    "category": "Vegetables",
    "unitPrice": 50.0,
    "unitType": "kg",
    "stock": 100,
    "deliveryRange": 10,
    "imageUrl": "https://example.com/onions.jpg",
    "description": "Fresh red onions",
    "supplierId": "507f1f77bcf86cd799439012",
    "rating": 4.5,
    "reviewCount": 25,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

---

## Orders Endpoints

### Get Orders

**GET** `/orders`

Get a paginated list of orders for the current user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)
- `status` (optional): Filter by order status

**Response:**
```json
{
  "orders": [
    {
      "id": "507f1f77bcf86cd799439011",
      "productId": "507f1f77bcf86cd799439012",
      "vendorId": "507f1f77bcf86cd799439013",
      "supplierId": "507f1f77bcf86cd799439014",
      "quantity": 10,
      "totalAmount": 500.0,
      "status": "PENDING",
      "estimatedDeliveryTime": "2024-01-01T04:00:00Z",
      "actualDeliveryTime": null,
      "deliveryAddress": "123 Main St, New Delhi",
      "notes": "Please deliver in the morning",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "currentPage": 0,
  "totalItems": 50,
  "totalPages": 5
}
```

### Get Order by ID

**GET** `/orders/{id}`

Get a specific order by its ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "productId": "507f1f77bcf86cd799439012",
  "vendorId": "507f1f77bcf86cd799439013",
  "supplierId": "507f1f77bcf86cd799439014",
  "quantity": 10,
  "totalAmount": 500.0,
  "status": "PENDING",
  "estimatedDeliveryTime": "2024-01-01T04:00:00Z",
  "actualDeliveryTime": null,
  "deliveryAddress": "123 Main St, New Delhi",
  "notes": "Please deliver in the morning",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Create Order (Vendor Only)

**POST** `/orders`

Create a new order (requires VENDOR role).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439012",
  "supplierId": "507f1f77bcf86cd799439014",
  "quantity": 10,
  "deliveryAddress": "123 Main St, New Delhi",
  "notes": "Please deliver in the morning"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "productId": "507f1f77bcf86cd799439012",
  "vendorId": "507f1f77bcf86cd799439013",
  "supplierId": "507f1f77bcf86cd799439014",
  "quantity": 10,
  "totalAmount": 500.0,
  "status": "PENDING",
  "estimatedDeliveryTime": "2024-01-01T04:00:00Z",
  "actualDeliveryTime": null,
  "deliveryAddress": "123 Main St, New Delhi",
  "notes": "Please deliver in the morning",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update Order Status

**PUT** `/orders/{id}/status`

Update the status of an order.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `status`: New order status (PENDING, ACCEPTED, REJECTED, IN_TRANSIT, DELIVERED, CANCELLED)

**Example:**
```
PUT /orders/507f1f77bcf86cd799439011/status?status=ACCEPTED
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "productId": "507f1f77bcf86cd799439012",
  "vendorId": "507f1f77bcf86cd799439013",
  "supplierId": "507f1f77bcf86cd799439014",
  "quantity": 10,
  "totalAmount": 500.0,
  "status": "ACCEPTED",
  "estimatedDeliveryTime": "2024-01-01T04:00:00Z",
  "actualDeliveryTime": null,
  "deliveryAddress": "123 Main St, New Delhi",
  "notes": "Please deliver in the morning",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T01:00:00Z"
}
```

### Get Order Analytics (Supplier Only)

**GET** `/orders/analytics`

Get analytics data for the current supplier (requires SUPPLIER role).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "totalOrders": 150,
  "totalRevenue": 75000.0,
  "pendingOrders": 25,
  "completedOrders": 120,
  "ordersPerDay": {
    "2024-01-01": 15,
    "2024-01-02": 20,
    "2024-01-03": 18
  }
}
```

---

## Analytics Endpoints

### Get Demand Trends

**GET** `/analytics/demand-trends`

Get demand analytics data.

**Response:**
```json
{
  "weeklyDemand": {
    "Onions": [150, 180, 200, 175, 190, 210, 195],
    "Tomatoes": [200, 220, 250, 230, 240, 260, 245],
    "Potatoes": [300, 320, 350, 330, 340, 360, 345]
  },
  "topProducts": [
    {
      "name": "Onions",
      "quantity": 1300,
      "revenue": 65000.0
    },
    {
      "name": "Tomatoes",
      "quantity": 1645,
      "revenue": 82300.0
    }
  ],
  "revenueTrends": [
    {
      "date": "2024-01-01",
      "revenue": 45000.0
    },
    {
      "date": "2024-01-02",
      "revenue": 52000.0
    }
  ]
}
```

### Get Price Predictions

**GET** `/analytics/price-predictions`

Get price prediction data.

**Response:**
```json
{
  "predictions": [
    {
      "productName": "Onions",
      "currentPrice": 50.0,
      "predictedPrice": 52.5,
      "trend": "increasing",
      "confidence": 85
    },
    {
      "productName": "Tomatoes",
      "currentPrice": 40.0,
      "predictedPrice": 38.0,
      "trend": "decreasing",
      "confidence": 78
    }
  ],
  "lastUpdated": "2024-01-01"
}
```

---

## Price Trends Endpoints

### Get Price Trends for Product

**GET** `/price-trends/{productId}`

Get historical price data for a specific product.

**Response:**
```json
{
  "productId": "onions",
  "productName": "Onions",
  "priceHistory": [
    {
      "date": "2024-01-01",
      "price": 45.5,
      "volume": 750
    },
    {
      "date": "2024-01-02",
      "price": 47.2,
      "volume": 800
    }
  ],
  "currentPrice": 50.0,
  "averagePrice": 48.5,
  "priceChange": 10.5
}
```

### Compare Price Trends

**GET** `/price-trends/compare/{productIds}`

Compare price trends for multiple products.

**Example:**
```
GET /price-trends/compare/onions,tomatoes,potatoes
```

**Response:**
```json
{
  "onions": {
    "productName": "Onions",
    "priceHistory": [
      {
        "date": "2024-01-01",
        "price": 45.5
      }
    ],
    "currentPrice": 50.0
  },
  "tomatoes": {
    "productName": "Tomatoes",
    "priceHistory": [
      {
        "date": "2024-01-01",
        "price": 40.0
      }
    ],
    "currentPrice": 42.0
  }
}
```

---

## Data Models

### User Model

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string (hidden in responses)",
  "role": "VENDOR | SUPPLIER",
  "location": {
    "latitude": "number",
    "longitude": "number",
    "address": "string"
  },
  "phoneNumber": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Product Model

```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "unitPrice": "number",
  "unitType": "string (kg, litre, piece, etc.)",
  "stock": "number",
  "deliveryRange": "number (in kilometers)",
  "imageUrl": "string",
  "description": "string",
  "supplierId": "string",
  "rating": "number",
  "reviewCount": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Order Model

```json
{
  "id": "string",
  "productId": "string",
  "vendorId": "string",
  "supplierId": "string",
  "quantity": "number",
  "totalAmount": "number",
  "status": "PENDING | ACCEPTED | REJECTED | IN_TRANSIT | DELIVERED | CANCELLED",
  "estimatedDeliveryTime": "datetime",
  "actualDeliveryTime": "datetime",
  "deliveryAddress": "string",
  "notes": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Other endpoints**: 100 requests per minute per user

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (0-based)
- `size`: Number of items per page (max 100)

Response includes pagination metadata:

```json
{
  "data": [...],
  "currentPage": 0,
  "totalItems": 150,
  "totalPages": 15,
  "hasNext": true,
  "hasPrevious": false
}
```

---

## WebSocket Support

For real-time features, the API supports WebSocket connections:

**Connection URL:**
```
ws://localhost:8080/ws
```

**Events:**
- `order.update`: Order status updates
- `product.update`: Product updates
- `notification`: General notifications

**Authentication:**
Include JWT token in the connection URL:
```
ws://localhost:8080/ws?token=<jwt-token>
```

---

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install vendor-buddy-sdk
```

```javascript
import { VendorBuddyAPI } from 'vendor-buddy-sdk';

const api = new VendorBuddyAPI({
  baseURL: 'http://localhost:8080/api',
  token: 'your-jwt-token'
});

// Get products
const products = await api.products.getAll();

// Create order
const order = await api.orders.create({
  productId: 'product-id',
  quantity: 10
});
```

### Python

```bash
pip install vendor-buddy-python
```

```python
from vendor_buddy import VendorBuddyAPI

api = VendorBuddyAPI(
    base_url='http://localhost:8080/api',
    token='your-jwt-token'
)

# Get products
products = api.products.get_all()

# Create order
order = api.orders.create({
    'product_id': 'product-id',
    'quantity': 10
})
```

---

## Support

For API support and questions:

- **Documentation**: [https://docs.vendorbuddy.com](https://docs.vendorbuddy.com)
- **Email**: api-support@vendorbuddy.com
- **GitHub Issues**: [https://github.com/vendorbuddy/api/issues](https://github.com/vendorbuddy/api/issues)