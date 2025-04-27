import React, { useEffect, useState } from "react";




// 💵 Conversion helper
const convertToUSD = (inr) => {
  const conversionRate = 0.012; // You can change this to current rate
  return (inr * conversionRate).toFixed(2);
};


function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedId(id); // single selection, for multiple use an array
  };

  const handleView = () => {
    if (selectedId) {
      window.location.href = `/product?id=${selectedId}`;
    } else {
      alert("Please select a product to view.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Select a Product to View</h2>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <input
            type="checkbox"
            checked={selectedId === product.id}
            onChange={() => handleCheckboxChange(product.id)}
          />
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <div>
            <h4>{product.name}</h4>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Price:</strong> ${convertToUSD(product.price)}</p>

          </div>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleView}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          View Selected Product
        </button>
      </div>
    </div>
  );
}

export default ProductList;