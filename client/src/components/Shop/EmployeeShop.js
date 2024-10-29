// EmployeeShop.js
import React, { useState, useEffect } from 'react';
import "./Shop.css";

/* product array */
const initialProducts = [
  { id: 1, name: 'Stamp', price: 0.5 },
  { id: 2, name: 'Envelope', price: 1 },
  { id: 3, name: 'Postcard', price: 0.75 },
  { id: 4, name: 'Small Package', price: 5 },
  { id: 5, name: 'Medium Package', price: 7 },
  { id: 6, name: 'Large Package', price: 10 }
];

const EmployeeShop = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/shop', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (newProduct) => {
    try {
      await fetch('http://localhost:3001/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      fetchProducts(); // Refresh the product list
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
    }
  };

  const editProduct = async (updatedProduct) => {
    try {
      await fetch('http://localhost:3001/shop', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      fetchProducts(); // Refresh the product list
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  const deleteProduct = async (id) => {
    try {
    await fetch(`http://localhost:3001/shop/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Product_ID: id }),
      });
      fetchProducts(); // Refresh the product list
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  return (
    <div className="Shop">
      {error && <div className="error-message">{error}</div>}
      <ProductList products={products} deleteProduct={deleteProduct} setEditingProduct={setEditingProduct} />
      <AdminControls addProduct={addProduct} editProduct={editProduct} editingProduct={editingProduct} setEditingProduct={setEditingProduct} />
    </div>
  );
};

export default EmployeeShop;