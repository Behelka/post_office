import React, { useState, useEffect } from 'react';
import "./Shop.css";
import { SERVER_URL } from "../../App";

function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [balance, setBalance] = useState(null);

  const customerID = localStorage.getItem("Customer_ID");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/shop`);
        const data = await response.json();
        setProducts(data);

        // Get blance
        const balanceResponse = await fetch(`${SERVER_URL}/api/customer/balance?customerID=${customerID}`);
        const balanceData = await balanceResponse.json();
        setBalance(balanceData.balance);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [customerID]);

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
      <h2>Balance: ${balance}</h2>
      <ProductList products={products} addToCart={addToCart} />
      <Cart cart={cart} removeFromCart={removeFromCart} />
      <Checkout cart={cart} clearCart={clearCart} customerID={customerID} balance={balance} />
    </div>
  );
}

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

const Checkout = ({ cart, clearCart, customerID,balance }) => {
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    // Count total
    const totalAmount = cart.reduce((total, item) => total + parseFloat(item.Product_Price), 0);
  
    if (totalAmount > balance) {
      alert("Balance not enough, please try again!");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, customerID, totalAmount }) // Send total
      });
      if (response.ok) {
        alert("Payment success!");
        clearCart();
        window.location.reload()

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

export default Shop;
