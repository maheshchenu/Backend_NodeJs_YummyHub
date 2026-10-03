const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true
    },

    price: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: ["veg", "non-veg"],
        required: true
    },

    image: {
        type: String
    },

    bestSeller: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    offer: {
        type: String,
        required: true
    },

    firm: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Firm"
        }
    ]

})

const Product = mongoose.model("Products", productSchema)

module.exports = Product