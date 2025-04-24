'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function DashboardSummary() {
  const { token } = useAuth();
  interface Activity {
    message: string;
    timestamp: string;
  }

  const [stats, setStats] = useState<{
    totalUsers: number;
    totalServices: number;
    totalOrders: number;
    activeServices: number;
    recentActivities: Activity[];
  }>({
    totalUsers: 0,
    totalServices: 0,
    totalOrders: 0,
    activeServices: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard data...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Services</h3>
          <p className="text-3xl font-bold">{stats.totalServices}</p>
          <p className="text-sm">{stats.activeServices} active</p>
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
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
}