const express=require('express')
const router=express.Router()
const vendorController=require('../controllers/vendorControler')
 router.post('/register',vendorController.vendorRegister)
 router.post('/login',vendorController.vendorLogin)

 router.get('/all-vendors',vendorController.getAllVendors)
 router.get('/single-vendor/:id',vendorController.getVenderById)
 module.exports=router