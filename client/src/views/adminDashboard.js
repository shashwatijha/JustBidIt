import { useState } from 'react';
import CreateCustomerRep from './createCustRep';
import SalesReport from './salesReport';
import ResetRequests from './resetRequests';
import '../styles/adminDashboard.css';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('create');

  const handleLogout = () => {
    window.location.href = '/admin-login';
  };

  const renderPanel = () => {
    switch (activeSection) {
      case 'sales':
        return <SalesReport />;
      case 'reset':
        return <ResetRequests />;
      case 'create':
      default:
        return <CreateCustomerRep />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <div className="admin-header-title">
          <span className="ikea-logo">IKEA</span>
          <span className="dashboard-title">Admin Dashboard</span>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <ul>
            <li onClick={() => setActiveSection('create')}>Create Customer Rep</li>
            <li onClick={() => setActiveSection('sales')}>Sales Report</li>
            <li onClick={() => setActiveSection('reset')}>Reset Requests</li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </aside>

        <main className="admin-main">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
