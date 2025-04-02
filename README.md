# Product Management API

## Overview
An API use for managing Product, Cart and Order.

## Tech Stack
### Backend
- **Runtime**: Node.js
- **Framework**: Express with Typescript
- **Library in use**: cookie-parser, jsonwebtoken, bcrypt, mongoose


## Documentation
- [API Documentation](./API.md) - Detailed  API endpoints and usage

## Project Features
- Role Based Authentication and Authorization with JWT
- Product Management
- Cart Management
- Order Management

## API Endpoints

### Authentication

1. **Register User**:
- `POST /api/auth/register-user`
2. **Register Admin**:
- `POST /api/auth/register-admin`
3. **Login Users**:
- `POST /api/auth/login`
4. **Logout Users**:
- `POST /api/auth/logout`

### Product 
1. **Get all Product List**
- `GET /api/products/`
2. **Get Product By Id**
- `GET /api/products/:id`
3. **Create Product**
- `POST /api/products/`
4. **Update Product**
- `PUT /api/products/:id`
5. **Delete Product**
- `DELETE /api/products/:id`

### Cart (Not yet done)
### Order (Not yet done)

## Getting Started
Follow these steps to setup and run the project:
### Running the Application
1. Clone the Repository(if you haven't already):
```bash
git clone https://github.com/uniquemj/Product-Management-API.git
```
2. Install the required dependencies:
```bash
npm install
```
3. Set Up few dependencies in .env
```js
PORT=<Your_PORT>
MONGODB_URL=<YOUR_MONGODB_URL>
JWT_SECRET_KEY=<YOUR_JWT_SECRET_KEY>
```
4. To use this project
- To run typescript in watch mode:
```bash
npm run build
```
- Open another new terminal and run following command to run project:
```bash
npm run start
```

