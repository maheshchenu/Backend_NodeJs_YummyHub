const Product = require("../models/Product")
const Firm = require("../models/Firm")
const multer = require("multer")
const path = require("path")
const fs = require("fs")


// ======================================
// CREATE UPLOADS FOLDER
// ======================================

const uploadPath = path.join(__dirname, "..", "uploads")

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}


// ======================================
// MULTER
// ======================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadPath)
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


// ======================================
// ADD PRODUCT
// ======================================

const addProduct = async (req, res) => {

    try {

        console.log("================================")
        console.log("ADD PRODUCT")
        console.log("================================")

        console.log("BODY:", req.body)
        console.log("FILE:", req.file)
        console.log("FIRM ID:", req.params.firmId)
        console.log("VENDOR ID:", req.vendorId)


        const {
            productName,
            price,
            category,
            bestSeller,
            description,
            offer
        } = req.body


        // ==================================
        // VALIDATION
        // ==================================

        if (!productName) {
            return res.status(400).json({
                error: "Product name is required"
            })
        }

        if (!price) {
            return res.status(400).json({
                error: "Price is required"
            })
        }

        if (!category) {
            return res.status(400).json({
                error: "Category is required"
            })
        }

        if (!["veg", "non-veg"].includes(category)) {
            return res.status(400).json({
                error: "Category must be veg or non-veg"
            })
        }

        if (!bestSeller) {
            return res.status(400).json({
                error: "Best Seller is required"
            })
        }

        if (!description) {
            return res.status(400).json({
                error: "Description is required"
            })
        }

        if (!offer) {
            return res.status(400).json({
                error: "Offer is required"
            })
        }


        // ==================================
        // IMAGE
        // ==================================

        if (!req.file) {

            return res.status(400).json({
                error: "Product image is required"
            })

        }

        const image = req.file.filename


        // ==================================
        // FIRM ID
        // ==================================

        const firmId = req.params.firmId

        if (!firmId) {

            return res.status(400).json({
                error: "Firm ID is required"
            })

        }


        // ==================================
        // FIND FIRM
        // ==================================

        const firm =
            await Firm.findById(firmId)

        if (!firm) {

            return res.status(404).json({
                error: "No firm found"
            })

        }

        console.log(
            "FIRM FOUND:",
            firm._id
        )


        // ==================================
        // CREATE PRODUCT
        // ==================================

        const product =
            new Product({

                productName: productName,

                price: price,

                category: category,

                bestSeller: bestSeller,

                description: description,

                offer: offer,

                image: image,

                firm: [
                    firm._id
                ]

            })


        console.log(
            "PRODUCT BEFORE SAVE:",
            product
        )


        // ==================================
        // SAVE PRODUCT
        // ==================================

        const savedProduct =
            await product.save()

        console.log(
            "PRODUCT SAVED:",
            savedProduct._id
        )


        // ==================================
        // ADD PRODUCT TO FIRM
        // ==================================

        if (!Array.isArray(firm.products)) {
            firm.products = []
        }

        firm.products.push(
            savedProduct._id
        )

        await firm.save()


        console.log(
            "PRODUCT ADDED TO FIRM"
        )


        // ==================================
        // RESPONSE
        // ==================================

        return res.status(201).json({

            message:
                "Product added successfully",

            productId:
                savedProduct._id,

            product:
                savedProduct

        })


    } catch (error) {

        console.error(
            "================================"
        )

        console.error(
            "ADD PRODUCT ERROR:",
            error
        )

        console.error(
            "ERROR MESSAGE:",
            error.message
        )

        console.error(
            "ERROR NAME:",
            error.name
        )

        console.error(
            "================================"
        )


        return res.status(500).json({

            error:
                "Internal server error",

            message:
                error.message

        })

    }

}


// ======================================
// GET PRODUCTS BY FIRM
// ======================================

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

        console.error(
            "GET PRODUCTS ERROR:",
            error
        )

        return res.status(500).json({

            error:
                "Internal server error",

            message:
                error.message

        })

    }

}


// ======================================
// DELETE PRODUCT
// ======================================

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

                error:
                    "No Product Found"

            })

        }

        return res.status(200).json({

            message:
                "Product deleted successfully"

        })

    } catch (error) {

        console.error(
            "DELETE PRODUCT ERROR:",
            error
        )

        return res.status(500).json({

            error:
                "Internal server error",

            message:
                error.message

        })

    }

}


// ======================================
// EXPORT
// ======================================

module.exports = {

    addProduct: [
        upload.single("file"),
        addProduct
    ],

    getProductByFirm,

    deleteProductById

}