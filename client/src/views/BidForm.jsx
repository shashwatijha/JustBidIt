import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const convertToUSD = (inr) => {
    const rate = 0.012; // Example: ₹1 = $0.012
    return (inr * rate).toFixed(2);
  };
  
function BidForm() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");

  const [bidAmount, setBidAmount] = useState("");
  const [autoBid, setAutoBid] = useState(false);
  const [maxLimit, setMaxLimit] = useState("");
  const [increment, setIncrement] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      productId,
      bidAmount,
      autoBid,
      maxLimit: autoBid ? maxLimit : null,
      increment: autoBid ? increment : null
    };

    fetch("http://localhost:8000/api/bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            alert(" Bid submitted successfully!");
          } else {
            alert(" Error: " + data.error);
          }
        })
        .catch(err => {
          console.error("Network error:", err);
          alert(" Network error. Check console.");
        });
      
    // alert("Bid submitted! (Check console for now)");
  };

  // ✨ Helper component for clean label-input pairs
  const formGroup = (label, value, setter, type = "number", required = true) => (
    <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column" }}>
      <label style={{ fontWeight: "bold", marginBottom: "6px" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setter(e.target.value)}
        required={required}
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "14px"
        }}
      />
    </div>
  );

  return (
    <div style={{
      maxWidth: "500px",
      margin: "auto",
      padding: "30px",
      border: "1px solid #eee",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Place Your Bid</h2>

      <form onSubmit={handleSubmit}>
        {formGroup("Enter your bid amount :", bidAmount, setBidAmount)}
        {bidAmount && (
        <p style={{ marginTop: "-10px", marginBottom: "16px", color: "#555", fontStyle: "italic" }}>
        ≈ ${convertToUSD(bidAmount)} USD
        </p>
        )}


        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <input
            type="checkbox"
            checked={autoBid}
            onChange={() => setAutoBid(!autoBid)}
            id="autoBidCheck"
            style={{ marginRight: "10px" }}
          />
          <label htmlFor="autoBidCheck" style={{ fontWeight: "bold" }}>Enable Auto Bid</label>
        </div>

        {autoBid && (
          <>
            {formGroup("Set maximum bid limit :", maxLimit, setMaxLimit)}
            {formGroup("Set bid increment :", increment, setIncrement)}
          </>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Submit Bid
        </button>
      </form>
    </div>
  );
}

export default BidForm;