import React, { useState } from 'react';
import "./Shop.css"
import cartImg from '../../assets/cart.jpg'

/*still need to work on making the images in the shop display right*/
const products = [
    { id: 1, name: 'Stamp', price: 0.5 },
    { id: 2, name: 'Envelope', price: 1 },
    { id: 3, name: 'Postcard', price: 0.75 },
    { id: 4, name: 'Small Package', price: 5 },
    { id: 5, name: 'Medium Package', price: 7},
    { id: 6, name: 'Large Package', price: 10}
  ];

  const ProductList = ({ products, addToCart }) => {
    return (
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-box">
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    );
  };

  const Cart = ({ cart, removeFromCart }) => {
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  
    return (
      <div>
        <h2>Shopping Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price.toFixed(2)}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
      </div>
    );
  };

  const Checkout = ({ cart }) => {
    const handleCheckout = () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        alert("Payment success!");
      }
    };
  
    return (
      <div>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    );
  };  
  
  function Shop() {
    const [cart, setCart] = useState([]);
  
    const addToCart = (product) => {
      setCart([...cart, product]);
    };
  
    const removeFromCart = (productId) => {
      setCart(cart.filter(item => item.id !== productId));
    };
  
    return (
      <div className="Shop">
        
        {/* <img src={cartImg} alt="Shopping Cart" className="cartImg"></img> */}
        <ProductList products={products} addToCart={addToCart} />
        <Cart cart={cart} removeFromCart={removeFromCart} />
        <Checkout cart={cart} />
      </div>
    );
  }

export default Shop;