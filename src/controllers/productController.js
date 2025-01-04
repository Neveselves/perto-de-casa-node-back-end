const asyncHandler = require('express-async-handler');
const productService = require('../services/productService');

class ProductController {
  getAllProducts = asyncHandler(async (req, res) => {
    const products = await productService.getAllProducts();
    res.json(products);
  });

  getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  });

  getProductsByName = asyncHandler(async (req, res) => {
    const products = await productService.getProductsByName(req.query.name);
    res.json(products);
  });

  getPromotionalProducts = asyncHandler(async (req, res) => {
    const products = await productService.getPromotionalProducts();
    res.json(products);
  });

  createProduct = asyncHandler(async (req, res) => {
    try {
      const { hallId } = req.params;
      console.log('Creating product for hall:', hallId);
      console.log('Product data:', req.body);
      
      const product = await productService.createProduct(hallId, req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error in createProduct controller:', error);
      res.status(400);
      throw error;
    }
  });

  updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.status(204).send();
  });
}

module.exports = new ProductController();