import React from 'react';
import '../styles/ConfirmModal.css';

export default function ConfirmModal({ isOpen, onCancel, onConfirm, details }) {
  if (!isOpen) return null;
  const { ticker, company, qty, pricePerShare, totalCost, type } = details;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Confirm {type === 'buy' ? 'Purchase' : 'Sale'}</h3>
        <p>
          <strong>Stock:</strong> {ticker} ({company})
        </p>
        <p>
          <strong>Quantity:</strong> {qty}
        </p>
        <p>
          <strong>Price per Share:</strong> ${pricePerShare.toFixed(2)}
        </p>
        <p>
          <strong>Total {type === 'buy' ? 'Cost' : 'Proceeds'}:</strong> ${totalCost.toFixed(2)}
        </p>
        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}