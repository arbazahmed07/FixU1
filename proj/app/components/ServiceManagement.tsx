'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useServices } from '../../contexts/ServicesContext';
import { Pencil, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  type: string;
  description: string;
  active: boolean;
  category: string;
  price?: string;
  items: string[];
  createdAt?: string;
}

export default function ServiceManagement() {
  const { token } = useAuth();
  const { refreshServices } = useServices();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    active: true,
    category: '',
    price: '',
    items: [] as string[],
    newItem: ''
  });

  const categories = [
    'Appliance & AC Services', 
    'Home Repairs & Maintenance', 
    'Health & Nursing Care', 
    'Other Services'
  ];

  useEffect(() => {
    fetchServices();
  }, [token]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      setServices(data.services);
      refreshServices();
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleAddItem = () => {
    if (formData.newItem.trim()) {
      setFormData({
        ...formData,
        items: [...formData.items, formData.newItem.trim()],
        newItem: ''
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({
      ...formData,
      items: newItems
    });
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      type: service.type,
      description: service.description,
      active: service.active,
      category: service.category,
      price: service.price || '',
      items: [...service.items],
      newItem: ''
    });
    setShowAddForm(false);
  };

  const handleAddService = () => {
    setEditingService(null);
    setFormData({
      title: '',
      type: '',
      description: '',
      active: true,
      category: '',
      price: '',
      items: [],
      newItem: ''
    });
    setShowAddForm(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`/api/admin/services/${serviceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete service');
        }
        
        // Refresh service list
        fetchServices();
      } catch (err) {
        console.error('Error deleting service:', err);
        setError('Failed to delete service. Please try again.');
      }
    }
  };

  const handleToggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to update service status');
      }
      
      // Refresh service list
      fetchServices();
    } catch (err) {
      console.error('Error updating service status:', err);
      setError('Failed to update service status. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      setError('Please add at least one service item');
      return;
    }

    try {
      if (editingService) {
        // Update existing service
        const response = await fetch(`/api/admin/services/${editingService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: formData.title,
            type: formData.type,
            description: formData.description,
            active: formData.active,
            category: formData.category,
            price: formData.price,
            items: formData.items
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update service');
        }
      } else {
        // Create new service
        const response = await fetch('/api/admin/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: formData.title,
            type: formData.type,
            description: formData.description,
            active: formData.active,
            category: formData.category,
            price: formData.price,
            items: formData.items
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create service');
        }
      }
      
      // Reset form and state
      setEditingService(null);
      setShowAddForm(false);
      setFormData({
        title: '',
        type: '',
        description: '',
        active: true,
        category: '',
        price: '',
        items: [],
        newItem: ''
      });
      setError(null);
      
      // Refresh services list
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err instanceof Error ? err.message : 'Failed to save service. Please try again.');
    }
  };

  if (loading && services.length === 0) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Service Management</h2>
        <button 
          onClick={handleAddService}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Service
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {(editingService || showAddForm) && (
        <div className="bg-gray-50 p-6 mb-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Service Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Service Type (URL slug)</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Price Range</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g. ₹500-2000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="mr-2"
                />
                <span>Active (Show on website)</span>
              </label>
            </div>
            
            <div className="mt-6">
              <label className="block mb-1">Service Items</label>
              <div className="flex">
                <input
                  type="text"
                  name="newItem"
                  value={formData.newItem}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border rounded-l"
                  placeholder="Add new service item"
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                >
                  Add
                </button>
              </div>
              
              <div className="mt-2 border rounded p-2 min-h-[100px] bg-white">
                {formData.items.length === 0 ? (
                  <p className="text-gray-500 p-2">No items added yet</p>
                ) : (
                  <ul className="space-y-1">
                    {formData.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingService(null);
                  setShowAddForm(false);
                  setError(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.length > 0 ? (
              services.map(service => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleServiceStatus(service.id, service.active)}
                      className={`flex items-center ${
                        service.active 
                          ? 'text-green-600 hover:text-green-800' 
                          : 'text-red-600 hover:text-red-800'
                      }`}
                    >
                      {service.active ? 
                        <><ToggleRight size={22} className="mr-1" /> Active</> : 
                        <><ToggleLeft size={22} className="mr-1" /> Inactive</>
                      }
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{service.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{service.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{service.price || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {service.items.slice(0, 2).join(', ')}
                      {service.items.length > 2 && '...'}
                    </div>
                    <div className="text-xs text-gray-500">{service.items.length} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditService(service)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil size={16} className="inline mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} className="inline mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">No services found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}