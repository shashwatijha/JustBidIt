import React, { useEffect, useState } from "react";

import "../styles/ProductDetail.css"; 

function ProductDetail() {
  const [product, setProduct] = useState(null);

  const query = new URLSearchParams(window.location.search);
  const productId = query.get("id");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

const fetchHistory = async () => {
  const res = await fetch(`http://localhost:8000/api/bid-history/${productId}`);
  const data = await res.json();
  setHistory(data);
  setShowHistory(true);
};



  useEffect(() => {
    if (productId) {
      fetch(`http://localhost:8000/api/product?id=${productId}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error("Failed to load product:", err));
    }
  }, [productId]);

  if (!product) {
    return <div className="loading-text">Loading...</div>;
  }

  return (
    <>
      {/* Back to Browse Link */}
      <div className="back-to-browse">
        <a href="/products">← Back to Browse</a>
      </div>

      {/* Product Detail Card */}
      <div className="product-detail-container">
        <h2 className="product-title">{product.name}</h2>

        <img
          src={product.image_url}
          alt={product.name}
          className="product-image"
        />

        <div className="product-info">
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Storage:</strong> {product.storage}</p>
          <p><strong>RAM:</strong> {product.ram}</p>
          <p><strong>Color:</strong> {product.color}</p>
          <p><strong>Screen Size:</strong> {product.screen_size}</p>
          <p><strong>Price:</strong> ${product.price}</p> {/* 💵 Dollars */}
          <p><strong>Closing Date:</strong> {product.closing_date}</p>
        </div>

        {/* Place a Bid Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => window.location.href = `/bid?id=${product.id}`}
            className="place-bid-button"
          >
            Place a Bid
          </button>
          <button onClick={fetchHistory} className="place-bid-button">
            View Bid History
          </button>
        </div>

        {showHistory && (
        <div className="history-popup" >
          <h3 className="history-popup h3">Bid History</h3>
          <ul className="history-popup ul">
            {history.map((entry, idx) => (
              <li key={idx} className="history-popup li">
                <strong>${entry.bid_amount}</strong> by User {entry.user_id} ({entry.auto_bid ? "Auto" : "Manual"}) <br />
                <small>{entry.created_at}</small>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowHistory(false)} className="history-popup button">Close</button>
        </div>
      )}

      </div>
    </>
  );
}

export default ProductDetail;
