// InventoryReport.js
import React from 'react';

const InventoryReport = ({ data, handleSort, formData, handleChange, handleSubmit }) => {
    return (
        <div>
            {/*report filters start here*/}
            <h2>Inventory Report</h2>
            <form onSubmit={handleSubmit}>
                <> {/*product category filter*/}
                <div className="form-group">
                    <label htmlFor="productType">Product Category</label>
                    <select
                        id="productType"
                        name="productType"
                        value={formData.productType}
                        onChange={handleChange}
                    >
                        <option value="">Select a product</option>
                        <option value="stamps">Stamp</option>
                        <option value="envelopes">Envelope</option>
                        <option value="postcard">Post Card</option>
                        <option value="small package">Small Package</option>
                        <option value="medium package">Medium Package</option>
                        <option value="large package">Large Package</option>
                    </select>
                </div>
                {/*date filter*/}
                <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/*stock level filter*/}
                    {/*supplier name filter*/}
                </>
                <button type="submit">Submit</button>
            </form>

            {/*report output table starts here*/}
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('productName')}>Product Name</th>
                        <th onClick={() => handleSort('stock')}>Stock</th>
                        <th onClick={() => handleSort('restockDate')}>Last Restock Date</th>
                        <th onClick={() => handleSort('unitPrice')}>Unit Price</th>
                        <th onClick={() => handleSort('supplier')}>Supplier</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.productName}</td>
                            <td>{item.stock}</td>
                            <td>{item.restockDate}</td>
                            <td>{item.unitPrice}</td>
                            <td>{item.supplier}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryReport;
