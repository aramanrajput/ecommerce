import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Grid';

import { Typography } from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { addToCart } from '../redux/features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import Cart from "../components/Cart"
// Define the type for product data
interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  category: string;
  description: string;
}

// Define the type for component state
interface ProductListState {
  products: Product[];
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const ProductList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
  const [products, setProducts] = useState<Product[]>([]); // Using Product type for state

  useEffect(() => {
    getproducts();
  }, []);

  // Fetch products and update state
  async function getproducts() {
    let res = await fetch('http://localhost:8000/products');
    let data: Product[] = await res.json(); // Ensuring the data matches the Product type
    setProducts(data);
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
    {/* Product List */}
    <Grid2 container spacing={2} columns={12} sx={{ flexGrow: 1 }}>
      {products.map((e, i) => (
        <Grid2 item xs={12} sm={6} md={4} key={i}>
          <Item>
            <img style={{ width: '100px', height: '100px' }} src={e.image} alt={e.title} />
            <Typography>{e.title}</Typography>
            <Typography>{e._id}</Typography>
            <Button onClick={() => dispatch(addToCart(e._id))}>Add to cart</Button>
          </Item>
        </Grid2>
      ))}
    </Grid2>

    {/* Sidebar for Cart */}
    <Box sx={{ width: 300, flexShrink: 0, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Shopping Cart
      </Typography>
     <Cart></Cart>
    </Box>
  </Box>
  );
};

export default ProductList;
