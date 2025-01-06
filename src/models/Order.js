const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        category_id: {
          type: String,
          required: true,
        },
        unit_price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "paid", "failed", "refunded"],
      default: "pending",
    },
    delivery: {
      status: {
        type: String,
        enum: ["pending", "in_transit", "delivered"],
        default: "pending",
      },
      reason: {
        type: String,
        default: "",
      },
      updatedAt: {
        type: Date,
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    paymentId: String,
    merchantOrderId: String,
    preferenceId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
