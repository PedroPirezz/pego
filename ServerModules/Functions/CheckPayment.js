const axios = require('axios');
const DB = require('../Database/Variable/DBVar');

async function CheckPayment(req, res, next) {
  const authHeader = req.header('Authorization');
  const Header_orderId = parseInt(req.header('Order-Id'));

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Informação de autenticação ausente.' });
  }

  if (!Header_orderId) {
    return res.status(401).json({ error: 'ID do pedido não fornecido.' });
  }

  try {
    const order = await DB.Order.findOne({attributes: ['PaymentId']}, { where: { id: Header_orderId } });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const paymentId = order.PaymentId;

    if (!paymentId) {
      return res.status(400).json({ error: 'Pedido não possui PaymentId.' });
    }

    // Chamada à API da AbacatePay para verificar o status
    const response = await axios.get(`https://api.abacatepay.com/v1/pixQrCode/check?id=${paymentId}`, {
      headers: {
        Authorization: 'Bearer abc_dev_mCLkCwrcp2HnjXrdyMHFe0f4'
      }
    });

    const paymentStatus = response.data;

    // Se o pagamento foi confirmado, atualiza no banco
    if (paymentStatus.data.status === 'PAID') {
      await order.update({ Status: 'PAID' });
      next(); 
    }
    else
    {
      return res.status(200).json({
        message: 'Pagamento ainda não confirmado',
        paymentStatus
      });
    }

    return res.status(200).json({
      message: 'Status do pagamento obtido com sucesso',
      paymentStatus
    });

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return res.status(500).json({ error: 'Erro ao verificar pagamento', details: error.message });
  }
}

module.exports = CheckPayment;
