const fs = require('fs');
const axios = require('axios');
const { uploadFileToDrive } = require('../../../Functions/GoogleDriveConnetion');
const Db = require('../../../Database/Variable/DBVar');

const getViewerIdFromHTMLSourceCode = sourceCode => {
    if (!sourceCode) return null;
    const splited = sourceCode.split('drive-viewer/');
    if (splited.length < 2) return null;
    const viewerId = splited[1].split('\\')[0];
    return viewerId;
};

const getViewIdFromImageIdGoogleDrive = async photo_id => {
    try {
        const fetch = await axios.get(`https://drive.google.com/file/d/${photo_id}/view`);
        const viewid = getViewerIdFromHTMLSourceCode(fetch.data);
        return viewid;
    } catch (err) {
        return null;
    }
};

const ProductRegister = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    try {
        const fileId = await uploadFileToDrive(req.file.path, req.file.originalname);
        const { StoreID, ProductName, ProductPrice } = req.body;
        const Avaible = 1;
        
        const ImageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

        if (!StoreID || !ProductName || !ProductPrice) {
            throw new Error('Dados insuficientes para o registro do produto');
        }

        await Db.Products.create({
            Name: ProductName,
            StoreID: StoreID,
            Price: ProductPrice,
            ImageUrl: ImageUrl,
            Available: Avaible,
        });
        
        fs.unlinkSync(req.file.path);

        res.json({ success: true, fileId });
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
};

module.exports = ProductRegister;
