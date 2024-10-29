import React, { useState, useEffect } from 'react';

const AdminControls = ({ addProduct, editProduct, editingProduct, setEditingProduct }) => {
  const [productData, setProductData] = useState({
    Product_Name: '',
    Product_Stock: '',
    Product_Price: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setProductData({
        Product_ID: editingProduct.Product_ID,
        Product_Name: editingProduct.Product_Name,
        Product_Stock: editingProduct.Product_Stock,
        Product_Price: editingProduct.Product_Price
      });
    } else {
      setProductData({
        Product_Name: '',
        Product_Stock: '',
        Product_Price: ''
      });
    }
  }, [editingProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      editProduct(productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }
    setProductData({
      Product_Name: '',
      Product_Stock: '',
      Product_Price: ''
    });
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-controls">
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Product_Name"
          placeholder="Product Name"
          value={productData.Product_Name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="Product_Stock"
          placeholder="Product Stock"
          value={productData.Product_Stock}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="Product_Price"
          placeholder="Product Price"
          value={productData.Product_Price}
          onChange={handleChange}
          required
          step="0.01"
        />
        <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
        {editingProduct && (
          <button type="button" onClick={() => setEditingProduct(null)}>
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
};

export default AdminControls;