import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/BidForm.css"; 

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
      userId: parseInt(localStorage.getItem("userId")),
      bidAmount,
      autoBid,
      maxLimit: autoBid ? maxLimit : null,
      increment: autoBid ? increment : null
    };

    fetch("http://localhost:8000/api/bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert("Bid submitted successfully!");
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch(err => {
        console.error("Network error:", err);
        alert("Network error. Check console.");
      });
  };

  const formGroup = (label, value, setter, type = "number", required = true) => (
    <div className="form-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setter(e.target.value)}
        required={required}
      />
    </div>
  );

  return (
    <div className="bid-form-container">
      <h2 className="form-title">Place Your Bid</h2>

      <form onSubmit={handleSubmit}>
        {formGroup("Enter your bid amount (USD $):", bidAmount, setBidAmount)}

        <div className="checkbox-field">
          <input
            type="checkbox"
            checked={autoBid}
            onChange={() => setAutoBid(!autoBid)}
            id="autoBidCheck"
          />
          <label htmlFor="autoBidCheck">Enable Auto Bid</label>
        </div>

        {autoBid && (
          <>
            {formGroup("Set maximum bid limit (USD $):", maxLimit, setMaxLimit)}
            {formGroup("Set bid increment (USD $):", increment, setIncrement)}
          </>
        )}

        <button type="submit" className="submit-button">
          Submit Bid
        </button>
      </form>
    </div>
  );
}

export default BidForm;
