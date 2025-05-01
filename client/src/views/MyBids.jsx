import React, { useEffect, useState } from "react";
import "../styles/products.css"; 

function MyBids() {
  const [bids, setBids] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8000/api/bids/user/${userId}`)
      .then(res => res.json())
      .then(data => setBids(data))
      .catch(err => console.error("Failed to fetch bids", err));
  }, []);

  const getTimeRemaining = (closingDate) => {
    const difference = new Date(closingDate) - new Date();
    return difference > 0;
  };

  return (
    <div className="product-container">
      <h1 className="product-title">My Bids</h1>
      {bids.length > 0 ? (
        <div className="product-grid">
          {bids.map((bid, idx) => {
            const isActive = getTimeRemaining(bid.closing_date);
            return (
              <div
                key={idx}
                className={`product-card ${!isActive ? 'disabled' : ''}`}
              >
                <img
                  src={bid.image_url}
                  alt={bid.product_name}
                  className="product-image"
                />
                <h2 className="product-name">{bid.product_name}</h2>
                <p className="product-brand">Brand: {bid.brand}</p>
                <p className="product-price">Your Bid: ${bid.bid_amount}</p>
                <p className="product-timer">Placed on: {bid.created_at}</p>
                <p className="product-type">
                  Type: {bid.auto_bid ? `Auto (Max: $${bid.max_limit}, Inc: $${bid.increment})` : "Manual"}
                </p>
                {!isActive && <p className="product-ended">Auction Closed</p>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-products-wrapper">
          <p className="no-products-message">You haven't placed any bids yet.</p>
        </div>
      )}
    </div>
  );
}

export default MyBids;
