import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';
import userRoutes from './routes/user.route.js';
import cartRoutes from './routes/cart.route.js';
import adminRoutes from './routes/admin.route.js';

dotenv.config();

const PORT = process.env.PORT || 5001;  // Set default port

const app = express();

// CORS configuration
app.use(cors());
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
}
);

// Test route to verify server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin',adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    // First connect to database
    await connectDB();
    
    // Then start the server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();