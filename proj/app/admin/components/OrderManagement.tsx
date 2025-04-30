'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext'
import { ChevronDown, ChevronUp, Edit, ExternalLink, RefreshCw, Search } from 'lucide-react';

interface Order {
  id: string;
  serviceName: string;
  specificService?: string;
  serviceProvider: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledDate: string;
  price: number;
  address: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNotes?: string;
  createdAt: string;
  userId: string;
  userName: string;
}

export default function OrderManagement() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Order update form state
  const [orderForm, setOrderForm] = useState({
    status: '',
    scheduledDate: '',
    serviceProvider: '',
    price: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrderId(order.id);
    setOrderForm({
      status: order.status,
      scheduledDate: order.scheduledDate.split('T')[0], // Format date for input
      serviceProvider: order.serviceProvider,
      price: order.price.toString()
    });
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setOrderForm({
      status: '',
      scheduledDate: '',
      serviceProvider: '',
      price: ''
    });
  };

  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: orderForm.status,
          scheduledDate: new Date(orderForm.scheduledDate).toISOString(),
          serviceProvider: orderForm.serviceProvider,
          price: parseFloat(orderForm.price)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      setEditingOrderId(null);
      fetchOrders();
      
      // Add toast notification
      showToast('Order updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order. Please try again.');
      showToast('Failed to update order. Please try again.', 'error');
    }
  };

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      order.customerName.toLowerCase().includes(searchLower) ||
      order.serviceName.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower) ||
      order.customerPhone.includes(searchQuery) ||
      order.customerEmail.toLowerCase().includes(searchLower);
    
    return matchesStatus && matchesSearch;
  });

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading && orders.length === 0) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <button 
          onClick={fetchOrders} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <label className="block mb-1 text-sm">Filter by Status</label>
          <select 
            className="w-full px-3 py-2 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="md:w-2/3">
          <label className="block mb-1 text-sm">Search Orders</label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded pl-10"
              placeholder="Search by name, service, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Orders Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {currentOrders.length} of {filteredOrders.length} orders
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {currentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleExpandOrder(order.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {expandedOrderId === order.id ? 
                            <ChevronUp size={20} /> : 
                            <ChevronDown size={20} />
                          }
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono">
                          {order.id.substring(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.serviceName}</div>
                        {order.specificService && (
                          <div className="text-xs text-gray-500">{order.specificService}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.scheduledDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{order.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          <Edit size={16} />
                        </button>
                        <a 
                          href={`/admin/orders/${order.id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </td>
                    </tr>
                    
                    {expandedOrderId === order.id && (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50">
                          {editingOrderId === order.id ? (
                            <div className="bg-white p-4 border rounded-lg">
                              <h4 className="font-bold text-lg mb-4">Edit Order</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Status</label>
                                  <select
                                    name="status"
                                    value={orderForm.status}
                                    onChange={handleOrderFormChange}
                                    className="w-full px-3 py-2 border rounded"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                                  <input
                                    type="date"
                                    name="scheduledDate"
                                    value={orderForm.scheduledDate}
                                    onChange={handleOrderFormChange}
                                    className="w-full px-3 py-2 border rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Service Provider</label>
                                  <input
                                    type="text"
                                    name="serviceProvider"
                                    value={orderForm.serviceProvider}
                                    onChange={handleOrderFormChange}
                                    className="w-full px-3 py-2 border rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                  <input
                                    type="number"
                                    name="price"
                                    value={orderForm.price}
                                    onChange={handleOrderFormChange}
                                    className="w-full px-3 py-2 border rounded"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleUpdateOrder(order.id)}
                                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-bold mb-2">Customer Details</h4>
                                <p><span className="font-medium">Name:</span> {order.customerName}</p>
                                <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                                <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                                <p><span className="font-medium">Address:</span> {order.address}</p>
                              </div>
                              <div>
                                <h4 className="font-bold mb-2">Order Details</h4>
                                <p><span className="font-medium">Order ID:</span> {order.id}</p>
                                <p><span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleString()}</p>
                                <p><span className="font-medium">Service Provider:</span> {order.serviceProvider}</p>
                                {order.customerNotes && (
                                  <p><span className="font-medium">Notes:</span> {order.customerNotes}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="mt-6">
          <nav className="flex justify-center">
            <ul className="inline-flex">
              <li>
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l border ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'
                  }`}
                >
                  Prev
                </button>
              </li>
              {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 border-t border-b ${
                      currentPage === index + 1 
                        ? 'bg-blue-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => paginate(Math.min(Math.ceil(filteredOrders.length / ordersPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                  className={`px-3 py-1 rounded-r border ${
                    currentPage === Math.ceil(filteredOrders.length / ordersPerPage) 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}