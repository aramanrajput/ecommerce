// Import necessary functions
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store';

// Interfaces for product and cart state
interface Rating {
  rate: number;
  count: number;
}

interface ProductDetails {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

interface Product {
  _id: string;
  quantity: number;
  product_id: ProductDetails;
}

interface CartState {
  cartItems: Product[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
};

// ✅ Async thunk to fetch cart items
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Async thunk for adding a product to the cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      await response.json();
      dispatch(fetchCartItems()); // 🔄 Fetch updated cart after adding
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Async thunk for updating cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }: { id: string; quantity: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      await response.json();
      dispatch(fetchCartItems()); // 🔄 Fetch updated cart after updating
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Async thunk for removing a cart item
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/cart/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove cart item');
      }

      await response.json();
      dispatch(fetchCartItems()); // 🔄 Fetch updated cart after removing
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload; // 🔄 Update state with fresh data
        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;
