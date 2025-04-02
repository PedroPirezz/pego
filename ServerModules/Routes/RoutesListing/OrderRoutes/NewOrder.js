const express = require('express');
const axios = require('axios');
const DB = require('../../../Database/Variable/DBVar');
require('dotenv').config();

const router = express.Router();

async function createNewOrder(userId, storeId, items, paymentMethod) {
  try {
    const totalPrice = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const customer = await DB.Users.findOne({ where: { id: userId } });

    const newOrder = await DB.Order.create({
      UserId: userId,
      StoreID: storeId,
      TotalPrice: totalPrice,
      Status: 'pending',
      PaymentMethod: paymentMethod,
      PaymentLink: ''
    });

    const orderItems = items.map(item => ({
      OrderId: newOrder.id,
      ProductId: item.productId,
      ProductName: item.productName,
      Quantity: item.quantity,
      UnitPrice: item.unitPrice,
      SubTotal: item.quantity * item.unitPrice
    }));
    await DB.OrderItem.bulkCreate(orderItems);

    const billingResponse = await axios.post(
      'https://api.abacatepay.com/v1/billing/create',
      {
        frequency: "ONE_TIME",
        methods: ["PIX"],
        products: items.map(item => ({
          externalId: item.productId.toString(),
          name: item.productName,
          quantity: item.quantity,
          price: item.unitPrice * 100,
          description: item.productName
        })),
        returnUrl: "https://www.youtube.com/watch?v=UQUZ9wRenNg",
        completionUrl: "https://chatgpt.com/c/67ea83ca-a018-800f-a74a-d3e0f0bd2634",
        customer: {
          name: customer.Name,
          cellphone: customer.NumberPhone,
          email: customer.Email,
          taxId: customer.CPF_CNPJ
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ABACATEPAY_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const qrCodeResponse = await axios.post(
      'https://api.abacatepay.com/v1/pixQrCode/create',
      {
        expiresIn: 5000,
        amount: totalPrice * 100,
        description: 'Produtos',
        customer: {
          name: customer.Name,
          cellphone: customer.NumberPhone,
          email: customer.Email,
          taxId: customer.CPF_CNPJ
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ABACATEPAY_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
 
    const paymentLink = qrCodeResponse.data.url;
   
    return { billing: billingResponse.data, newOrder};

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw new Error(error.response?.data || error.message);
  }
}


router.post('/NewOrder',  async (req, res) => {
  try {
    const { userId, storeId, items, paymentMethod } = req.body;
    const result = await createNewOrder(userId, storeId, items, paymentMethod);
    let billingUrl = result.billing.data.url; 
    let IdOrder = result.newOrder.id;
    DB.Order.update(
      { PaymentLink: billingUrl },
      { where: { id: IdOrder } }
    );

    res.status(201).json({ message: 'Success to create order', billingUrl: result.billing.data.url, newOrder: result.newOrder.id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
});

module.exports = router;
