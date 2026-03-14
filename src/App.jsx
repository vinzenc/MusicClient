import { useState, useEffect } from 'react';
import './App.css';

// Giả định backend của bạn đang chạy ở domain này. 
// Nếu đã cài proxy trong vite.config.js, bạn có thể đổi thành chuỗi rỗng ''
const API_BASE_URL = 'http://localhost:3000'; 

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState('');

  // 1. GET: Lấy danh sách users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. SEARCH: Tìm user theo ID
  const handleSearch = async () => {
    if (!searchId) {
      fetchUsers();
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${searchId}`);
      if (response.ok) {
        const data = await response.json();
        setUsers([data]); // Hiển thị 1 kết quả
      } else {
        alert('Không tìm thấy user!');
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
    }
  };

  // 3. ADD & EDIT: Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Edit : /api/users/id
        await fetch(`${API_BASE_URL}/api/users/${editingId}`, {
          method: 'PUT', // Hoặc PATCH tuỳ backend của bạn
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        setEditingId(null);
      } else {
        // Add : /api/users/add
        await fetch(`${API_BASE_URL}/api/users/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setFormData({ name: '', email: '' });
      fetchUsers(); // Cập nhật lại list
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  // 4. DELETE: Xoá user theo ID
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
      });
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi xoá:', error);
    }
  };

  return (
    <div className="container">
      <h1>Quản lý Người dùng</h1>

      {/* Box Tìm kiếm */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Nhập ID cần tìm..." 
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      {/* Form Thêm/Sửa */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tên người dùng"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', email: '' }); }}>Hủy</button>
        )}
      </form>

      {/* Bảng dữ liệu */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => { setEditingId(user.id); setFormData({ name: user.name, email: user.email }); }}>Sửa</button>
                <button onClick={() => handleDelete(user.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;