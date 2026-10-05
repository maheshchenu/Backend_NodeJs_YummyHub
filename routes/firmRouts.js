const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verifyToken')
const firmController = require('../controllers/firmController')

// Add Firm
router.post(
'/add-firm',
verifyToken,
...firmController.addFirm
)

// Delete Firm
router.delete(
'/delete-firm/:firmId',
verifyToken,
firmController.deleteFirmById
)

module.exports = router
