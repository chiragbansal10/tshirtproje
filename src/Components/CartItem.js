
import React from 'react';
import '../Styles/CartItem.css';

function CartItem({ item, updateQuantity, removeFromCart }) {
  return (
    <div className="cart-item">
      <div className='product-cart-image'>
      <img src={item.image} alt={item.name} className="cart-item-image" />

      </div>
      <div className='cart-item-info'>
        <h4>{item.name}</h4>
        <p>Rs {item.price}</p>
      </div>
      <span className='quantity-label'>
        Qty: {item.quantity}
        <button 
        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
        className='quantity-button'
      >
        +
      </button>
      </span>
      
    
      <button 
        onClick={() => removeFromCart(item.id)} 
        className='delete-button'
      >
        Delete
      </button>
    </div>
  );
}

export default CartItem;
