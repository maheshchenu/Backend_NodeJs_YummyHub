const mongoose=require('mongoose')


const FirmSchema=new mongoose.Schema({
      firmName:{
        type:String,
        required:true,
        unique:true
      },
      area:{
        type:String,
        required:true
      },
      category:{
          type:[
            {
              type:String,
              enum:["veg","non-veg"]
            }
          ]
      },
      region:{
        type:[
          {
            type:String,
            enum:['south indian','north indian',"chinese",'bakery']
          }
        ]
      },
      offer:{
        type:String,
      },
      image:{
        type:String
      },
      vendor:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:"Vendor"
        }
      ],
      products:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Product'
        }
      ]

})
const Firm=mongoose.model('Firm',FirmSchema)

module.exports=Firm