import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'https://musicapi-376j.onrender.com';

function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Gọi thẳng lên API thật
        const response = await fetch('https://musicapi-376j.onrender.com/users');
        const result = await response.json();
        
        // Bắt chính xác mảng nằm trong key "data"
        if (result.success) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setIsLoading(false); // Dù lỗi hay thành công cũng tắt trạng thái loading
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1>Danh sách Người dùng </h1>
      
      {isLoading ? (
        // Hiển thị dòng này trong lúc chờ server Render thức dậy
        <p style={{ color: 'yellow' }}>Đang tải dữ liệu (có thể mất chút thời gian nếu server đang ngủ)...</p>
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

export default App;