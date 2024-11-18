
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleCartClick = (e) => {
    e.preventDefault(); 
    navigate('/cart'); 
  };

  return (
    <header className="header">
      <h1>TeeRex Store</h1>
      <div className="cart-icon">
        <span>Products</span>
        <a href="/cart" onClick={handleCartClick} role="button" aria-label="cart">
          🛒
        </a>
      </div>
    </header>
  );
};

export default Header;
