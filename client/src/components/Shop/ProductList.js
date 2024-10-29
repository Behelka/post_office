<<<<<<< HEAD
// ProductList.js
=======
>>>>>>> a6bfd33420bf5ff922dd4944bd827f9201a20530
import React from 'react';

const ProductList = ({ products, deleteProduct, setEditingProduct }) => {
  if (!Array.isArray(products)) {
    return <div>No products available</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.Product_ID} className="product-box">
          <h3>{product.Product_Name}</h3>
          <p>${Number(product.Product_Price).toFixed(2)}</p>
          <p>Stock: {product.Product_Stock}</p>
          <button onClick={() => setEditingProduct(product)}>Edit</button>
          <button onClick={() => deleteProduct(product.Product_ID)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

<<<<<<< HEAD
export default ProductList;
=======
export default ProductList;
>>>>>>> a6bfd33420bf5ff922dd4944bd827f9201a20530
