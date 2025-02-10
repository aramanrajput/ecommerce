const express = require('express');
const router = express.Router();
const product = require('../models/productModel')

router.get('/',async (req,res)=>{
try{
let Products = await product.find().lean().exec()
return res.status(200).json(Products)
}catch(err){
    res.status(500).json({message:err.message})
}
})





module.exports = router