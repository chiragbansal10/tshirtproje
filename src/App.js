
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './Components/ProductList';
import Cart from './Components/Cart';
import Sidebar from './Components/Sidebar';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filters, setFilters] = useState({
    gender: [],
    color: [],
    type: [],
    price: []
  });

  useEffect(() => {
    axios.get('https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setErrorMessage(''); 
    setCart(prevCart => {
      const itemExists = prevCart.find(item => item.id === product.id);
      const newQuantity = itemExists ? itemExists.quantity + 1 : 1;

      if (newQuantity > product.stock) {
        setErrorMessage(`Only ${product.stock} items available for ${product.name}`);
        return prevCart;
      }

      if (itemExists) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (quantity > product.stock) {
      setErrorMessage(`Only ${product.stock} items available for ${product.name}`);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => {
      const isChecked = prevFilters[category].includes(value);
      const updatedCategory = isChecked
        ? prevFilters[category].filter(item => item !== value)
        : [...prevFilters[category], value];
      return { ...prevFilters, [category]: updatedCategory };
    });
  };

  const applyFilters = () => {
    let filtered = products;
    if (filters.color && filters.color.length > 0) {
      filtered = filtered.filter(product => filters.color.includes(product.color));
    }
    if (filters.gender && filters.gender.length > 0) {
      filtered = filtered.filter(product => filters.gender.includes(product.gender));
    }
    if (filters.price && filters.price.length > 0) {
      filtered = filtered.filter(product => {
        const price = product.price;
        return filters.price.some(range => {
          if (range === '0-Rs250') return price <= 250;
          if (range === 'Rs251-450') return price > 250 && price <= 450;
          if (range === 'Rs450') return price > 450;
          return false;
        });
      });
    }
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(product => filters.type.includes(product.type));
    }
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

 
  
  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (query === '') {
      setFilteredProducts(products);
    } else {
      const searchedProducts = products.filter(product => {
        const name = product.name ? product.name.toLowerCase() : '';
        const color = product.color ? product.color.toLowerCase() : '';
        const type = product.type ? product.type.toLowerCase() : '';
        
        return (
          name.includes(query) ||
          color.includes(query) ||
          type.includes(query)
        );
      });
      setFilteredProducts(searchedProducts);
    }
  };
  
  const MainContent = () => {
    return (
      <div className="app">
      <Header />
        
        <div className="main-content">
          <Sidebar filters={filters} onFilterChange={handleFilterChange} />
          <div className="product-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for products..."
                className='search-input'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="search-button-container" onClick={handleSearch}>Search</button>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <ProductList products={filteredProducts} addToCart={addToCart} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
      </Routes>
    </Router>
  );
}

export default App;

