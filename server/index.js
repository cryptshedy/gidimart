const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/gidimart',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, userType } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !userType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash, user_type, kyc_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, user_type`,
      [firstName, lastName, email, phone, hashedPassword, userType, 'pending']
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.rows[0].id, 
        email: newUser.rows[0].email,
        userType: newUser.rows[0].user_type
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        userType: newUser.rows[0].user_type
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Social Authentication
app.post('/api/auth/social', async (req, res) => {
  try {
    const { provider, code } = req.body;

    if (!provider || !code) {
      return res.status(400).json({ error: 'Provider and code are required' });
    }

    let userInfo;
    
    try {
      switch (provider) {
        case 'google':
          userInfo = await getGoogleUserInfo(code);
          break;
        case 'facebook':
          userInfo = await getFacebookUserInfo(code);
          break;
        case 'instagram':
          userInfo = await getInstagramUserInfo(code);
          break;
        default:
          return res.status(400).json({ error: 'Invalid provider' });
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      return res.status(400).json({ error: `Failed to authenticate with ${provider}` });
    }

    if (!userInfo || !userInfo.email) {
      return res.status(400).json({ error: 'Failed to get user information' });
    }

    // Check if user exists
    let user = await pool.query(
      'SELECT id, email, first_name, last_name, user_type, kyc_status FROM users WHERE email = $1',
      [userInfo.email]
    );

    if (user.rows.length === 0) {
      // Create new user from social login
      const newUser = await pool.query(
        `INSERT INTO users (first_name, last_name, email, phone, password_hash, user_type, kyc_status, profile_image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, first_name, last_name, user_type, kyc_status`,
        [
          userInfo.firstName || userInfo.name?.split(' ')[0] || 'User',
          userInfo.lastName || userInfo.name?.split(' ').slice(1).join(' ') || '',
          userInfo.email,
          userInfo.phone || '',
          '', // No password for social login
          'buyer', // Default to buyer
          'pending',
          userInfo.picture || null
        ]
      );
      user.rows = newUser.rows;
    }

    const userData = user.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email,
        userType: userData.user_type
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Social authentication successful',
      token,
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        userType: userData.user_type,
        kycStatus: userData.kyc_status
      }
    });
  } catch (error) {
    console.error('Social auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions for social authentication
async function getGoogleUserInfo(code) {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn('Google OAuth credentials not configured');
      throw new Error('Google authentication not available');
    }
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return {
      email: userResponse.data.email,
      firstName: userResponse.data.given_name,
      lastName: userResponse.data.family_name,
      name: userResponse.data.name,
      picture: userResponse.data.picture,
    };
  } catch (error) {
    console.error('Google auth error:', error);
    throw new Error('Google authentication failed');
  }
}

async function getFacebookUserInfo(code) {
  try {
    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
      console.warn('Facebook OAuth credentials not configured');
      throw new Error('Facebook authentication not available');
    }
    
    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      },
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,first_name,last_name,picture',
        access_token,
      },
    });

    return {
      email: userResponse.data.email,
      firstName: userResponse.data.first_name,
      lastName: userResponse.data.last_name,
      name: userResponse.data.name,
      picture: userResponse.data.picture?.data?.url,
    };
  } catch (error) {
    console.error('Facebook auth error:', error);
    throw new Error('Facebook authentication failed');
  }
}

