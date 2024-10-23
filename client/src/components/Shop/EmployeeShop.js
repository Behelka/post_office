// import React, { useState, useEffect } from 'react';
// import "./Shop.css"
// import cartImg from '../../assets/cart.jpg'

// /*still need to work on making the images in the shop display right*/
// const products = [
//     { id: 1, name: 'Stamp', price: 0.5 },
//     { id: 2, name: 'Envelope', price: 1 },
//     { id: 3, name: 'Postcard', price: 0.75 },
//     { id: 4, name: 'Small Package', price: 5 },
//     { id: 5, name: 'Medium Package', price: 7},
//     { id: 6, name: 'Large Package', price: 10}
//   ];

//   /* Admin, Manager and Employee Controls */
//   const addProduct = (newProduct) => {
//     setProducts([...products, { ...newProduct, id: Date.now() }]);
//   };

//   const editProduct = (updatedProduct) => {
//     setProducts(
//       products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
//     );
//   };

//   const deleteProduct = (id) => {
//     setProducts(products.filter(product => product.id !== id));
//   };

//   const AdminControls = ({ addProduct, editProduct, editingProduct, setEditingProduct }) => {
//     const [productData, setProductData] = useState({ name: '', price: '' });
  
//     useEffect(() => {
//       if (editingProduct) {
//         setProductData(editingProduct); 
//       } else {
//         setProductData({ name: '', price: '' }); 
//       }
//     }, [editingProduct]);
  
//     const handleSubmit = (e) => {
//       e.preventDefault();
//       if (editingProduct) {
//         editProduct(productData); 
//         setEditingProduct(null); 
//       } else {
//         addProduct(productData); 
//       }
//       setProductData({ name: '', price: '' }); 
//     };
  
//     const handleChange = (e) => {
//       setProductData({ ...productData, [e.target.name]: e.target.value });
//     };
  
//     return (
//       <div className="admin-controls">
//         <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Product Name"
//             value={productData.name}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="number"
//             name="price"
//             placeholder="Product Price"
//             value={productData.price}
//             onChange={handleChange}
//             required
//           />
//           <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
//           {editingProduct && (
//             <button type="button" onClick={() => setEditingProduct(null)}>
//               Cancel Edit
//             </button>
//           )}
//         </form>
//       </div>
//     );
//   };
//   /****************************************/

//   const ProductList = ({ products, deleteProduct, setEditingProduct }) => {
//     return (
//       <div className="product-list">
//         {products.map(product => (
//           <div key={product.id} className="product-box">
//             <h3>{product.name}</h3>
//             <p>${product.price.toFixed(2)}</p>
//             <button onClick={() => setEditingProduct(product)}>Edit</button> 
//             <button onClick={() => deleteProduct(product.id)}>Delete</button> 
//           </div>
//         ))}
//       </div>
//     );
//   };

//  /*  const Cart = ({ cart, removeFromCart }) => {
//     const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  
//     return (
//       <div>
//         <h2>Shopping Cart</h2>
//         <ul>
//           {cart.map((item, index) => (
//             <li key={index}>
//               {item.name} - ${item.price.toFixed(2)}
//               <button onClick={() => removeFromCart(item.id)}>Remove</button>
//             </li>
//           ))}
//         </ul>
//         <h3>Total: ${totalPrice.toFixed(2)}</h3>
//       </div>
//     );
//   };

//   const Checkout = ({ cart }) => {
//     const handleCheckout = () => {
//       if (cart.length === 0) {
//         alert("Your cart is empty!");
//       } else {
//         alert("Payment success!");
//       }
//     };
  
//     return (
//       <div>
//         <button onClick={handleCheckout}>Checkout</button>
//       </div>
//     );
//   }; */

// function EmployeeShop() {
//     const [products, setProducts] = useState(products);
//     const [editingProduct, setEditingProduct] = useState(null); 
  
//     const addProduct = (newProduct) => {
//       setProducts([...products, { ...newProduct, id: Date.now() }]);
//     };
  
//     const editProduct = (updatedProduct) => {
//       setProducts(
//         products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
//       );
//     };
  
//     const deleteProduct = (id) => {
//       setProducts(products.filter(product => product.id !== id));
//     };
  
//     return (
//       <div className="Shop">
//         <ProductList
//           products={products}
//           editProduct={editProduct}
//           deleteProduct={deleteProduct}
//           setEditingProduct={setEditingProduct}
//         />
//         <AdminControls
//           addProduct={addProduct}
//           editProduct={editProduct}
//           editingProduct={editingProduct}
//           setEditingProduct={setEditingProduct}
//         />
//       </div>
//     );
//   }

// export default EmployeeShop;