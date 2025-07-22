# GidiMart - Secure E-Commerce Platform

GidiMart is a comprehensive cross-platform mobile e-commerce application built with React Native Expo and Node.js. It features advanced security with escrow protection, flexible installment payments, KYC verification, and is specifically designed for emerging markets like Nigeria.

## 🚀 Features

### Core Features
- **Escrow Protection**: Secure transactions with funds held until delivery confirmation
- **Installment Payments**: Flexible daily, weekly, or monthly payment plans
- **KYC Verification**: Comprehensive identity verification for sellers and buyers
- **Multi-user Support**: Buyers, sellers, and proxy sellers with role-based permissions
- **Real-time Tracking**: Order and delivery tracking with logistics integration
- **In-app Wallet**: Secure digital wallet with transaction history

### Security Features
- **Bank-level Security**: JWT authentication with bcrypt password hashing
- **Rate Limiting**: Protection against API abuse and DDoS attacks
- **Data Encryption**: Secure data transmission and storage
- **Two-factor Authentication**: Biometric and SMS-based 2FA support

### Business Features
- **Product Management**: Comprehensive product listings with categories
- **Order Management**: Complete order lifecycle management
- **Payment Processing**: Integration with Paystack, Flutterwave, and other gateways
- **Dispute Resolution**: Built-in dispute management system
- **Analytics Dashboard**: Sales analytics and reporting
- **Referral Program**: User referral system with rewards

## 🏗️ Architecture

### Frontend (React Native Expo)
- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router with tab-based navigation
- **UI Components**: Custom component library with Lucide React Native icons
- **State Management**: React hooks and context
- **Styling**: StyleSheet with responsive design

### Backend (Node.js)
- **Framework**: Express.js with comprehensive middleware
- **Database**: PostgreSQL with advanced schema design
- **Authentication**: JWT tokens with refresh token support
- **Payment Integration**: Paystack, Flutterwave, and local payment methods
- **File Storage**: AWS S3 integration for images and documents
- **API Documentation**: RESTful API with comprehensive endpoints

## 📱 Screens & Features

### Authentication
- Login/Signup with email/phone
- Biometric authentication
- KYC verification flow
- Password recovery

### Home & Discovery
- Featured products showcase
- Category browsing
- Advanced search and filters
- Wishlist functionality

### Shopping Experience
- Product details with image gallery
- Reviews and ratings
- Price negotiation for used items
- Installment calculator

### Order Management
- Order tracking with real-time updates
- Delivery status and ETA
- Order history and receipts
- Dispute filing and resolution

### Wallet & Payments
- Wallet balance and transaction history
- Multiple payment method support
- Installment payment tracking
- Escrow status monitoring

### User Profile
- Profile management
- KYC status and documents
- Seller dashboard and analytics
- Referral program tracking

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Expo CLI
- React Native development environment

### Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# For iOS
npm run ios

# For Android
npm run android
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
createdb gidimart
psql -d gidimart -f database/schema.sql

# Start the server
npm run dev
```

### Database Setup
```bash
# Create PostgreSQL database
createdb gidimart

# Run migrations
psql -d gidimart -f server/database/schema.sql

# Optional: Add sample data
psql -d gidimart -f server/database/seed.sql
```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

- **Database**: PostgreSQL connection string
- **JWT**: Secret key for token signing
- **Payment Gateways**: API keys for payment providers
- **File Storage**: AWS S3 or Cloudinary configuration
- **SMS/Email**: Twilio and SendGrid API keys
- **Maps**: Google Maps API key for location services

### Payment Integration
Currently supports:
- **Paystack**: Nigerian payment gateway
- **Flutterwave**: Multi-country African payment gateway
- **Bank Transfer**: Direct bank transfer integration
- **Wallet**: In-app wallet system

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with:
- User management with KYC support
- Product catalog with categories
- Order management with status tracking
- Payment processing with installments
- Escrow transaction handling
- Reviews and ratings system
- Dispute resolution workflow
- Wallet and transaction tracking

Key tables:
- `users` - User profiles and KYC data
- `products` - Product catalog
- `orders` - Order management
- `payments` - Payment tracking
- `escrow_transactions` - Escrow handling
- `reviews` - Rating system
- `disputes` - Dispute management

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Biometric authentication support
- Session management and timeout

### Data Protection
- bcrypt password hashing with salt rounds
- HTTPS enforcement in production
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization
- CORS configuration for API security

### Financial Security
- PCI DSS compliance for payment handling
- Escrow system for transaction protection
- Two-factor authentication for financial operations
- Transaction monitoring and fraud detection

## 📈 Performance & Scalability

### Optimization
- Database indexing for faster queries
- API response caching with Redis
- Image optimization and CDN integration
- Lazy loading for mobile performance

### Scalability
- Horizontal scaling support
- Database read replicas
- Load balancer configuration
- Microservices architecture ready

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server && npm test

# Run end-to-end tests
npm run e2e
```

## 🚀 Deployment

### Frontend Deployment
- **Expo**: Build and deploy with EAS Build
- **iOS**: App Store deployment with TestFlight
- **Android**: Google Play Store with Play Console

### Backend Deployment
- **Heroku**: Easy deployment with Postgres add-on
- **AWS**: EC2 with RDS and S3 integration
- **Docker**: Containerized deployment support

## 📚 API Documentation

The API provides comprehensive endpoints for:
- Authentication and user management
- Product catalog and search
- Order processing and tracking
- Payment and escrow handling
- Wallet and transaction management
- KYC and verification workflows

Base URL: `https://api.gidimart.com/v1`

Key endpoints:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /products` - Product listing
- `POST /orders` - Create order
- `POST /payments/process` - Process payment
- `GET /wallet/balance` - Wallet balance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the excellent React Native framework
- Nigerian fintech ecosystem for payment integration guidance
- Open source community for various libraries and tools used

## 📞 Support

For support and questions:
- Email: support@gidimart.com
- Documentation: https://docs.gidimart.com
- Community: https://community.gidimart.com

---

Built with ❤️ for the Nigerian market and emerging economies worldwide.