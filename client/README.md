# My Catalog App - Application Structure

## 📁 Directory Structure

### 📁 `client/`
Client directory - React application

#### 📁 `src/`
Source code directory

##### 📁 `components/`
Shared React components
- `Layout.js` - General application layout component
- `Layout.module.css` - Layout styles
- `ProductCard.js` - Shared product card component
- `ProductCard.module.css` - Product card styles

##### 📁 `context/`
React contexts
- `AuthContext.js` - Manages authentication and permissions state

##### 📁 `pages/`
Application pages
- `Home.js` - Home page
- `Login.js` - Login page
- `Register.js` - Registration page
- `Products.js` - Products list page
- `ProductDetails.js` - Product details page
- `Profile.js` - User profile page
- `AdminDashboard.js` - Admin dashboard
- `EditProducts.js` - Product editing page
- `DeleteProducts.js` - Product deletion page
- `Users.js` - User management page

##### 📁 `api/`
API configurations
- `index.js` - Basic Axios configurations
- `auth.js` - Authentication API functions
- `products.js` - Products API functions
- `users.js` - Users API functions

##### 📁 `utils/`
Helper functions
- `auth.js` - Authentication helper functions
- `validation.js` - Validation functions

##### 📁 `styles/`
Global styles
- `global.css` - General application styles

##### 📄 Main files
- `App.js` - Main component
- `index.js` - Entry point
- `routes.js` - Route definitions

#### 📁 `public/`
Static files
- `index.html` - Main HTML file
- `favicon.ico` - Application icon
- `manifest.json` - PWA configurations

#### 📄 Configuration files
- `package.json` - Dependencies and settings
- `.env` - Environment variables
- `.gitignore` - Git settings

## 🔧 Functionality

### 🔐 Authentication
- User login
- New user registration
- Permission management

### 📦 Products
- Display product list
- View product details
- Add new products
- Edit existing products
- Delete products

### 👥 Users
- User profile management
- User management (admin)
- User status updates

## 🎨 Design
- Modern and clean design
- Full Hebrew language support
- Mobile-responsive display
- Smooth animations

## 🔒 Security
- JWT-based authentication
- Role-based permissions
- XSS and CSRF protection
- User input validation

## 🚀 Technologies
- React.js
- Node.js
- Express.js
- PostgreSQL
- JWT
- Axios
- CSS Modules

## 📝 Installation Instructions

1. Install dependencies:
```bash
cd client
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit the .env file with appropriate settings
```

3. Run the application:
```bash
npm start
```

## 🔍 Testing
- Unit tests
- Integration tests
- UI tests

## 📦 Deployment
```bash
npm run build
```

## 📚 Documentation
- Detailed code documentation
- API documentation
- User usage instructions

## 🤝 Contributing
Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details. 