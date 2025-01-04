const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Rotas protegidas para clientes e admin
router.post("/create", protect, paymentController.createPayment);
router.get("/orders/me", protect, paymentController.getMyOrders);
router.get("/order/:orderId", protect, paymentController.getOrderById);

// Rotas exclusivas para admin
router.get(
  "/orders/cpf/:cpf",
  protect,
  restrictTo("admin"),
  paymentController.getOrdersByCpf
);
router.get(
  "/orders/status/:status",
  protect,
  restrictTo("admin"),
  paymentController.getOrdersByStatus
);
router.patch(
  "/order/:orderId/delivery",
  protect,
  restrictTo("admin"),
  paymentController.updateDeliveryStatus
);
router.get(
  "/orders/date",
  protect,
  restrictTo("admin"),
  paymentController.getOrdersByDateRange
);

// Webhook (público)
router.post("/webhook", paymentController.webhook);

module.exports = router;
