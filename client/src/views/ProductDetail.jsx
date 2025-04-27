import React, { useEffect, useState } from "react";

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

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>{product.name}</h2>
      <img
        src={product.image_url}
        alt={product.name}
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
      />
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Storage:</strong> {product.storage}</p>
      <p><strong>RAM:</strong> {product.ram}</p>
      <p><strong>Color:</strong> {product.color}</p>
      <p><strong>Screen Size:</strong> {product.screen_size}</p>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Reserve Price:</strong> ₹{product.reserve_price}</p>
      <p><strong>Closing Date:</strong> {product.closing_date}</p>
  
      {/* ✅ Add the button below */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => window.location.href = `/bid?id=${product.id}`}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "16px",
            fontStyle: "italic",
            cursor: "pointer"
            // transition: "all 0.3s ease-in-out"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0056b3"; // darker blue on hover
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#007bff"; // reset to original blue
          }}
        >
          Place a Bid
        </button>
      </div>
    </div>
  );
}


export default ProductDetail;