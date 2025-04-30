import { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';

import '../styles/custRepDashboard.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [fadeUserId, setFadeUserId] = useState(null);
  const [updatedUserId, setUpdatedUserId] = useState(null);



  useEffect(() => {
    // Fetch all users when the component loads
    const fetchUsers = async () => {
      const response = await fetch('api/customer-rep/get-users');
      const data = await response.json();
      if (data.status === 'success') {
        setUsers(data.users);
      } else {
        alert('Error fetching users.');
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveUser = async () => {
    try {
      const response = await fetch(`/api/customer-rep/update-user/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser)
      });
      const data = await response.json();

      if (data.status === 'success') {
        setUsers(prev => prev.map(u => (u.id === editUser.id ? editUser : u)));
        setUpdatedUserId(editUser.id);  // highlight row
        setShowEditModal(false);

        // Remove highlight after a short time
        setTimeout(() => setUpdatedUserId(null), 2000);
      }
      else {
        alert('Failed to update user');
      }
    } catch (err) {
      console.error('Edit user error:', err);
      alert('Server error');
    }
  };
  const handleConfirmDelete = async () => {
    setFadeUserId(userToDelete.id); // trigger animation
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/customer-rep/delete-user/${userToDelete.id}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (data.status === 'success') {
          setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
          setShowDeleteModal(false);
        } else {
          alert('Failed to delete user.');
          setFadeUserId(null);
        }
      } catch (err) {
        console.error('Delete user error:', err);
        alert('Server error.');
        setFadeUserId(null);
      }
    }, 300); // wait for fade to finish
  };



  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-users-wrapper">
      <h2>Manage User Accounts</h2>

      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Account Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className={
                (fadeUserId === user.id ? 'fade-out' : '') +
                (updatedUserId === user.id ? ' highlight-updated' : '')
              }
            >

              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.account_type}</td>
              <td className="action-icons">
                <button title="View" onClick={() => { setSelectedUser(user); setShowModal(true); }}>
                  <Eye size={18} />
                </button>
                <button title="Edit" onClick={() => { setEditUser(user); setShowEditModal(true); }}>
                  <Pencil size={18} />
                </button>
                <button title="Delete" onClick={() => {
                  setUserToDelete(user);
                  setShowDeleteModal(true);
                }}>
                  <Trash2 size={18} />
                </button>

              </td>

            </tr>
          ))}
        </tbody>
      </table>
      {/* View User Details Popup */}
      {showModal && selectedUser && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Full Name:</strong> {selectedUser.full_name || 'null'}</p>
            <p><strong>Business Name:</strong> {selectedUser.business_name || 'null'}</p>
            <p><strong>Account Type:</strong> {selectedUser.account_type}</p>
            <p><strong>Country:</strong> {selectedUser.country || 'null'}</p>
            <p><strong>Created At:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
          </Modal.Body>
        </Modal>
      )}
      {/* Edit User Popup */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" value={editUser?.username || ''}
                onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={editUser?.email || ''}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={editUser?.full_name || ''}
                onChange={e => setEditUser({ ...editUser, full_name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Business Name</label>
              <input type="text" className="form-control" value={editUser?.business_name || ''}
                onChange={e => setEditUser({ ...editUser, business_name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Account Type</label>
              <select className="form-select" value={editUser?.account_type || ''}
                onChange={e => setEditUser({ ...editUser, account_type: e.target.value })}>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Country</label>
              <input type="text" className="form-control" value={editUser?.country || ''}
                onChange={e => setEditUser({ ...editUser, country: e.target.value })} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveUser}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      {/* Delete Popup */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{userToDelete?.username}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>



    </div>



  );
}
