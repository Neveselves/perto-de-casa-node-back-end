const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Rotas públicas
router.get("/", productController.getAllProducts);
router.get("/search", productController.getProductsByName);
router.get("/promotional", productController.getPromotionalProducts);
router.get("/:id", productController.getProductById);

// Rotas protegidas - apenas admin
router.use(protect);
router.post("/:hallId", restrictTo("admin"), productController.createProduct); //
router.put("/:id", restrictTo("admin"), productController.updateProduct);
router.delete("/:id", restrictTo("admin"), productController.deleteProduct);

module.exports = router;
