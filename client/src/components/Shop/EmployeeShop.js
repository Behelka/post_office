// EmployeeShop.js
import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import AdminControls from './AdminControls';
import './Shop.css';

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
      await fetch('http://localhost:3001/shop', {
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
