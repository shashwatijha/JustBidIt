import { useState, useEffect } from 'react';
import { Eye, Trash2, Flag } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/custRepDashboard.css';

export default function ManageAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [auctionToDelete, setAuctionToDelete] = useState(null);
  const [infoPopupId, setInfoPopupId] = useState(null);

  useEffect(() => {
    fetch('/api/customer-rep/get-auctions')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setAuctions(data.auctions);
        }
      });
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleString();
  };

  const isClosed = (dateStr) => {
    const now = new Date();
    const closing = new Date(dateStr);
    return isNaN(closing) ? false : closing < now;
  };

  const hasMissingFields = (auction) => {
    return !auction.brand || !auction.storage || !auction.screen_size || !auction.ram;
  };

  const isSuspicious = (auction) => {
    const invalidPrice = !auction.price || auction.price <= 0;
    const suspiciousName = /test|asd|xxx/i.test(auction.name);
    return invalidPrice || suspiciousName;
  };

  const getFlagReason = (auction) => {
    if (isSuspicious(auction)) {
      return 'This auction has a suspicious name or invalid price.';
    } else if (hasMissingFields(auction)) {
      return 'This auction is missing required phone fields like brand, RAM, storage, or screen size.';
    }
    return '';
  };

  const sortedAuctions = [...auctions].sort((a, b) => {
    const priority = (a) => isSuspicious(a) ? 2 : hasMissingFields(a) ? 1 : 0;
    return priority(b) - priority(a);
  });

  const handleDelete = async () => {
    fetch(`/api/customer-rep/delete-auction/${auctionToDelete.id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setAuctions(auctions.filter(a => a.id !== auctionToDelete.id));
          setShowDeleteModal(false);
        } else {
          alert('Failed to delete auction');
        }
      });
  };

  return (
    <div className="manage-users-wrapper">
      <h2>Manage Auctions</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Brand</th>
            <th>Seller</th>
            <th>Ends On</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedAuctions.map((auction) => (
            <tr
              key={auction.id}
              className={
                isSuspicious(auction)
                  ? 'flagged-row red-flag'
                  : hasMissingFields(auction)
                    ? 'flagged-row yellow-flag'
                    : ''
              }
            >
              <td style={{ position: 'relative' }}>
                {auction.name}
                {/* {isSuspicious(auction) && <Flag size={16} color="red" style={{ marginLeft: '6px' }} />}
                {!isSuspicious(auction) && hasMissingFields(auction) && (
                  <Flag size={16} color="goldenrod" style={{ marginLeft: '6px' }} />
                )} */}
                {(isSuspicious(auction) || hasMissingFields(auction)) && (
                  <span className="flag-wrapper">
                    <Flag
                      size={16}
                      color={isSuspicious(auction) ? 'red' : 'goldenrod'}
                      style={{ marginLeft: '6px' }}
                    />
                    <div className="info-popup-hover">
                      {getFlagReason(auction)}
                    </div>
                  </span>
                )}
              </td>
              <td>{auction.brand}</td>
              <td>{auction.seller}</td>
              <td>{formatDate(auction.closing_date)}</td>
              <td>{isClosed(auction.closing_date) ? 'Closed' : 'Open'}</td>
              <td className="action-icons">
                <button
                  title="View"
                  onClick={() => {
                    setSelectedAuction(auction);
                    setShowViewModal(true);
                  }}
                >
                  <Eye size={18} />
                </button>
                <button
                  title="Delete"
                  onClick={() => {
                    setAuctionToDelete(auction);
                    setShowDeleteModal(true);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      {showViewModal && selectedAuction && (
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Auction Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Product:</strong> {selectedAuction.name}</p>
            <p><strong>Brand:</strong> {selectedAuction.brand}</p>
            <p><strong>Seller:</strong> {selectedAuction.seller}</p>
            <p><strong>Price:</strong> ${selectedAuction.price}</p>
            <p><strong>Closing Date:</strong> {formatDate(selectedAuction.closing_date)}</p>
            <p><strong>Status:</strong> {isClosed(selectedAuction.closing_date) ? 'Closed' : 'Open'}</p>
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete auction <strong>{auctionToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
