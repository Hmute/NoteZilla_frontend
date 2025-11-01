import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  apiCalls: number;
  createdAt: string;
}

interface AdminData {
  users: User[];
  totalUsers: number;
  totalApiCalls: number;
}

const AdminDashboard: React.FC = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    fetchAdminData();
  }, [user, token]);

  const fetchAdminData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin data');
      }

      const data = await response.json();
      setAdminData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          No data available
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 text-white">Admin Dashboard</h2>
          
          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card primary-bck text-white shadow-sm rounded-5">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <h3 className="card-text">{adminData.totalUsers}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card primary-bck text-white shadow-sm rounded-5">
                <div className="card-body">
                  <h5 className="card-title">Total API Calls</h5>
                  <h3 className="card-text">{adminData.totalApiCalls}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card primary-bck text-white shadow-sm rounded-5">
            <div className="card-header">
              <h5 className="mb-0 text-white">All Users</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-dark table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>API Calls</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminData.users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.apiCalls >= 20 ? 'bg-warning' : 'bg-info'}`}>
                            {user.apiCalls}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {adminData.users.length === 0 && (
                <div className="text-center text-white py-4">
                  No users found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;