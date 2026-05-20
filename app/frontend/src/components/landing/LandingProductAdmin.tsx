import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchLandingProducts,
  createLandingProduct,
  updateLandingProduct,
  deleteLandingProduct,
  LandingProduct,
} from '@/stores/landingStore';

interface AttributeOption {
  label: string;
  price: number;
  inventory: number;
}

interface AttributeGroup {
  name: string;
  options: AttributeOption[];
}

export default function LandingProductAdmin() {
  const { pageId } = useParams<{ pageId: string }>();
  const [products, setProducts] = useState<LandingProduct[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<LandingProduct>>({});
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([]);
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
    const result = await fetchLandingProducts(catalogueId);
    setProducts(result);
    setLoading(false);
  };

  const parseAttributesToGroups = (attrs: Record<string, any> | undefined): AttributeGroup[] => {
    if (!attrs) return [];
    // Support array format: [{name, options:[{label, price, inventory}]}]
    if (Array.isArray(attrs)) {
      return attrs.map((group: any) => ({
        name: group.name || '',
        options: Array.isArray(group.options)
          ? group.options.map((opt: any) => ({
              label: opt.label || '',
              price: typeof opt.price === 'number' ? opt.price : 0,
              inventory: typeof opt.inventory === 'number' ? opt.inventory : 0,
            }))
          : [],
      }));
    }
    // Support object format: {Size: ["50ml", "100ml"]} — convert to array format
    return Object.entries(attrs).map(([name, values]) => ({
      name,
      options: Array.isArray(values)
        ? values.map((v: any) => ({
            label: typeof v === 'string' ? v : v.label || '',
            price: typeof v === 'object' && v.price !== undefined ? v.price : 0,
            inventory: typeof v === 'object' && v.inventory !== undefined ? v.inventory : 0,
          }))
        : [],
    }));
  };

  const groupsToAttributes = (groups: AttributeGroup[]): Record<string, any>[] => {
    return groups.map((g) => ({
      name: g.name,
      options: g.options.map((o) => ({
        label: o.label,
        price: o.price,
        inventory: o.inventory,
      })),
    }));
  };

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    setError('');

    const data = {
      ...formData,
      catalogue_id: parseInt(pageId, 10),
      attributes: groupsToAttributes(attributeGroups),
    };

    try {
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
      setAttributeGroups([]);
    } catch (e) {
      setError('Failed to save product');
    }

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
    setAttributeGroups(parseAttributesToGroups(product?.attributes));
    setEditing(true);
  };

  const addAttributeGroup = () => {
    setAttributeGroups([...attributeGroups, { name: '', options: [] }]);
  };

  const removeAttributeGroup = (groupIndex: number) => {
    setAttributeGroups(attributeGroups.filter((_, i) => i !== groupIndex));
  };

  const updateGroupName = (groupIndex: number, name: string) => {
    const updated = [...attributeGroups];
    updated[groupIndex] = { ...updated[groupIndex], name };
    setAttributeGroups(updated);
  };

  const addOption = (groupIndex: number) => {
    const updated = [...attributeGroups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      options: [...updated[groupIndex].options, { label: '', price: 0, inventory: 0 }],
    };
    setAttributeGroups(updated);
  };

  const removeOption = (groupIndex: number, optionIndex: number) => {
    const updated = [...attributeGroups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      options: updated[groupIndex].options.filter((_, i) => i !== optionIndex),
    };
    setAttributeGroups(updated);
  };

  const updateOption = (groupIndex: number, optionIndex: number, field: keyof AttributeOption, value: string | number) => {
    const updated = [...attributeGroups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      options: updated[groupIndex].options.map((opt, i) =>
        i === optionIndex ? { ...opt, [field]: value } : opt
      ),
    };
    setAttributeGroups(updated);
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
                  {p.attributes && Array.isArray(p.attributes) && p.attributes.length > 0 && (
                    <span className="ml-2 text-[#C69B56]">
                      ({p.attributes.length} variant{p.attributes.length > 1 ? 's' : ''})
                    </span>
                  )}
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
        <div className="p-6 bg-white/5 border border-white/10 space-y-4 max-h-[80vh] overflow-y-auto">
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
              <label className="block text-white/60 text-xs mb-1.5">Base Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price ?? ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
              <p className="text-white/30 text-xs mt-1">Default price (overridden by variant prices)</p>
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
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order || 0}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div className="flex items-center">
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
          </div>

          {/* Variant / Attributes Editor */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white/80 text-sm font-medium">Variants & Attributes</h4>
              <button
                onClick={addAttributeGroup}
                className="px-3 py-1 text-xs bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
              >
                + Add Attribute
              </button>
            </div>
            <p className="text-white/30 text-xs mb-3">
              Define variant groups (e.g. Size, Color). Each option can have its own price and inventory.
            </p>

            {attributeGroups.length === 0 && (
              <div className="text-white/30 text-xs py-4 text-center border border-dashed border-white/10">
                No variants defined. Click "+ Add Attribute" to create variant options.
              </div>
            )}

            {attributeGroups.map((group, gi) => (
              <div key={gi} className="mb-4 p-4 bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => updateGroupName(gi, e.target.value)}
                    placeholder="Attribute name (e.g. Size, Color)"
                    className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56]/50 focus:outline-none"
                  />
                  <button
                    onClick={() => removeAttributeGroup(gi)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>

                {group.options.length > 0 && (
                  <div className="grid grid-cols-[1fr_80px_80px_40px] gap-2 mb-2 px-1">
                    <span className="text-white/40 text-xs">Option Label</span>
                    <span className="text-white/40 text-xs">Price</span>
                    <span className="text-white/40 text-xs">Inventory</span>
                    <span></span>
                  </div>
                )}

                {group.options.map((opt, oi) => (
                  <div key={oi} className="grid grid-cols-[1fr_80px_80px_40px] gap-2 mb-2">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => updateOption(gi, oi, 'label', e.target.value)}
                      placeholder="e.g. 100ml"
                      className="bg-white/5 border border-white/10 text-white text-sm px-3 py-1.5 focus:border-[#C69B56]/50 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={opt.price}
                      onChange={(e) => updateOption(gi, oi, 'price', parseFloat(e.target.value) || 0)}
                      className="bg-white/5 border border-white/10 text-white text-sm px-3 py-1.5 focus:border-[#C69B56]/50 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={opt.inventory}
                      onChange={(e) => updateOption(gi, oi, 'inventory', parseInt(e.target.value) || 0)}
                      className="bg-white/5 border border-white/10 text-white text-sm px-3 py-1.5 focus:border-[#C69B56]/50 focus:outline-none"
                    />
                    <button
                      onClick={() => removeOption(gi, oi)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addOption(gi)}
                  className="mt-1 px-3 py-1 text-xs text-white/50 hover:text-white/80 transition-colors border border-dashed border-white/10 hover:border-white/30"
                >
                  + Add Option
                </button>
              </div>
            ))}
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
              onClick={() => { setEditing(false); setFormData({}); setAttributeGroups([]); }}
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