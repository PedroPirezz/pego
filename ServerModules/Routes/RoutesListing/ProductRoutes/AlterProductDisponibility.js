module.exports = (req, res) => {
  const DB = require('../../../Database/Variable/DBVar');
  const Header_productId = req.header('Product-Id'); 
  const Header_storeId = parseInt(req.header('Store-Id')); 
  const Disponibility = parseInt(req.header('Disponibility')); 

 

  DB.Products.update(
    { Available: Disponibility },
    { where: { StoreID: Header_storeId, id: Header_productId } }
  )
  .then(affectedRows => {
    if (affectedRows[0] === 0) {
      return res.status(404).send("Not Found");
    }
    res.status(200).send("Success, Product Disponibility Updated To " + Disponibility);
  })
  .catch(error => {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  });
};
