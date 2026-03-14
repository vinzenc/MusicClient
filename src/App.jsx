import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// 1. Tách cái bảng thành một Component riêng biệt
function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://musicapi-376j.onrender.com/users');
        const result = await response.json();
        if (result.success) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Danh sách Người dùng</h1>
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 2. Tạo một Component cho Trang chủ
function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Chào mừng đến với App</h1>
      <p>Đây là trang chủ.</p>
      {/* Nút để chuyển sang trang Users */}
      <Link to="/users">
        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Xem danh sách User</button>
      </Link>
    </div>
  );
}

// 3. App component bây giờ dùng để cấu hình Route
function App() {
  return (
    <div className="container">
      <Routes>
        {/* Nếu URL là '/' thì hiện Home */}
        <Route path="/" element={<Home />} />
        
        {/* Nếu URL là '/users' thì hiện cái bảng UserList */}
        <Route path="/users" element={<UserList />} />
      </Routes>
    </div>
  );
}

export default App;