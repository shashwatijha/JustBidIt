import React, { useEffect, useState } from "react";
import "../styles/ProductDetail.css"; // ✅ Import the centralized CSS

function ProductDetail() {
  const [product, setProduct] = useState(null);

  const query = new URLSearchParams(window.location.search);
  const productId = query.get("id");

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
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
