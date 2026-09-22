const Vendor=require('../models/Vendor')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken') 
const dotEnv=require('dotenv')

dotEnv.config()
const secretKey=process.env.KEY
const vendorRegister=async(req,res)=>{
   const {username,email,password}=req.body
  try {
    const existingVendor=await Vendor.findOne({email})
      if(existingVendor){
        return res.status(400).json({message:'email already taken'})
      }
    const hashedPassword=await bcrypt.hash(password,10)
    const newVendor=new Vendor({
        username,
        email,
        password:hashedPassword
    })
    await newVendor.save()
    res.status(201).json({message:'Vendor registered succusfull'})
    console.log('user registred succufull')
  } catch (error) {
    res.status(500).json({error:'Internal server Error'}) 
    console.log(error)
  }
}
const vendorLogin=async(req,res)=>{
  const {email,password}=req.body
  try {
     const existingVendor=await Vendor.findOne({email})
     if(!existingVendor ||!(await bcrypt.compare(password,existingVendor.password))){
      return  res.status(401).json({error:'invalid username or password'})
     }
     const token=jwt.sign({vendorId:existingVendor._id},secretKey,{expiresIn:'1hr'})
     res.status(200).json({succuss:'login succusfull',token})
  } catch (error) {
    console.log(error)
    res.status(500).json({error:'internal server error'})
  }
}

 const getAllVendors=async(req,res)=>{
    try {
      const vendors=await Vendor.find().populate('firm')
        res.json({vendors})
    } catch (error) { 
    console.log(error)
    res.status(500).json({error:'internal server error'})
  }
 }
 const getVenderById=async(req,res)=>{
  const vendorId=req.params.id
  try {
    const vendor=await Vendor.findById(vendorId).populate('firm')
    if(!vendor){
      return res.status(404).json({error:'vendor not found'})
    }
    res.status(200).json({vendor})
  } catch (error) {
    console.log(error)
    res.status(500).json({error:'internal server error'})
  }
 }
module.exports={vendorRegister,vendorLogin,getAllVendors,getVenderById}