async function getInstagramUserInfo(code) {
  try {
    if (!process.env.INSTAGRAM_CLIENT_ID || !process.env.INSTAGRAM_CLIENT_SECRET) {
      console.warn('Instagram OAuth credentials not configured');
      throw new Error('Instagram authentication not available');
    }
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code,
    });

    const { access_token, user_id } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get(`https://graph.instagram.com/${user_id}`, {
      params: {
        fields: 'id,username',
        access_token,
      },
    });

    // Instagram doesn't provide email in basic scope, so we'll use username
    return {
      email: `${userResponse.data.username}@instagram.local`, // Temporary email
      firstName: userResponse.data.username,
      lastName: '',
      name: userResponse.data.username,
      picture: null,
    };
  } catch (error) {
    console.error('Instagram auth error:', error);
    throw new Error('Instagram authentication failed');
  }
}

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await pool.query(
      'SELECT id, email, password_hash, user_type, kyc_status, is_active FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userData = user.rows[0];

    // Check if account is active
    if (!userData.is_active) {
      return res.status(401).json({ error: 'Account has been deactivated' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, userData.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email,
        userType: userData.user_type
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userData.id,
        email: userData.email,
        userType: userData.user_type,
        kycStatus: userData.kyc_status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT id, first_name, last_name, email, phone, user_type, kyc_status, 
              created_at, wallet_balance, escrow_balance
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.rows[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Products
app.get('/api/products', async (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT p.*, u.first_name || ' ' || u.last_name as seller_name,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as review_count
      FROM products p
      JOIN users u ON p.seller_id = u.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.is_active = true
    `;
    
    const queryParams = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND p.category = $${paramCount}`;
      queryParams.push(category);
    }

    if (condition) {
      paramCount++;
      query += ` AND p.condition = $${paramCount}`;
      queryParams.push(condition);
    }

    if (minPrice) {
      paramCount++;
      query += ` AND p.price >= $${paramCount}`;
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND p.price <= $${paramCount}`;
      queryParams.push(maxPrice);
    }

    if (search) {
      paramCount++;
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    query += ` GROUP BY p.id, u.first_name, u.last_name ORDER BY p.created_at DESC`;
    
    // Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    queryParams.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const products = await pool.query(query, queryParams);
    
    res.json({ products: products.rows });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Product
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category, condition, images, installmentEnabled } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const newProduct = await pool.query(
      `INSERT INTO products (seller_id, title, description, price, category, condition, 
                           images, installment_enabled, escrow_enabled)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true) RETURNING *`,
      [req.user.id, title, description, price, category, condition, images, installmentEnabled]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity, paymentType, installmentPlan } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    // Get product details
    const product = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productData = product.rows[0];
    const totalAmount = productData.price * quantity;

    // Create order
    const newOrder = await pool.query(
      `INSERT INTO orders (buyer_id, seller_id, product_id, quantity, total_amount, 
                          payment_type, installment_plan, status, escrow_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', 'held') RETURNING *`,
      [req.user.id, productData.seller_id, productId, quantity, totalAmount, 
       paymentType, installmentPlan]
    );

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder.rows[0]
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get User Orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { status, type = 'buyer' } = req.query;
    
    let query = `
      SELECT o.*, p.title as product_title, p.images as product_images,
             u.first_name || ' ' || u.last_name as other_party_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
    `;
    
    const queryParams = [req.user.id];
    
    if (type === 'buyer') {
      query += ' JOIN users u ON o.seller_id = u.id WHERE o.buyer_id = $1';
    } else {
      query += ' JOIN users u ON o.buyer_id = u.id WHERE o.seller_id = $1';
    }

    if (status) {
      query += ' AND o.status = $2';
      queryParams.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const orders = await pool.query(query, queryParams);
    
    res.json({ orders: orders.rows });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process Payment
app.post('/api/payments/process', authenticateToken, async (req, res) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;

    if (!orderId || !paymentMethod || !amount) {
      return res.status(400).json({ error: 'Missing required payment information' });
    }

    // Get order details
    const order = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND buyer_id = $2',
      [orderId, req.user.id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Simulate payment processing (integrate with actual payment gateway)
    const paymentResult = {
      success: true,
      transactionId: `TXN_${Date.now()}`,
      reference: `REF_${orderId}_${Date.now()}`
    };

    if (paymentResult.success) {
      // Update order status
      await pool.query(
        'UPDATE orders SET status = $1, payment_status = $2 WHERE id = $3',
        ['confirmed', 'paid', orderId]
      );

      // Create payment record
      await pool.query(
        `INSERT INTO payments (order_id, user_id, amount, payment_method, 
                              transaction_id, reference, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'completed')`,
        [orderId, req.user.id, amount, paymentMethod, 
         paymentResult.transactionId, paymentResult.reference]
      );

      res.json({
        message: 'Payment processed successfully',
        transactionId: paymentResult.transactionId,
        reference: paymentResult.reference
      });
    } else {
      res.status(400).json({ error: 'Payment processing failed' });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Wallet Balance
app.get('/api/wallet/balance', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT wallet_balance, escrow_balance FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { wallet_balance, escrow_balance } = user.rows[0];
    
    res.json({
      totalBalance: wallet_balance,
      escrowBalance: escrow_balance,
      availableBalance: wallet_balance - escrow_balance
    });
  } catch (error) {
    console.error('Wallet balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Wallet Transactions
app.get('/api/wallet/transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const transactions = await pool.query(
      `SELECT * FROM wallet_transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.json({ transactions: transactions.rows });
  } catch (error) {
    console.error('Wallet transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`GidiMart API server running on port ${PORT}`);
});

module.exports = app;