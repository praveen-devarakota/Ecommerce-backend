// controllers/cart.controller.js
import Cart from '../models/cart.model.js';

export const getCart = async (req, res) => {
  const { userId } = req.user;
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  
  // Transform the response to include product details
  const transformedCart = {
    items: cart ? cart.items.map(item => ({
      _id: item._id,
      productId: item.productId._id,
      quantity: item.quantity,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      description: item.productId.description
    })) : []
  };
  
  res.json(transformedCart);
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { userId } = req.user;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [{ productId, quantity }] });
  } else {
    const item = cart.items.find(item => item.productId.equals(productId));
    if (item) item.quantity += quantity;
    else cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.user;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => !item.productId.equals(productId));
  await cart.save();

  res.json(cart);
};

export const clearCart = async (req, res) => {
  const { userId } = req.user;
  await Cart.findOneAndUpdate({ userId }, { items: [] });
  res.json({ message: 'Cart cleared' });
};

export const changeQuantity = async (req, res) => {
  const { userId } = req.user;
  const { productId, change } = req.body;

  // Validate change value (+1 or -1)
  if (change !== 1 && change !== -1) {
    return res.status(400).json({ message: 'Change must be +1 or -1' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    const newQuantity = cart.items[itemIndex].quantity + change;

    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.json({ message: 'Item removed from cart', cart });
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = newQuantity;
      await cart.save();
      return res.json({ message: 'Quantity updated', cart });
    }
  } catch (error) {
    console.error('Change Quantity Error:', error);
    return res.status(500).json({ message: 'Server error while changing quantity' });
  }
};
