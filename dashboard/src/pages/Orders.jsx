import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Button, Input, Modal } from '../components/ui';
import { Plus, Eye, Pencil, Trash2, X } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    customer_name: '',
    code_names: [],
    address: '',
    phone_number: '',
    delivery_charge: 0,
    discount_amount: 0,
    status: 'Pending'
  });

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders/orders'),
        api.get('/inventory/products')
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      customer_name: '',
      code_names: [],
      address: '',
      phone_number: '',
      delivery_charge: 0,
      discount_amount: 0,
      status: 'Pending'
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/orders/orders/${editingId}`, formData);
      } else {
        await api.post('/orders/orders', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Failed to save order", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.delete(`/orders/orders/${id}`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete order", error);
      }
    }
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setFormData({
      customer_name: order.customer_name,
      code_names: order.code_names,
      address: order.address,
      phone_number: order.phone_number,
      delivery_charge: order.delivery_charge,
      discount_amount: order.discount_amount,
      status: order.status
    });
    setIsModalOpen(true);
  };

  const handleView = (order) => {
    setViewOrder(order);
    setIsViewModalOpen(true);
  };

  const getProductDetails = (code) => {
    return products.find(p => p.code_name === code) || { name: 'Unknown', price: 0 };
  };

  const calculateSubtotal = (codes) => {
    return codes.reduce((sum, code) => sum + getProductDetails(code).price, 0);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        {orders.length > 0 && (
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2">
            <Plus size={18} /> Add Order
          </Button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No orders placed yet</p>
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2">
            <Plus size={18} /> Create First Order
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-gray-500 font-medium">ID</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Customer</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Phone</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Address</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Products</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Total</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.customer_name}</td>
                  <td className="px-6 py-4">{order.phone_number}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{order.address}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {order.code_names.map((code, idx) => (
                        <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {code}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">৳{order.total_bill}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleView(order)} className="p-1 text-gray-600 hover:bg-gray-100 rounded" title="View">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleEdit(order)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(order.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Order" : "Create New Order"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Customer Name"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            required
          />
          <Input
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            required
          />
          <Input
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
            <select 
              className="w-full border border-gray-300 rounded p-2 mb-2"
              onChange={(e) => {
                if (e.target.value) {
                  setFormData({
                    ...formData,
                    code_names: [...formData.code_names, e.target.value]
                  });
                  e.target.value = "";
                }
              }}
            >
              <option value="">Add Product...</option>
              {products.map(p => (
                <option key={p.id} value={p.code_name}>
                  {p.code_name} - {p.name} (৳{p.price})
                </option>
              ))}
            </select>
            
            <div className="border rounded divide-y max-h-40 overflow-y-auto">
              {formData.code_names.length === 0 && <div className="p-2 text-gray-400 text-sm text-center">No products selected</div>}
              {formData.code_names.map((code, idx) => {
                const product = getProductDetails(code);
                return (
                  <div key={idx} className="flex justify-between items-center p-2 text-sm">
                    <span>{code} - {product.name}</span>
                    <div className="flex items-center gap-3">
                      <span>৳{product.price}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newCodes = [...formData.code_names];
                          newCodes.splice(idx, 1);
                          setFormData({ ...formData, code_names: newCodes });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-right text-sm font-bold mt-1">
              Subtotal: ৳{calculateSubtotal(formData.code_names)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge</label>
              <Input
                type="number"
                value={formData.delivery_charge}
                onChange={(e) => setFormData({ ...formData, delivery_charge: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
              <Input
                type="number"
                value={formData.discount_amount}
                onChange={(e) => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {editingId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          )}
          
          <Button type="submit" className="w-full">{editingId ? "Update Order" : "Create Order"}</Button>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details">
        {viewOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500">Customer</label>
                <div className="font-medium">{viewOrder.customer_name}</div>
              </div>
              <div>
                <label className="text-gray-500">Phone</label>
                <div className="font-medium">{viewOrder.phone_number}</div>
              </div>
              <div className="col-span-2">
                <label className="text-gray-500">Address</label>
                <div className="font-medium">{viewOrder.address}</div>
              </div>
              <div>
                <label className="text-gray-500">Status</label>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    viewOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    viewOrder.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {viewOrder.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-4 py-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {viewOrder.code_names.map((code, idx) => {
                    const product = getProductDetails(code);
                    return (
                      <tr key={idx}>
                        <td className="px-4 py-2">
                          <div className="font-medium">{code}</div>
                          <div className="text-gray-500 text-xs">{product.name}</div>
                        </td>
                        <td className="px-4 py-2 text-right">৳{product.price}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td className="px-4 py-2">Subtotal</td>
                    <td className="px-4 py-2 text-right">৳{calculateSubtotal(viewOrder.code_names)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Delivery Charge</td>
                    <td className="px-4 py-2 text-right">+৳{viewOrder.delivery_charge}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Discount</td>
                    <td className="px-4 py-2 text-right">-৳{viewOrder.discount_amount}</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 font-bold">Total Bill</td>
                    <td className="px-4 py-2 text-right font-bold">৳{viewOrder.total_bill}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
