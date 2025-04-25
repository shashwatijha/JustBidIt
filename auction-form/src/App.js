import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProductForm from "./pages/ProductForm";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import BidForm from "./pages/BidForm"; // create this page

<Route path="/bid" element={<BidForm />} />


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/create" element={<ProductForm />} />
        <Route path="/bid" element={<BidForm />} />
      </Routes>
    </Router>
  );
}

export default App;

