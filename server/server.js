/**
 * instakoo Backend Server
 * 
 * Required: npm install express cors body-parser dotenv
 * Run: node server.js
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory Database Mock
const orders = [];

// --- Routes ---

// 1. Create Order
app.post('/api/orders', (req, res) => {
  const { platform, serviceId, url, quantity, totalPrice } = req.body;

  if (!url || !quantity) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const newOrder = {
    id: `ORD-${Date.now()}`,
    platform,
    serviceId,
    url,
    quantity,
    totalPrice,
    status: 'PENDING',
    createdAt: new Date()
  };

  orders.push(newOrder);

  // In a real app, you would define your merchant_uid here for the PG
  res.json({ 
    success: true, 
    data: newOrder,
    message: 'Order created successfully' 
  });
});

// 2. Prepare Payment (Optional: Verify amounts before PG call)
app.post('/api/payments/prepare', (req, res) => {
  // Logic to register pre-payment data to PG (e.g. Iamport) to prevent forgery
  res.json({ success: true, message: 'Payment prepared' });
});

// 3. Complete Payment (Webhook or Client Callback)
app.post('/api/payments/complete', (req, res) => {
  const { imp_uid, merchant_uid } = req.body;
  
  // 1. Verify payment with PG server using imp_uid
  // 2. Compare paid amount with order amount in DB
  // 3. If valid, update order status to 'PAID'
  
  const order = orders.find(o => o.id === merchant_uid);
  if (order) {
    order.status = 'PAID';
    order.paymentId = imp_uid;
    res.json({ success: true, data: order });
  } else {
    // For demo purposes, we accept random IDs if mock mode
    res.json({ success: true, message: 'Payment recorded (Demo)' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`- Setup .env with PORT=5000 to change port`);
  console.log(`- Connect Frontend API calls to http://localhost:${PORT}/api`);
});