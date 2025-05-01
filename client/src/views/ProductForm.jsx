import React, { useState } from "react";
import "../styles/ProductForm.css"; // ✅ Import the CSS

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
  const [successMessage, setSuccessMessage] = useState("");

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
    <div className="form-field">
      <label>{label}:</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        required
      />
    </div>
  );

  return (
    <div className="product-form-container">
      <h2 className="form-title">Enter Product Details</h2>

      {successMessage && <div className="success-toast">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        {formField("Name", "name", "text", "Enter Product Name")}
        {formField("Price", "price", "number", "Enter Price (in USD 💵)")}
        {formField("Brand", "brand", "text", "Enter Brand (e.g. Apple, Samsung)")}
        {formField("Storage", "storage", "text", "Enter Storage (e.g. 128GB)")}
        {formField("RAM", "ram", "text", "Enter RAM (e.g. 8GB)")}
        {formField("Color", "color", "text", "Enter Color (e.g. Black, White)")}
        {formField("Screen Size", "screenSize", "text", "Enter Screen Size (e.g. 6.5 inches)")}
        {formField("Reserve Price", "reservePrice", "number", "Enter Reserve Price (in USD 💵)")}

        <div className="form-field">
          <label>Closing Date:</label>
          <input
            type="datetime-local"
            name="closingDate"
            value={formData.closingDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {preview && (
          <div className="preview-container">
            <strong>Image Preview:</strong>
            <br />
            <img
              src={preview}
              alt="Preview"
              className="preview-image"
            />
          </div>
        )}

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
