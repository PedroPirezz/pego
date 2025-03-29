const DB = require('../DatabaseModels/DatabaseModels');

function validateToken(userId, token, req, res, next) {

  let UserId = req.params.userId;
  let InputToken = req.params.token;

  DB.Cadastros.findOne({ where: { id: UserId} }).then(Register => {
    if (Register.Token === InputToken) {
      next();
    } else {
      res.send('Invalid Token');
    }
  }).catch(error => {
    console.error('Error validating token:', error);
    res.status(500).send('Internal Server Error');
  });
}

module.exports = validateToken;
