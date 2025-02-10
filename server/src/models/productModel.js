const {Schema , model} = require('mongoose')

const productSchema = new Schema({


    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    rating: {
        rate: { type: Number, required: true },
        count: { type: Number, required: true }
    }
})

module.exports = model ('product', productSchema)