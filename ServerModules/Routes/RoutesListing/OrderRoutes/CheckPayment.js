const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get('/CheckPayment', async (req, res) => {
  try {
    const { paymentlink } = req.body;

    // Verificando o status do pagamento usando o paymentlink
    const response = await axios.get(
      `https://api.abacatepay.com/v1/pixQrCode/check?id=${paymentlink}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ABACATEPAY_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data);
    res.json(response.data); // Retorna a resposta da API de verificação de pagamento
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    res.status(500).json({ message: 'Erro ao verificar status do pagamento', error: error.response?.data || error.message });
  }
});

module.exports = router;
 