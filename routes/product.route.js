import express from "express";
import { createProducts, deleteProduct, getProducts, updateProduct, ProductsId, getProductIds } from "../controllers/product.controller.js"; // import the controller function
import { get } from "mongoose";

const router = express.Router();

router.post("/", createProducts);

router.delete("/:id", deleteProduct);

router.get("/", getProducts );

router.put("/:id", updateProduct);

// GET /api/products/ids - Get all product IDs
router.get('/ids', getProductIds);

// This route should be after /ids to prevent it from catching /ids requests
router.get("/:id", ProductsId );

export default router;