const DB = require('../Database/Variable/DBVar');

async function CheckToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    const userId = req.header('User-Id'); // O ID do usuário deve ser enviado no cabeçalho da requisição

    if (!userId) {
        return res.status(401).json({ error: 'Acesso negado. ID do usuário não fornecido.' });
    }

    try {
        let user = await DB.Users.findOne({ attributes: ['Token'] }, { where: { id: userId } });
        
        if (user && user.Token === token) {
            req.user = user; // Adiciona o usuário ao request
            next();
        } else {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
}

module.exports = CheckToken;
