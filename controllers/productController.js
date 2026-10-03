const Product = require("../models/Product")
const Firm = require("../models/Firm")
const multer = require("multer")
const path = require("path")


// ===============================
// MULTER STORAGE
// ===============================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/")

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname

        cb(null, uniqueName)

    }

})

const upload = multer({
    storage: storage
})


// ===============================
// ADD PRODUCT
// ===============================

const addProduct = async (req, res) => {

    try {

        console.log("PRODUCT BODY:", req.body)
        console.log("PRODUCT FILE:", req.file)
        console.log("FIRM ID:", req.params.firmId)


        const {
            productName,
            price,
            category,
            bestSeller,
            description,
            offer
        } = req.body


        // Image

        const image = req.file
            ? req.file.filename
            : undefined


        // Firm ID

        const firmId = req.params.firmId


        // Find firm

        const firm = await Firm.findById(firmId)


        if (!firm) {

            return res.status(404).json({
                error: "No firm found"
            })

        }


        // Create product

        const product = new Product({

            productName,

            price,

            category,

            bestSeller,

            description,

            offer,

            image,

            firm: [
                firm._id
            ]

        })


        // Save product

        const savedProduct =
            await product.save()


        // Add product to firm

        firm.products.push(
            savedProduct._id
        )


        await firm.save()


        console.log(
            "Product added successfully"
        )


        return res.status(201).json({

            message: "Product added successfully",

            productId: savedProduct._id,

            product: savedProduct

        })

    } catch (error) {

        console.error(
            "ADD PRODUCT ERROR:",
            error
        )

        return res.status(500).json({

            error: "Internal server error",

            message: error.message

        })

    }

}


// ===============================
// GET PRODUCTS BY FIRM
// ===============================

const getProductByFirm = async (req, res) => {

    try {

        const firmId =
            req.params.firmId


        const firm =
            await Firm.findById(firmId)


        if (!firm) {

            return res.status(404).json({

                error: "No firm found"

            })

        }


        const restaurantName =
            firm.firmName


        const products =
            await Product.find({
                firm: firmId
            })


        return res.status(200).json({

            restaurantName,

            products

        })

    } catch (error) {

        console.error(error)

        return res.status(500).json({

            error: "Internal server error"

        })

    }

}


// ===============================
// DELETE PRODUCT
// ===============================

const deleteProductById = async (req, res) => {

    try {

        const productId =
            req.params.productId


        const deletedProduct =
            await Product.findByIdAndDelete(
                productId
            )


        if (!deletedProduct) {

            return res.status(404).json({

                error: "No Product Found"

            })

        }


        return res.status(200).json({

            message: "Product deleted successfully"

        })

    } catch (error) {

        console.error(error)

        return res.status(500).json({

            error: "Internal server error"

        })

    }

}


// ===============================
// EXPORT
// ===============================

module.exports = {

    addProduct: [
        upload.single("file"),
        addProduct
    ],

    getProductByFirm,

    deleteProductById

}