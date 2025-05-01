import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/products.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]);
  const [storageFilter, setStorageFilter] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fullName = localStorage.getItem("fullName") || "Unknown"; 
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:8000/api/notifications?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
          setNotifications(data);
          setNotificationCount(data.length);
        });
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const initialTimes = {};
        data.forEach((product) => {
          initialTimes[product.id] = calculateTimeLeft(product.closing_date);
        });
        setTimeLeft(initialTimes);
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  // Countdown helper
const calculateTimeLeft = (closingDate) => {
  const difference = +new Date(closingDate) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      const updated = {};
      products.forEach(product => {
        updated[product.id] = calculateTimeLeft(product.closing_date);
      });
      return updated;
    });
  }, 1000);

  return () => clearInterval(timer); // clean up on unmount
}, [products]);

  const handleView = (id) => {
    navigate(`/product?id=${id}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleClearFilters = () => {
    setBrandFilter([]);
    setColorFilter([]);
    setStorageFilter([]);
    setSearchTerm("");
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    if (category === 'brand') {
      if (checked) {
        setBrandFilter([...brandFilter, value]);
      } else {
        setBrandFilter(brandFilter.filter((item) => item !== value));
      }
    } else if (category === 'color') {
      if (checked) {
        setColorFilter([...colorFilter, value]);
      } else {
        setColorFilter(colorFilter.filter((item) => item !== value));
      }
    } else if (category === 'storage') {
      if (checked) {
        setStorageFilter([...storageFilter, value]);
      } else {
        setStorageFilter(storageFilter.filter((item) => item !== value));
      }
    }
  };

  const handleClearNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/notifications/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: localStorage.getItem("userId") })
      });
  
      const data = await response.json();
      if (response.ok) {
        setNotifications([]);  // clear from UI
        setNotificationCount(0);
      } else {
        console.error("Clear failed:", data.error);
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };
  
  const getFilteredAndSortedProducts = () => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm)
        || product.brand.toLowerCase().includes(searchTerm)
        || product.color.toLowerCase().includes(searchTerm)
        || product.storage.toLowerCase().includes(searchTerm);
  
      const matchesBrand = brandFilter.length === 0 || brandFilter.includes(product.brand);
      const matchesColor = colorFilter.length === 0 || colorFilter.includes(product.color);
      const matchesStorage = storageFilter.length === 0 || storageFilter.includes(product.storage);
  
      return matchesSearch && matchesBrand && matchesColor && matchesStorage;
    });
  
    // Sort logic
    filtered.sort((a, b) => {
      const now = new Date();
      const aEnded = new Date(a.closing_date) < now;
      const bEnded = new Date(b.closing_date) < now;
  
      // Always push ended auctions to the bottom
      if (aEnded && !bEnded) return 1;
      if (!aEnded && bEnded) return -1;
  
      // Secondary sorting based on sort option
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "brand-asc") return a.brand.localeCompare(b.brand);
      if (sortOption === "brand-desc") return b.brand.localeCompare(a.brand);
      if (sortOption === "time-left") {
        return new Date(a.closing_date) - new Date(b.closing_date);
      }
  
      return 0;
    });
  
    return filtered;
  };
  

  return (
    <div className="layout-container">
      <nav className="sidebar">
        {/* User Profile Section */}
        <div className="user-profile">
          <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
          <span className="user-name">{fullName}</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <a href="/products" className={location.pathname === "/products" ? "active-link" : ""}>
              Home
            </a>
          </li>
          <li>
            <a href="/create" className={location.pathname === "/create" ? "active-link" : ""}>
              Sell a Product
            </a>
          </li>
          <li>
          <a href="/my-bids" className={location.pathname === "/my-bids" ? "active-link" : ""}>My Bids</a>
          </li>
          <li className="sidebar-alert" onClick={() => setShowNotifications(true)}>
            <span>🔔 Alert</span>
            {notificationCount > 0 && <span className="notification-count">{notificationCount}</span>}
          </li>
        </ul>

        <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
        </div>
      </nav>

      {/* Main content same, title updated */}
      <div className="main-content">
        <div className="product-container">
          <h1 className="product-title">JustBIDit</h1>

          {/* Search + Filter + Sort Section */}
          <div className="search-sort-bar">
            <input
              type="text"
              placeholder="Search by name, brand, color, storage..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />

            <div>
              <button onClick={() => setFiltersOpen(!filtersOpen)} className="filters-button">
                Filters {filtersOpen ? "▲" : "▼"}
              </button>

              {filtersOpen && (
                <div className="filters-dropdown">
                  <div className="filter-category">
                    <h4>Brand</h4>
                    {Array.from(new Set(products.map((p) => p.brand))).map((brand, idx) => (
                      <div key={idx} className="filter-option">
                        <input
                          type="checkbox"
                          id={`brand-${idx}`}
                          value={brand}
                          checked={brandFilter.includes(brand)}
                          onChange={(e) => handleCheckboxChange(e, 'brand')}
                        />
                        <label htmlFor={`brand-${idx}`}>{brand}</label>
                      </div>
                    ))}
                  </div>

                  <div className="filter-category">
                    <h4>Color</h4>
                    {Array.from(new Set(products.map((p) => p.color))).map((color, idx) => (
                      <div key={idx} className="filter-option">
                        <input
                          type="checkbox"
                          id={`color-${idx}`}
                          value={color}
                          checked={colorFilter.includes(color)}
                          onChange={(e) => handleCheckboxChange(e, 'color')}
                        />
                        <label htmlFor={`color-${idx}`}>{color}</label>
                      </div>
                    ))}
                  </div>

                  <div className="filter-category">
                    <h4>Storage</h4>
                    {Array.from(new Set(products.map((p) => p.storage))).map((storage, idx) => (
                      <div key={idx} className="filter-option">
                        <input
                          type="checkbox"
                          id={`storage-${idx}`}
                          value={storage}
                          checked={storageFilter.includes(storage)}
                          onChange={(e) => handleCheckboxChange(e, 'storage')}
                        />
                        <label htmlFor={`storage-${idx}`}>{storage}</label>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleClearFilters} className="clear-filters-button">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            <div className="sort-bar">
              <label htmlFor="sort" className="sort-label">Sort by:</label>
              <select id="sort" value={sortOption} onChange={handleSortChange} className="sort-select">
                <option value="">-- Select --</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="brand-asc">Brand: A to Z</option>
                <option value="brand-desc">Brand: Z to A</option>
                <option value="time-left">Time: Least to Most</option>
                <option value="time-left-desc">Time: Most to Least</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {getFilteredAndSortedProducts().length > 0 ? (
          <div className="product-grid">
            {getFilteredAndSortedProducts().map((product) => {
              const isEnded = new Date(product.closing_date) < new Date();
              //print(isEnded, product.closing_date);
              console.log(product.closing_date, new Date(product.closing_date), new Date(), isEnded);

              return (
                <div
                  key={product.id}
                  className={`product-card ${isEnded ? 'disabled' : ''}`}
                  onClick={() => !isEnded && handleView(product.id)}
                  style={{ cursor: isEnded ? "default" : "pointer" }}
                >
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  <h2 className="product-name">{product.name}</h2>
                  <p className="product-brand">{product.brand}</p>
                  <p className="product-price">${product.price}</p>

                  {timeLeft[product.id] ? (
                    <p className="product-timer">
                      Ends in: {timeLeft[product.id].days}d {timeLeft[product.id].hours}h{" "}
                      {timeLeft[product.id].minutes}m {timeLeft[product.id].seconds}s
                    </p>
                  ) : (
                    <p className="product-ended">Auction Ended</p>
                  )}

                  {isEnded && <p className="product-ended">Auction Closed</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-products-wrapper">
            <p className="no-products-message">No products found matching your search.</p>
          </div>
        )}

        </div>
      </div>
      {showNotifications && (
        <div className="notification-popup">
          <div className="notification-popup-content">
            <h3>Notifications</h3>
            <button className="close-btn" onClick={() => setShowNotifications(false)}>×</button>
            <ul>
              {notifications.map(n => (
                <li key={n.id}>
                  <p>{n.message}</p>
                  <small>{n.created_at}</small>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleClearNotifications} className="clear-button">
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;