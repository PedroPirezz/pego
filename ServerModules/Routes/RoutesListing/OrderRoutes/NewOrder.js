const express = require('express');
const axios = require('axios');
const DB = require('../../../Database/Variable/DBVar'); // Ajuste o caminho conforme necessário
require('dotenv').config();


const router = express.Router();

async function createNewOrder(userId, storeId, items, paymentMethod) {
  try {
    // lógica da ordem + chamada pixQrCode
    const totalPrice = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const customer = await DB.Users.findOne({ where: { id: userId } });

   

    const qrCodeResponse = await axios.post(
      'https://api.abacatepay.com/v1/pixQrCode/create',
      {
        amount: totalPrice,
        expiresIn: 300,
        description: 'Pegô - Pedido de compra',
        customer: {
          name: customer.Name,
          cellphone: customer.NumberPhone,
          email: customer.Email,
          taxId: customer.CPF_CNPJ,
        }
      },
      {
        headers: {
          Authorization: 'Bearer abc_dev_mCLkCwrcp2HnjXrdyMHFe0f4',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(qrCodeResponse.data.data.pixKey);
    console.log(qrCodeResponse.data.pixQrCode);
    const newOrder = await DB.Order.create({
      UserId: userId,
      StoreID: storeId,
      TotalPrice: totalPrice,
      PaymentMethod: paymentMethod,
      Status: qrCodeResponse.data.data.status,
      PixKey: qrCodeResponse.data.data.brCode,
      PixQrCode: qrCodeResponse.data.data.brCodeBase64,
      PaymentId: qrCodeResponse.data.data.id,
    
      
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

    return {
      billing: { data: qrCodeResponse.data },
      newOrder: { id: newOrder.id } // simulação
    };

  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
}

router.post('/NewOrder', async (req, res) => {
  try {
    const { userId, storeId, items, paymentMethod } = req.body;
    const result = await createNewOrder(userId, storeId, items, paymentMethod);
    
   

    res.status(201).json({
      message: 'Success to create order',
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
});

module.exports = router;
