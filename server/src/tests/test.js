const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Import your Express app
const Cart = require('../models/cartModel');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Cart.deleteMany(); // Clear the collection before each test
});

describe('Cart API Tests', () => {
    
    // 🔹 Test GET /cart (fetch cart items)
    it('should fetch all cart items (empty initially)', async () => {
        const res = await request(app).get('/cart');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]); // Should return empty array initially
    });

    // 🔹 Test POST /cart (add item to cart)
    it('should add a product to the cart', async () => {
        const productId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .post('/cart')
            .send({ productId });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Product added to cart');
        expect(res.body.cart).toHaveProperty('product_id', productId.toString());
        expect(res.body.cart).toHaveProperty('quantity', 1);
    });

    // 🔹 Test POST /cart (duplicate item)
    it('should not allow adding the same product twice', async () => {
        const productId = new mongoose.Types.ObjectId();

        // First request to add product
        await request(app).post('/cart').send({ productId });

        // Second request should fail
        const res = await request(app).post('/cart').send({ productId });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'item already exists');
    });

    // 🔹 Test PUT /cart/:id (update quantity)
    it('should update cart item quantity', async () => {
        const productId = new mongoose.Types.ObjectId();
        await request(app).post('/cart').send({ productId });

        const res = await request(app).put(`/cart/${productId}`).send({ quantity: 2 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('quantity', 3); // 1 (default) + 2 (update)
    });

    // 🔹 Test PUT /cart/:id (invalid update)
    it('should return 404 when updating a non-existing cart item', async () => {
        const fakeProductId = new mongoose.Types.ObjectId();

        const res = await request(app).put(`/cart/${fakeProductId}`).send({ quantity: 2 });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Cart item not found');
    });

    // 🔹 Test DELETE /cart/:id (remove item)
    it('should delete an item from the cart', async () => {
        const productId = new mongoose.Types.ObjectId();
        await request(app).post('/cart').send({ productId });

        const res = await request(app).delete(`/cart/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Cart item deleted successfully');
    });

    // 🔹 Test DELETE /cart/:id (non-existing item)
    it('should return 404 when deleting a non-existing item', async () => {
        const fakeProductId = new mongoose.Types.ObjectId();

        const res = await request(app).delete(`/cart/${fakeProductId}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Cart item not found');
    });

});
