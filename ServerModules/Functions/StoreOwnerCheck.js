const { INTEGER } = require('sequelize');
const Store = require('../Database/Models/Stores');
const DB = require('../Database/Variable/DBVar');

async function OwnerCheck(req, res, next) { 
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Informação de autenticação (Headeres) ausente.' });
    }

    
    const Header_userId = req.header('User-Id'); 
    const Header_storeId = parseInt(req.header('Store-Id')); 
    let store = await DB.Stores.findOne({ attributes: ['StoreIdOwner']}, { where: { id: Header_storeId } });

    if (!Header_userId || !Header_storeId) {
        return res.status(401).json({ error: 'Acesso negado. ID e ID da loja do usuário não fornecido.' });
    }
    else{

    try {
    
        
        if ( store.StoreIdOwner == Header_userId) {
            
            next();
        } else {
            return res.status(401).json({ error: 'Acesso negado, A loja não pertence ao proprietário informado.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
}
}

module.exports = OwnerCheck;
