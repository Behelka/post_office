import React, { useState, useEffect } from 'react';
import "./Shop.css";

import { SERVER_URL } from "../../App";

const ProductList = ({ products, addToCart }) => {
  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product.Product_ID} className="product-box">
          <h3>{product.Product_Name}</h3>
          <p>${parseFloat(product.Product_Price).toFixed(2)}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

const Cart = ({ cart, removeFromCart }) => {
  const totalPrice = cart.reduce((total, item) => total + parseFloat(item.Product_Price), 0);

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.Product_Name} - ${parseFloat(item.Product_Price).toFixed(2)}
            <button onClick={() => removeFromCart(item.Product_ID)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
    </div>
  );
};

const Checkout = ({ cart, clearCart }) => {
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
      });
      if (response.ok) {
        alert("Payment success!");
        clearCart();
      } else {
        alert("Payment failed.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Error processing your payment.");
    }
  };

  return (
    <div>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/shop`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.Product_ID !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="Shop">
      <ProductList products={products} addToCart={addToCart} />
      <Cart cart={cart} removeFromCart={removeFromCart} />
      <Checkout cart={cart} clearCart={clearCart} />
    </div>
  );
}

export default Shop;
