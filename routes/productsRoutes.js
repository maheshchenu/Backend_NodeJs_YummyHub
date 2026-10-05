const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verifyToken')
const productController = require('../controllers/productController')

// Add Product
router.post(
'/add-product/:firmId',
verifyToken,
...productController.addProduct
)

// Get Products by Firm
router.get(
'/get-product/:firmId',
productController.getProductByFirm
)

// Delete Product
router.delete(
'/delete-product/:productId',
verifyToken,
productController.deleteProductById
)

module.exports = router
