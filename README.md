# Vendor Buddy

This repository contains the source code for Vendor Buddy, a web-based solution designed to help Indian street food vendors source raw materials reliably, affordably, and easily. The project addresses a specific pain point in the supply chain for street food vendors by providing a functional, user-centric digital product.

## Team Members
- [MHDGouse](https://github.com/MHDGouse)
- [Samad1909](https://github.com/Samad1909)
- [idris10215](https://github.com/idris10215)

## About the Project
Vendor Buddy is a platform that connects street food vendors with reliable suppliers, streamlining the procurement process for essential raw materials. The application is built with a focus on usability, reliability, and affordability, ensuring that vendors can easily manage their supply needs and suppliers can efficiently reach their target market.

### Key Features
- **User Authentication:** Secure login and registration for vendors and suppliers.
- **Supplier Dashboard:** Suppliers can add, manage, and track their products and orders.
- **Vendor Dashboard:** Vendors can browse products, place orders, and track deliveries.
- **Product Management:** Add, edit, and view products with real-time inventory updates.
- **Order Management:** Place and manage orders, view order history, and track order status.
- **Analytics:** Insights into sales, demand trends, and supply chain performance.
- **Role-Based Access:** Different interfaces and permissions for vendors and suppliers.
- **Responsive Design:** Works seamlessly on both desktop and mobile devices.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Java 17+](https://adoptopenjdk.net/) (for backend)
- [Maven](https://maven.apache.org/) (for backend)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Backend Setup

#### Windows & macOS
1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies and build the project:
   ```sh
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```sh
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080` by default.

### Frontend Setup

#### Windows & macOS
1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```
   The frontend will start on `http://localhost:5173` by default.

### Docker (Optional)
You can use Docker Compose to run both frontend and backend services:

```sh
cd <project-root>
docker-compose up --build
```

## License
This project is for educational and demonstration purposes.
