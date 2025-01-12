const mercadopago = require("mercadopago");
const Order = require("../models/Order");
const productService = require("../services/productService");
const { MercadoPagoConfig, Payment, Preference } = require("mercadopago");

class MercadoPagoService {
  constructor() {}

  async createPreference(order, user) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      options: { timeout: 5000 },
    });
    const preference = new Preference(client);
    const userName = user.name.split(" ");
    const surName = userName
      .slice(1, userName.length - 1)
      .toString()
      .replaceAll(",", " ");

    const userPhone = user.phone.split("");
    const ddd = userPhone[0] + userPhone[1];
    const userNumPhone = userPhone
      .slice(2, userPhone.length - 1)
      .toString()
      .replaceAll(",", " ");

    console.log(order.items);
    const body = {
      payer: {
        name: userName[0],
        surname: surName,
        email: "teste@teste.gmail.com", //user.email,
        phone: {
          area_code: "00", //ddd,
          number: 11223344, //Number.parseInt(userNumPhone),
        },
      },
      external_reference: order._id,
      items: order.items.map((item) => ({
        id: item.id,
        title: item.title,
        category_id: item.category_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "BRL",
      })),
      back_urls: {
        success: `http://192.168.100.18:8100/payment/success`,
        //failure: `${process.env.FRONTEND_URL}/payment/failure`,${process.env.FRONTEND_URL}
        // pending: `${process.env.FRONTEND_URL}/payment/pending`,
      },
      notification_url:
        "https://perto-de-casa-node-back-end.onrender.com/api/payment/webhook",
      auto_return: "approved",
    };

    const responsePayment = await preference.create({ body });

    return responsePayment;
  }

  async getAllOrders() {
    return await Order.find();
  }

  async handleWebhook(data) {
    if (data.type === "payment") {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
        options: { timeout: 5000 },
      });

      const instancePayment = new Payment(client);
      const payment = await instancePayment.get({ id: data.data.id });
      console.log(payment, "retorno payment");
      const order = await Order.findById(payment.external_reference);
      console.log(order, "order dentro do webhook");
      if (!order) {
        throw new Error("Order not found");
      }

      switch (payment.status) {
        case "approved":
          order.status = "paid";
          for (const item of order.items) {
            await productService.updateProductSales(item.id, item.quantity);
          }
          break;
        case "pending":
          order.status = "processing";
          break;
        case "rejected":
          order.status = "failed";
          break;
        case "refunded":
          order.status = "refunded";
          break;
      }

      order.paymentId = payment.id;
      order.merchantOrderId = payment.merchant_account_id;
      await order.save();

      return order;
    }
  }
}

module.exports = new MercadoPagoService();
