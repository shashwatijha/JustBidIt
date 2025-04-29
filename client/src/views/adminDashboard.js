import { useState } from 'react';
import CreateCustomerRep from './createCustRep';
import SalesReport from './salesReport';
import ResetRequests from './resetRequests';
import '../styles/adminDashboard.css';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('create');

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
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveSection('create')}>Create Customer Rep</li>
          <li onClick={() => setActiveSection('sales')}>Sales Report</li>
          <li onClick={() => setActiveSection('reset')}>Reset Requests</li>
          <li onClick={() => window.location.href = '/admin-login'}>Logout</li>
        </ul>
      </aside>

      <main className="admin-main">
        {renderPanel()}
      </main>
    </div>
  );
}
