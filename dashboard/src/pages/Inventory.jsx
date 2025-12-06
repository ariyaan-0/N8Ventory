import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Button, Input, Modal } from '../components/ui';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code_name: '', name: '', description: '', price: '', quantity: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/inventory/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/inventory/products/${editingId}`, formData);
      } else {
        await api.post('/inventory/products', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/inventory/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      code_name: product.code_name,
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ code_name: '', name: '', description: '', price: '', quantity: '' });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        {products.length > 0 && (
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus size={18} /> Add Item
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No items in inventory</p>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus size={18} /> Add First Item
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-gray-500 font-medium">Code</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Name</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Description</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Price</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Quantity</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{product.code_name}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4 text-gray-500">{product.description}</td>
                  <td className="px-6 py-4">৳{product.price}</td>
                  <td className="px-6 py-4">{product.quantity}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Product" : "Add New Product"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Code Name (e.g., PROD-001)"
            value={formData.code_name}
            onChange={(e) => setFormData({ ...formData, code_name: e.target.value })}
            required
            disabled={!!editingId} // Code name might be immutable or unique
          />
          <Input
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">{editingId ? "Update Product" : "Add Product"}</Button>
        </form>
      </Modal>
    </div>
  );
}
