const { INTEGER, or } = require('sequelize');
const Store = require('../Database/Models/Stores');
const DB = require('../Database/Variable/DBVar');

async function CheckOrderOwner(req, res, next) { 

    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Informação de autenticação (Headeres) ausente.' });
    }

    
    const Header_userId = req.header('User-Id'); 
    const Header_orderId = parseInt(req.header('Order-Id')); 

    let order = await DB.Order.findOne({ where: { id: Header_orderId } });

    if (!Header_userId || !Header_orderId) {
        return res.status(401).json({ error: 'Acesso negado. ID e ID da loja do usuário não fornecido.' });
    }
    else{

    try {
    
        
        if ( order.UserId == Header_userId ) {
            
            next();
        } else {
            return res.status(401).json({ error: 'Acesso negado, A loja não pertence ao proprietário informado.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
}
}

module.exports = CheckOrderOwner;
