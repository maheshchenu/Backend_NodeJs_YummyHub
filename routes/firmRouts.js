const express = require('express')
const path = require('path')

const firmController =
  require('../controllers/firmController')

const verifyToken =
  require('../middlewares/verifyToken')

const router = express.Router()


// ADD FIRM

router.post(
  '/add-firm',
  verifyToken,
  firmController.addFirm
)


// GET IMAGE

router.get(
  '/uploads/:imageName',
  (req, res) => {

    const imageName =
      req.params.imageName

    const imagePath =
      path.join(
        __dirname,
        '..',
        'uploads',
        imageName
      )

    res.sendFile(imagePath)

  }
)


// DELETE FIRM

router.delete(
  '/:firmId',
  firmController.deleteFirmById
)


module.exports = router