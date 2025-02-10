const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel')
const mongoose = require('mongoose');

//get cart items

router.get('/',async (req,res)=>{
try{
   let cartItems = await Cart.find().populate('product_id')  // Populate the product details
   .exec();
   res.status(200).json(cartItems)
}catch(err){
    res.status(500).json({message:err.message})
}
})


//add item to cart
router.post('/',async (req,res)=>{
    try{
        let {productId} = req.body
        let product = await Cart.findOne({product_id:productId}).exec();
        if(product) return res.status(404).json({ message: 'item already exists' });
            cart = new Cart({
                product_id:productId,
                quantity:1
            });
    await cart.save();
    res.status(201).json({ message: "Product added to cart", cart });


    }catch(err){
        res.status(500).json({message:err.message})
    }
    })
    

//update cart item quantity

router.put('/:id', async (req,res)=>{
    try{
        let { quantity } = req.body;
        if (!quantity) return res.status(400).json({ message: "quantity is required" });

        const productId = new mongoose.Types.ObjectId(req.params.id);

        // Use findOne() instead of find() to get a single document
        let cartItem = await Cart.findOne({ product_id: productId }).exec();

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Increase the quantity
        cartItem.quantity += quantity;

        // Save the updated cart item
        await cartItem.save();

        res.status(200).json(cartItem);
    }catch(err){
        res.status(500).json({message:err.message})
    }
    })

//remove item from cart

router.delete('/:id', async (req, res) => {
    try {
        const productId = new mongoose.Types.ObjectId(req.params.id);

        // Use findOneAndDelete to delete based on product_id instead of _id
        let cartItem = await Cart.findOneAndDelete({ product_id: productId }).exec();

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: "Cart item deleted successfully", cartItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router