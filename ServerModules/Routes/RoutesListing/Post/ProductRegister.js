const fs = require('fs');
const { uploadFileToDrive } = require('../../../Functions/GoogleDriveConnetion');
const Db = require('../../../Database/Variable/DBVar');

const ProductRegister = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  try {


    const fileId = await uploadFileToDrive(req.file.path, req.file.originalname).then(async (fileId) => {
      const { StoreID, ProductName, ProductPrice } = req.body;
      let ImageUrl  = `https://drive.google.com/uc?export=view&id=${fileId}`;

        if (!StoreID || !ProductName || !ProductPrice) {
          throw new Error('Dados insuficientes para o registro do produto');
        }else{
          await Db.Products.create({
            Name: ProductName,
            StoreID: StoreID,
            Price: ProductPrice,
            ImageUrl: ImageUrl,
          });
        }
      
    });
    
    fs.unlinkSync(req.file.path);

 
    res.json({ success: true, fileId });

  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
  }
};

module.exports = ProductRegister;
