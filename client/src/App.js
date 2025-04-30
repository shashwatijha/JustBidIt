import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './views/login';
import Signup from './views/signup';
import QASection from './views/QASection';
import ProductForm from "./views/ProductForm";
import ProductList from "./views/ProductList";
import ProductDetail from './views/ProductDetail';
import BidForm from "./views/BidForm";
import AdminLogin from './views/adminLogin';
import AdminDashboard from './views/adminDashboard';
import CreateCustomerRep from './views/createCustRep';
import SalesReport from './views/salesReport';
import ForgotRepPassword from './views/forgotRepPassword';
import CustomerRepDashboard from './views/custRepDashboard';
import ForgotPassword from './views/forgotPassword';
import ResetPassword from './views/resetPassword';

function App() {
  const [dbStatus, setDbStatus] = useState(null);

  return (
    <Router>
      <div>
        <Routes>
          {/* User routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/create" element={<ProductForm />} />
          <Route path="/bid" element={<BidForm />} />
          <Route path="/faq" element={<QASection />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          {/* Admin routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/create-customer-rep" element={<CreateCustomerRep />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/forgot-rep-password" element={<ForgotRepPassword />} />

          {/* Customer Rep routes */}
          <Route path="/customer-rep-login" element={<Login />} />
          <Route path="/customer-rep-dashboard" element={<CustomerRepDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
