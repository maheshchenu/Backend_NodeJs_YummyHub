const Vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const secretKey = process.env.KEY

const verifyToken = async (req, res, next) => {

  const token = req.headers.token

  // Check token
  if (!token) {
    return res.status(401).json({
      error: 'Token is required'
    })
  }

  try {

    // Verify JWT
    const decoded = jwt.verify(
      token,
      secretKey
    )

    console.log('Decoded Token:', decoded)

    // Find vendor
    const vendor = await Vendor.findById(
      decoded.vendorId
    )

    if (!vendor) {
      return res.status(404).json({
        error: 'Vendor not found'
      })
    }

    // Store vendor ID for next middleware/controller
    req.vendorId = vendor._id

    console.log(
      'Authenticated Vendor ID:',
      req.vendorId
    )

    next()

  } catch (error) {

    console.error(
      'Token verification error:',
      error.message
    )

    return res.status(401).json({
      error: 'Invalid token'
    })
  }
}

module.exports = verifyToken