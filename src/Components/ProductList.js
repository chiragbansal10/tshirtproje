
import React from 'react';

function ProductList({ products, addToCart }) {
    return (
        <div className="product-containers">
            {products.map((product) => (
                <div key={product.id} className="product-cards">
                <div className='product-image'>


               
                    <h3 className='product-name'>{product.name}</h3> </div>
                   
                    <div className='product-details'><p>Rs {product.price}</p>
                    <button onClick={() => addToCart(product)} className='add-to-cart'>Add to Cart</button></div>
                    
                </div>
            ))}
        </div>
    );
}

export default ProductList;
