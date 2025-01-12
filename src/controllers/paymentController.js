const asyncHandler = require("express-async-handler");
const mercadoPagoService = require("../services/mercadoPagoService");
const Order = require("../models/Order");
const User = require("../models/User");

class PaymentController {
  createPayment = asyncHandler(async (req, res) => {
    const { items } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items: items,
      total: items.reduce(
        (acc, item) => acc + item.unit_price * item.quantity,
        0
      ),
    });

    const preference = await mercadoPagoService.createPreference(
      order,
      req.user
    );

    order.preferenceId = preference.id;
    await order.save();

    res.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
    });
  });

  webhook = asyncHandler(async (req, res) => {
    try {
      const { type, data } = req.body;
      console.log(req.body, "REQ BODY");

      if (type) {
        await mercadoPagoService.handleWebhook({ type, data });
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).send("Webhook error");
    }
  });

  getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId)
      .populate("user", "name email cpf")
      .populate("items.product", "desc price")
      .populate("delivery.updatedBy", "name");

    if (!order) {
      res.status(404);
      throw new Error("Pedido não encontrado");
    }

    // Verificar se o usuário é admin ou o dono do pedido
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Não autorizado");
    }

    res.json(order);
  });

  getOrdersByCpf = asyncHandler(async (req, res) => {
    const { cpf } = req.params;

    // Apenas admin pode buscar pedidos por CPF
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Não autorizado");
    }

    const user = await User.findOne({ cpf });
    if (!user) {
      res.status(404);
      throw new Error("Usuário não encontrado");
    }

    const orders = await Order.find({ user: user._id })
      .populate("user", "name email cpf")
      .populate("items.product", "desc price")
      .populate("delivery.updatedBy", "name")
      .sort("-createdAt");

    res.json(orders);
  });

  getOrdersByStatus = asyncHandler(async (req, res) => {
    const { status } = req.params;

    // Apenas admin pode listar todos os pedidos por status
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Não autorizado");
    }

    const orders = await Order.find({ status })
      .populate("user", "name email cpf")
      .populate("items.product", "desc price")
      .populate("delivery.updatedBy", "name")
      .sort("-createdAt");

    res.json(orders);
  });

  updateDeliveryStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status, reason } = req.body;

    // Apenas admin pode atualizar status de entrega
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Não autorizado");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Pedido não encontrado");
    }

    order.delivery = {
      status,
      reason: reason || "",
      updatedAt: new Date(),
      updatedBy: req.user._id,
    };

    await order.save();

    res.json(order);
  });

  getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
      .populate("items", "desc price")
      .populate("delivery.updatedBy", "name")
      .sort("-createdAt");
    res.json(orders);
  });

  getOrdersByDateRange = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400);
      throw new Error("Start date and end date are required");
    }

    // Ensure admin access
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized - Admin access required");
    }

    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("user", "name email cpf")
      .populate("items", "desc price")
      .populate("delivery.updatedBy", "name")
      .sort("-createdAt");

    res.json(orders);
  });
}
module.exports = new PaymentController();
