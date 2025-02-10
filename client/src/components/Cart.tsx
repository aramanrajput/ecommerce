import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {updateCartItem, removeCartItem, fetchCartItems } from '../redux/features/cart/cartSlice';
import { RootState } from '../redux/store'; // Assuming you have RootState defined
import { AppDispatch } from '../redux/store';
import { Typography } from '@mui/material';


  


const Cart = () => {
 const dispatch = useDispatch<AppDispatch>()
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateCartItem({ id, quantity }));
  };

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeCartItem(id));
  };

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]); // Only fetch cart items when the dispatch function changes

  return (

    <div>
      {cartItems.length === 0 ? (
        <h2>Your cart is empty</h2> // Display message when cart is empty
      ) : (
        cartItems.map((item) => (
          <div >
            <Typography>Title : {item.product_id.title}</Typography>
            <Typography> Quantity : {item.quantity}</Typography>
            <img style={{ width: '100px', height: '100px' }} src={item.product_id.image} alt={item.product_id.title} />
            <button onClick={() => handleUpdateQuantity(item.product_id._id, 1)}>+</button>
            <button disabled={item.quantity<=1} onClick={() => handleUpdateQuantity(item.product_id._id, -1) }>-</button>
            <button onClick={() => handleRemoveFromCart(item.product_id._id)}>Remove from Cart</button>
          </div>
        ))
      )}
    </div>
  );
  
};

export default Cart;
