import { useState, useEffect } from 'react';
import '../styles/custRepDashboard.css';
import { Trash2 } from 'lucide-react';

export default function ManageBids() {
  const [bids, setBids] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');


  useEffect(() => {
    fetch('/api/customer-rep/get-bids')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setBids(data.bids);
        } else {
          alert('Error fetching bids.');
        }
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBids = bids.filter((bid) => {
    const matchesProduct = bid.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const bidAmount = Number(bid.bid_amount);
    const minOk = minAmount === '' || bidAmount >= Number(minAmount);
    const maxOk = maxAmount === '' || bidAmount <= Number(maxAmount);
    return matchesProduct && minOk && maxOk;
  });

  const handleDeleteBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to delete this bid?')) return;
    try {
      const res = await fetch(`/api/customer-rep/delete-bid/${bidId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 'success') {
        setBids(prev => prev.filter(bid => bid.id !== bidId));
      } else {
        alert('Failed to delete bid.');
      }
    } catch (err) {
      console.error('Delete bid error:', err);
      alert('Server error.');
    }
  };

  return (
    <div className="manage-bids-wrapper">
      <h2>Manage Bids</h2>

      <input
        type="text"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="amount-filters">
        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="search-input"
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          className="search-input"
        />
      </div>


      <table className="users-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Username</th>
            <th>Bid Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBids.map((bid) => (
            <tr key={bid.id}>
              <td>{bid.product_name}</td>
              <td>{bid.username}</td>
              <td>${Number(bid.bid_amount).toFixed(2)}</td>
              <td className="action-icons">
                <button title="Delete" onClick={() => handleDeleteBid(bid.id)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
