const Hall = require("../models/Hall");

class ProductService {
  async getAllProducts() {
    const halls = await Hall.find();
    return halls.reduce((acc, hall) => [...acc, ...hall.products], []);
  }

  async getProductById(productId) {
    const hall = await Hall.findOne({ "products._id": productId });
    return hall ? hall.products.id(productId) : null;
  }

  async getProductsByName(name) {
    return await Hall.aggregate([
      { $unwind: "$products" },
      { $match: { "products.desc": { $regex: name, $options: "i" } } },
      { $replaceRoot: { newRoot: "$products" } },
    ]);
  }

  async getPromotionalProducts() {
    return await Hall.aggregate([
      { $unwind: "$products" },
      { $match: { "products.promotion": true } },
      { $replaceRoot: { newRoot: "$products" } },
    ]);
  }

  async createProduct(hallId, productData) {
    try {
      const hall = await Hall.findById(hallId);
      if (!hall) {
        throw new Error(`Hall with ID ${hallId} not found`);
      }

      // Validate required fields
      if (!productData.desc || !productData.price || !productData.image) {
        throw new Error(
          "Missing required fields: desc, price, and image are required"
        );
      }

      hall.products.push(productData);
      await hall.save();
      return hall.products[hall.products.length - 1];
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(productId, productData) {
    const hall = await Hall.findOne({ "products._id": productId });
    if (!hall) return null;

    const product = hall.products.id(productId);
    Object.assign(product, productData);
    await hall.save();
    return product;
  }

  async deleteProduct(productId) {
    const hall = await Hall.findOne({ "products._id": productId });
    if (!hall) return false;

    hall.products.pull(productId);
    await hall.save();
    return true;
  }

  async updateProductSales(productId, quantity) {
    try {
      const hall = await Hall.findOne({ "products._id": productId });
      if (!hall) {
        throw new Error("Product not found");
      }

      const product = hall.products.id(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Initialize details.sales if it doesn't exist
      if (!product.details) {
        product.details = { sales: 0 };
      }
      if (typeof product.details.sales !== "number") {
        product.details.sales = 0;
      }

      // Update sales count
      product.details.sales += quantity;
      await hall.save();

      return product;
    } catch (error) {
      console.error("Error updating product sales:", error);
      throw error;
    }
  }
}

module.exports = new ProductService();
