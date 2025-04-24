'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import UserManagement from './components/UserManagement';
import ServiceManagement from '../components/ServiceManagement';


export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      {/* <header className="bg-gray-900 text-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FixU Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}</span>
            <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
              Back to Website
            </Link>
          </div>
        </div>
      </header> */}

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow">
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeTab === 'dashboard' 
                        ? 'bg-orange-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeTab === 'users' 
                        ? 'bg-orange-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    User Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('services')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeTab === 'services' 
                        ? 'bg-orange-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Service Management
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            {activeTab === 'dashboard' && <AdminDashboardContent />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'services' && <ServiceManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    activeServices: 0,
    totalOrders: 0,
    recentActivities: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard data...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Services</h3>
          <p className="text-3xl font-bold">{stats.totalServices}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Services</h3>
          <p className="text-3xl font-bold">{stats.activeServices}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {stats.recentActivities.length > 0 ? (
            <ul className="space-y-3">
              {stats.recentActivities.map((activity, index) => (
                <li key={index} className="p-2 border-b">
                  <p className="text-gray-600">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
}