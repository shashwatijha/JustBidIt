import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './views/auth';
import Login from './views/login';
import Signup from './views/signup';
import ProductForm from "./views/ProductForm";
import ProductList from "./views/ProductList";
import ProductDetail from './views/ProductDetail';
import BidForm from "./views/BidForm";

function App() {
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    fetch("/test-db")
      .then(res => res.json())
      .then(data => setDbStatus(data.message))
      .catch(() => setDbStatus("Connection failed"));
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          {/* <Auth /> */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/create" element={<ProductForm />} />
          <Route path="/bid" element={<BidForm />} />
          {/* <Route path="/" element={<Auth />} /> */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
