// InventoryReport.js
import React from 'react';

const PackageDeliveryReport = ({ data, handleSort, formData, handleChange, handleSubmit }) => {
    return (
        <div>
            {/*report filters start here*/}
            <h2>Package Delivery Report</h2>
            <form onSubmit={handleSubmit}>
            <>
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

                <div className="form-group">
                    <label htmlFor="packageStatus">Package Status</label>
                    <select
                        id="packageStatus"
                        name="packageStatus"
                        value={formData.packageStatus}
                        onChange={handleChange}
                    >
                        <option value="">Select Status</option>
                        <option value="delivered">Delivered</option>
                        <option value="in-transit">In Transit</option>
                        <option value="pending">Pending</option>
                        <option value="returned">Returned</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="deliveryMethod">Delivery Method</label>
                    <select
                        id="deliveryMethod"
                        name="deliveryMethod"
                        value={formData.deliveryMethod}
                        onChange={handleChange}
                    >
                        <option value="">Select Method</option>
                        <option value="standard">Standard</option>
                        <option value="express">Express</option>
                        <option value="overnight">Overnight</option>
                        <option value="pickup">Pickup</option>
                    </select>
                </div>
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

export default PackageDeliveryReport;
