const express=require('express')
const mongoose=require('mongoose')
const dotEnv=require('dotenv')
const vendorRoute=require('./routes/vendorRoute')
const firmRoutes=require('./routes/firmRouts')
const productRoutes=require('./routes/productsRoutes')
const cors=require('cors')
const path=require('path')
dotEnv.config()

const app=express()
//database connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('mongoDb connected succusful'))
.catch((err)=>console.log(err))

//middleWare
app.use(express.json())
app.use(cors())
app.use('/uploads',express.static('uploads'))
app.use(express.urlencoded({extended:true}))
//routes
app.use('/vendor',vendorRoute)
app.use('/firm',firmRoutes)
app.use('/product',productRoutes)
app.use('/',(req,res)=>res.send("'this is home route"))

//server
const PORT =process.env.PORT||4000
app.listen(PORT,()=>{console.log(`server started succusful ${PORT}`)})