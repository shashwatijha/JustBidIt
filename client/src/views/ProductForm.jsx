import React, { useState } from "react";

function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    brand: "",
    storage: "",
    ram: "",
    color: "",
    screenSize: "",
    reservePrice: "",
    closingDate: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // 🔵 for toast

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("productImage", image);

    try {
      const response = await fetch("http://localhost:8000/api/auctions", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ Product submitted successfully!");
        console.log("✅ Success:", result);
        // Reset form after successful submission
        setFormData({
          name: "",
          price: "",
          brand: "",
          storage: "",
          ram: "",
          color: "",
          screenSize: "",
          reservePrice: "",
          closingDate: "",
        });
        setImage(null);
        setPreview(null);

        // Clear message after few seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert("❌ Server error: " + result.error);
        console.error("Server error:", result);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred while submitting.");
    }
  };

  const formField = (label, name, type = "text", placeholder = "") => (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: "12px" }}>
      <label style={{ fontWeight: "bold", marginBottom: "5px" }}>{label}:</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]} // bind value
        onChange={handleChange}
        required
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Enter Product Details</h2>

      {/* 🔵 Success Toast */}
      {successMessage && (
        <div style={{
          backgroundColor: "#d4edda",
          padding: "12px",
          borderRadius: "6px",
          color: "#155724",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {formField("Name", "name", "text", "Enter Product Name")}
        {formField("Price", "price", "number", "Enter Price (in USD 💵)")}
        {formField("Brand", "brand", "text", "Enter Brand (e.g. Apple, Samsung)")}
        {formField("Storage", "storage", "text", "Enter Storage (e.g. 128GB)")}
        {formField("Ram", "ram", "text", "Enter RAM (e.g. 8GB)")}
        {formField("Color", "color", "text", "Enter Color (e.g. Black, White)")}
        {formField("Screen Size", "screenSize", "text", "Enter Screen Size (e.g. 6.5 inches)")}
        {formField("Reserve Price", "reservePrice", "number", "Enter Reserve Price (in USD 💵)")}

        <div style={{ display: "flex", flexDirection: "column", marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Closing Date:</label>
          <input
            type="datetime-local"
            name="closingDate"
            value={formData.closingDate}
            onChange={handleChange}
            required
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ padding: "4px" }}
          />
        </div>

        {preview && (
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <strong>Image Preview:</strong>
            <br />
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover", marginTop: "10px" }}
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
