import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';

// Fetch all users with selected fields (excluding password hash)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id username email role'); // exclude password
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

// Fetch all products with all fields
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
};

// Fetch all carts with populated user info and items
export const getAllCarts = async (req, res) => {
  try {
    // Assuming Cart schema has userId ref and items array with productId refs
    const carts = await Cart.find({})
      .populate('userId', 'username email role')   // populate user info
      .populate('items.productId', 'name price image');  // populate product info inside items

    res.json({ success: true, carts });
  } catch (error) {
    console.error('Error fetching carts:', error);
    res.status(500).json({ success: false, message: 'Server error fetching carts' });
  }
};

