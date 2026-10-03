const express = require("express")
const path = require("path")

const productController =
    require("../controllers/productController")

const verifyToken =
    require("../middlewares/verifyToken")

const router = express.Router()


// ===============================
// ADD PRODUCT
// ===============================

router.post(

    "/add-product/:firmId",

    verifyToken,

    productController.addProduct

)


// ===============================
// GET PRODUCTS
// ===============================

router.get(

    "/:firmId/products",

    productController.getProductByFirm

)


// ===============================
// GET PRODUCT IMAGE
// ===============================

router.get(

    "/uploads/:imageName",

    (req, res) => {

        const imageName =
            req.params.imageName

        const imagePath =
            path.join(
                __dirname,
                "..",
                "uploads",
                imageName
            )

        res.sendFile(imagePath)

    }

)


// ===============================
// DELETE PRODUCT
// ===============================

router.delete(

    "/:productId",

    productController.deleteProductById

)


module.exports = router