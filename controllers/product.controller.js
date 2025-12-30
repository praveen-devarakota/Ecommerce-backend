import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const createProducts = async (req,res)=>{
  const product = req.body; //user will send this data

  if(!product.name || !product.price || !product.image){
    return res.status(400).json({success:false, message: "Please fill all the fields"});
  }

  const newProduct = new Product(product);
  try{
    await newProduct.save();
    res.status(201).json({success:true, data: newProduct});
  }catch(error){
      console.error("Error creating product:", error.message);
      res.status(500).json({success:false, message: "Server error"});
  }
};

export const deleteProduct = async (req,res)=>{
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({success:false, message: "Invalid product ID"});
    }

  try{
    await Product.findByIdAndDelete(id);
    res.status(200).json({success:true, message: "Product deleted successfully"});
  }catch(error){
    res.status(500).json({success:false, message: "Server Error"});
  }
};

export const getProducts = async (req,res)=>{
 try{
  const products = await Product.find();
  res.status(200).json({success:true, data: products});
 }
 catch(error){
  console.error("Error fetching products:", error.message);
  res.status(500).json({success:false, message: "Server error"});
 }
};

export const ProductsId = async (req,res)=>{
  try{
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({success:false, message: "Invalid product ID"});
    }

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({success:false, message: "Product not found"});
    }

    res.status(200).json({success:true, data: product});
  }
  catch(error){
    console.error("Error fetching product:", error.message);
    res.status(500).json({success:false, message: "Server error"});
  }
};

export const updateProduct =  async (req,res)=>{
  try{
    const { id } = req.params;
    const product = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({success:false, message: "Invalid product ID"});
    }

    const updatedProduct = await Product .findByIdAndUpdate(id, product, { new: true });
    res.status(200).json({success:true, data: updatedProduct});
}catch(error){
    console.error("Error updating product:", error.message);
    res.status(500).json({success:false, message: "Server error"});
  }
};

export const getProductIds = async (req, res) => {
  try {
    const products = await Product.find({}, '_id'); // Fetch only the _id field
    const productIds = products.map(product => product._id);
    res.status(200).json({ success: true, data: productIds });
  } catch (error) {
    console.error("Error fetching product IDs:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};