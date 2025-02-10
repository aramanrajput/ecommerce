const {Schema,model} = require('mongoose')

const cartSchema = new Schema({
quantity : {type: Number, required: true},
product_id : {type: Schema.Types.ObjectId, ref: 'product'}
})

module.exports = model('cart',cartSchema)