const express = require('express')
const app = express()
const connection = require('../src/configs/db')
const cors = require('cors');
require('dotenv').config();


const ProductRouter = require('../src/controllers/productController')
const CartRouter = require('../src/controllers/cartController')

app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend origin
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization' // Allowed headers
  }));

app.use(express.json())
app.use('/products',ProductRouter)
app.use('/cart',CartRouter)


app.listen(8000,async ()=>{
    await connection().then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));
    
    console.log('Server is running on port 8000')
})
module.exports = app