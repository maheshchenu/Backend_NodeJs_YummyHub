const Vendor = require('../models/Vendor')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotEnv = require('dotenv')

dotEnv.config()

const secretKey = process.env.KEY


// ======================================
// VENDOR REGISTER
// ======================================

const vendorRegister = async (req, res) => {

    const { username, email, password } = req.body

    try {

        const existingVendor = await Vendor.findOne({ email })

        if (existingVendor) {

            return res.status(400).json({
                message: 'Email already taken'
            })

        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        )

        const newVendor = new Vendor({

            username,
            email,
            password: hashedPassword

        })

        await newVendor.save()

        console.log('User registered successfully')

        res.status(201).json({

            message: 'Vendor registered successfully'

        })

    } catch (error) {

        console.log(error)

        res.status(500).json({

            error: 'Internal server error'

        })

    }
}


// ======================================
// VENDOR LOGIN
// ======================================

const vendorLogin = async (req, res) => {

    const { email, password } = req.body

    try {

        // Find vendor and populate firm
        const existingVendor = await Vendor
            .findOne({ email })
            .populate('firm')


        // Check vendor
        if (!existingVendor) {

            return res.status(401).json({

                error: 'Invalid email or password'

            })

        }


        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            existingVendor.password
        )


        if (!passwordMatch) {

            return res.status(401).json({

                error: 'Invalid email or password'

            })

        }


        // Create JWT token
        const token = jwt.sign(

            {
                vendorId: existingVendor._id
            },

            secretKey,

            {
                expiresIn: '1hr'
            }

        )


        // Login response
        res.status(200).json({

            success: true,

            message: 'Login successful',

            token: token,

            vendor: {

                _id: existingVendor._id,

                username: existingVendor.username,

                email: existingVendor.email,

                firm: existingVendor.firm || []

            }

        })


    } catch (error) {

        console.log('Login error:', error)

        res.status(500).json({

            error: 'Internal server error'

        })

    }
}


// ======================================
// GET ALL VENDORS
// ======================================

const getAllVendors = async (req, res) => {

    try {

        const vendors = await Vendor
            .find()
            .populate('firm')

        res.status(200).json({

            vendors

        })

    } catch (error) {

        console.log(error)

        res.status(500).json({

            error: 'Internal server error'

        })

    }
}


// ======================================
// GET VENDOR BY ID
// ======================================

const getVenderById = async (req, res) => {

    const vendorId = req.params.id

    try {

        const vendor = await Vendor
            .findById(vendorId)
            .populate('firm')


        if (!vendor) {

            return res.status(404).json({

                error: 'Vendor not found'

            })

        }


        res.status(200).json({

            vendor

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({

            error: 'Internal server error'

        })

    }
}


// ======================================
// EXPORT
// ======================================

module.exports = {

    vendorRegister,

    vendorLogin,

    getAllVendors,

    getVenderById

}