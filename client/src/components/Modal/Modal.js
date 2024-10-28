import React from 'react';
import './Modal.css'; // Create a separate CSS file for modal styles

const Modal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Are you sure you want to delete this package?</h3>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onClose}>No</button>
            </div>
        </div>
    );
};

export default Modal;
