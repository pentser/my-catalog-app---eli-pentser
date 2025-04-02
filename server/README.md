# Server Structure Documentation

## 📁 Directory Structure

### 📁 `src/`
Server source code directory

#### 📁 `controllers/`
- `authController.js` - Authentication logic
- `productController.js` - Products management logic
- `userController.js` - Users management logic

#### 📁 `models/`
- `User.js` - User data model
- `Product.js` - Product data model
- `Category.js` - Category data model

#### 📁 `routes/`
- `auth.js` - Authentication routes
- `products.js` - Products routes
- `users.js` - Users routes

#### 📁 `middleware/`
- `auth.js` - Token authentication middleware
- `validation.js` - Validation middleware
- `errorHandler.js` - Error handling

#### 📁 `config/`
- `database.js` - Database connection settings
- `jwt.js` - JWT configurations
- `cors.js` - CORS settings

#### 📁 `utils/`
- `validation.js` - Validation helper functions
- `helpers.js` - General utility functions
- `logger.js` - Logging system

### Main Files
- `server.js` or `index.js` - Server entry point
- `package.json` - Dependencies and settings
- `.env` - Environment variables
- `.gitignore` - Git ignore configurations

## Core Functionality

### 1. Authentication and Security
- User registration
- Login and token generation
- Permission verification
- JWT implementation
- Password encryption
- Session management

### 2. Product Management
- Create new products
- Read product details
- Update existing products
- Delete products
- Search functionality
- Filtering and sorting
- Category management

### 3. User Management
- User CRUD operations
- Role-based access control
- Profile management
- User preferences
- Activity logging

### 4. Security Features
- Password hashing with bcrypt
- JWT token validation
- XSS protection
- CSRF protection
- Input sanitization
- Rate limiting
- Request validation

### 5. Database Operations
- Monodb connection management
- Query optimization
- Transaction handling
- Data modeling
- Migration management
- Backup procedures

## API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/verify
POST   /api/auth/refresh-token
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Users
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/profile
PUT    /api/users/profile
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

## Error Handling
The server implements a centralized error handling system with custom error classes:
- `AppError` - Base error class
- `ValidationError` - For validation errors
- `AuthenticationError` - For auth-related errors
- `NotFoundError` - For 404 errors

## Logging
- Request logging using Morgan
- Error logging with Winston
- Activity logging for critical operations

## Testing
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "Auth"

# Run with coverage
npm run test:coverage
```

## Production Considerations
- Enable CORS protection
- Set up rate limiting
- Configure proper SSL/TLS
- Set up monitoring
- Configure proper logging
- Set up backup strategy

## Dependencies
Core dependencies include:
- `express` - Web framework
- `jsonwebtoken` - JWT implementation
- `bcryptjs` - Password hashing
- `cors` - CORS middleware
- `dotenv` - Environment configuration
- `joi` - Validation
