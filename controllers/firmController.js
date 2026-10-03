const Firm = require('../models/Firm')
const Vendor = require('../models/Vendor')
const multer = require('multer')
const path = require('path')


// ===============================
// MULTER STORAGE
// ===============================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, 'uploads/')

  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      '-' +
      file.originalname

    cb(null, uniqueName)

  }

})


const upload = multer({
  storage: storage
})


// ===============================
// ADD FIRM
// ===============================

const addFirm = async (req, res) => {

  try {

    console.log('BODY:', req.body)

    console.log('FILE:', req.file)

    console.log('VENDOR ID:', req.vendorId)


    const {
      firmName,
      area,
      category,
      region,
      offer
    } = req.body


    // Check vendor
    const vendor = await Vendor.findById(
      req.vendorId
    )


    if (!vendor) {

      return res.status(404).json({
        message: 'Vendor not found'
      })

    }


    // Image
    const image = req.file
      ? req.file.filename
      : undefined


    // Create firm
    const firm = new Firm({

      firmName,

      area,

      category,

      region,

      offer,

      image,

      vendor: [
        vendor._id
      ]

    })


    // Save firm
    const savedFirm = await firm.save()


    // Add firm to vendor
    vendor.firm.push(savedFirm._id)

    await vendor.save()


    return res.status(201).json({

      message: 'Firm added successfully',

      firmId: savedFirm._id,

      firm: savedFirm

    })

  } catch (error) {

    console.error(
      'ADD FIRM ERROR:',
      error
    )


    return res.status(500).json({

      message: 'Internal server error',

      error: error.message

    })

  }

}


// ===============================
// DELETE FIRM
// ===============================

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


// ===============================
// EXPORT
// ===============================

module.exports = {

  addFirm: [
    upload.single('file'),
    addFirm
  ],

  deleteFirmById

}