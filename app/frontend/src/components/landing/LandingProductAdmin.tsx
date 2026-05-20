import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchLandingProducts,
  fetchLandingProductById,
  createLandingProduct,
  updateLandingProduct,
  deleteLandingProduct,
  LandingProduct,
} from '@/stores/landingStore';

export default function LandingProductAdmin() {
  const { pageId } = useParams<{ pageId: string }>();
  const [products, setProducts] = useState<LandingProduct[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<LandingProduct>>({});
  const [attributesJson, setAttributesJson] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pageId) {
      loadProducts(parseInt(pageId, 10));
    }
  }, [pageId]);

  const loadProducts = async (catalogueId: number) => {
    setLoading(true);
    // For now, fetch all and filter client-side
    // In production, API should accept catalogue_id filter
    const result = await fetchLandingProducts(catalogueId);
    setProducts(result);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);

    // Parse attributes
    let attrs = {};
    if (attributesJson.trim()) {
      try {
        attrs = JSON.parse(attributesJson);
      } catch {
        setError('Invalid JSON in attributes');
        setSaving(false);
        return;
      }
    }

    const data = { ...formData, catalogue_id: parseInt(pageId, 10), attributes: attrs };

    if (formData.id) {
      const updated = await updateLandingProduct(formData.id, data);
      if (updated) {
        await loadProducts(parseInt(pageId, 10));
      }
    } else {
      const created = await createLandingProduct(data);
      if (created) {
        await loadProducts(parseInt(pageId, 10));
      }
    }

    setEditing(false);
    setFormData({});
    setAttributesJson('');
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await deleteLandingProduct(id);
    if (pageId) {
      await loadProducts(parseInt(pageId, 10));
    }
  };

  const openEdit = (product?: LandingProduct) => {
    setFormData(product || {});
    setAttributesJson(product?.attributes ? JSON.stringify(product.attributes, null, 2) : '');
    setEditing(true);
  };

  if (loading) return <div className="text-white/60">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-medium">Products (Catalogue #{pageId})</h3>
        <button
          onClick={() => openEdit()}
          className="px-4 py-2 bg-[#C69B56] text-black text-sm font-medium hover:bg-[#d4aa65] transition-colors"
        >
          + New Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-4">
              {p.image_url && (
                <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded" />
              )}
              <div>
                <div className="text-white font-medium">{p.name}</div>
                <div className="text-white/40 text-sm">
                  {p.category || 'No category'} • ${p.price?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs px-2 py-1 rounded ${p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {p.is_active ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => openEdit(p)}
                className="px-3 py-1 text-sm text-white/60 hover:text-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-white/40 text-sm py-8 text-center">No products in this catalogue</div>
        )}
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="p-6 bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-white text-lg font-medium">
            {formData.id ? 'Edit Product' : 'New Product'}
          </h3>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-white/60 text-xs mb-1.5">Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Category</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/60 text-xs mb-1.5">Image URL</label>
              <input
                type="text"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/60 text-xs mb-1.5">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/60 text-xs mb-1.5">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order || 0}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-white/60 text-xs">
                <input
                  type="checkbox"
                  checked={formData.is_active !== false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-white/10"
                />
                Active
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-white/60 text-xs mb-1.5">
                Attributes (JSON)
              </label>
              <textarea
                value={attributesJson}
                onChange={(e) => setAttributesJson(e.target.value)}
                placeholder='{"size": ["50ml", "100ml"], "color": ["gold", "silver"]}'
                rows={6}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none font-mono text-xs resize-none"
              />
              <p className="text-white/30 text-xs mt-1">
                Define configurable parameters like size, color, variants, etc.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#C69B56] text-black text-sm font-medium hover:bg-[#d4aa65] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(false); setFormData({}); setAttributesJson(''); }}
              className="px-6 py-2 text-white/60 text-sm hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}