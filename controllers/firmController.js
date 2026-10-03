const Firm = require('../models/Firm')
const Vendor = require('../models/Vendor')
const multer = require('multer')
const path = require('path')
const fs = require('fs')


// ======================================
// UPLOADS FOLDER
// ======================================

const uploadPath = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}


// ======================================
// MULTER STORAGE
// ======================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },

  filename: function (req, file, cb) {

    const extension =
      path.extname(file.originalname)

    const filename =
      Date.now() + extension

    cb(null, filename)
  }

})

const upload = multer({
  storage: storage
})


// ======================================
// ADD FIRM
// ======================================

const addFirm = async (req, res) => {

  try {

    console.log('==============================')
    console.log('ADD FIRM REQUEST')
    console.log('==============================')

    console.log('BODY:', req.body)
    console.log('FILE:', req.file)
    console.log('VENDOR ID:', req.vendorId)


    // ------------------------------
    // Get form data
    // ------------------------------

    const {
      firmName,
      area,
      category,
      region,
      offer
    } = req.body


    // ------------------------------
    // Find vendor
    // ------------------------------

    const vendor = await Vendor.findById(
      req.vendorId
    )

    if (!vendor) {

      return res.status(404).json({
        message: 'Vendor not found'
      })

    }


    // ------------------------------
    // Image
    // ------------------------------

    const image = req.file
      ? req.file.filename
      : ''


    console.log('IMAGE NAME:', image)


    // ------------------------------
    // Create Firm
    // ------------------------------

    const firm = new Firm({

      firmName: firmName,

      area: area,

      category: category,

      region: region,

      offer: offer,

      image: image,

      vendor: [
        vendor._id
      ]

    })


    // ------------------------------
    // Save Firm
    // ------------------------------

    const savedFirm = await firm.save()

    console.log(
      'FIRM SAVED:',
      savedFirm._id
    )


    // ------------------------------
    // Add Firm to Vendor
    // ------------------------------

    if (!Array.isArray(vendor.firm)) {
      vendor.firm = []
    }

    vendor.firm.push(
      savedFirm._id
    )

    await vendor.save()


    console.log(
      'FIRM ADDED TO VENDOR'
    )


    // ------------------------------
    // Response
    // ------------------------------

    return res.status(201).json({

      message: 'Firm added successfully',

      firmId: savedFirm._id,

      firm: savedFirm

    })

  } catch (error) {

    console.error(
      '=============================='
    )

    console.error(
      'ADD FIRM ERROR:',
      error
    )

    console.error(
      'ERROR MESSAGE:',
      error.message
    )

    console.error(
      '=============================='
    )


    return res.status(500).json({

      message: 'Internal server error',

      error: error.message

    })

  }

}


// ======================================
// DELETE FIRM
// ======================================

const deleteFirmById = async (req, res) => {

  try {

    const firmId = req.params.firmId

    const deletedFirm =
      await Firm.findByIdAndDelete(firmId)


    if (!deletedFirm) {

      return res.status(404).json({
        error: 'No Firm Found'
      })

    }


    return res.status(200).json({

      message: 'Firm deleted successfully'

    })

  } catch (error) {

    console.error(
      'DELETE FIRM ERROR:',
      error
    )

    return res.status(500).json({

      error: 'Internal server error'

    })

  }

}


// ======================================
// EXPORT
// ======================================

module.exports = {

  addFirm: [
    upload.single('file'),
    addFirm
  ],

  deleteFirmById

}