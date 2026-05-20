import React, { useEffect, useState } from 'react';
import {
  fetchLandingPages,
  fetchLandingPageById,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
  fetchCatalogue,
  updateCatalogue,
  LandingPage as LandingPageType,
  LandingCatalogue,
} from '@/stores/landingStore';

interface LandingPageAdminProps {
  pageId?: number;
}

export default function LandingPageAdmin({ pageId }: LandingPageAdminProps) {
  const [pages, setPages] = useState<LandingPageType[]>([]);
  const [page, setPage] = useState<LandingPageType | null>(null);
  const [catalogue, setCatalogue] = useState<LandingCatalogue | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<LandingPageType>>({});
  const [catalogueName, setCatalogueName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (pageId) {
      loadPage(pageId);
    } else {
      setLoading(false);
    }
  }, [pageId]);

  const loadPages = async () => {
    const result = await fetchLandingPages();
    setPages(result);
  };

  const loadPage = async (id: number) => {
    setLoading(true);
    const result = await fetchLandingPageById(id);
    setPage(result);
    setFormData(result || {});

    const cat = await fetchCatalogue(id);
    setCatalogue(cat);
    setCatalogueName(cat?.name || '');
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (page?.id) {
      const updated = await updateLandingPage(page.id, formData);
      if (updated) setPage(updated);
    } else {
      const created = await createLandingPage(formData);
      if (created) {
        await loadPages();
        setFormData({});
      }
    }
    setEditing(false);
    setSaving(false);
  };

  const handleCatalogueSave = async () => {
    if (!page?.id) return;
    await updateCatalogue(page.id, { name: catalogueName });
    setCatalogue((prev) => prev ? { ...prev, name: catalogueName } : null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this landing page?')) return;
    await deleteLandingPage(id);
    await loadPages();
    if (page?.id === id) {
      setPage(null);
      setFormData({});
    }
  };

  if (loading) return <div className="text-white/60">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Page List */}
      {!pageId && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-medium">Landing Pages</h3>
            <button
              onClick={() => { setFormData({}); setEditing(true); }}
              className="px-4 py-2 bg-[#C69B56] text-black text-sm font-medium hover:bg-[#d4aa65] transition-colors"
            >
              + New Page
            </button>
          </div>
          <div className="grid gap-3">
            {pages.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10"
              >
                <div>
                  <div className="text-white font-medium">{p.name}</div>
                  <div className="text-white/40 text-sm">/{p.slug} — {p.domain || 'No domain'}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadPage(p.id)}
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
            {pages.length === 0 && (
              <div className="text-white/40 text-sm py-8 text-center">No landing pages yet</div>
            )}
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editing && (
        <div className="p-6 bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-white text-lg font-medium">
            {page?.id ? 'Edit Landing Page' : 'New Landing Page'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Slug *</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Domain</label>
              <input
                type="text"
                value={formData.domain || ''}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="example.com"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Hero Image URL</label>
              <input
                type="text"
                value={formData.hero_image || ''}
                onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/60 text-xs mb-1.5">Hero Title</label>
              <input
                type="text"
                value={formData.hero_title || ''}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/60 text-xs mb-1.5">Hero Subtitle</label>
              <input
                type="text"
                value={formData.hero_subtitle || ''}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/60 text-xs mb-1.5">SEO Title</label>
              <input
                type="text"
                value={formData.seo_title || ''}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/60 text-xs mb-1.5">SEO Description</label>
              <textarea
                value={formData.seo_description || ''}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                rows={2}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Primary Color</label>
              <input
                type="text"
                value={formData.theme_primary || ''}
                onChange={(e) => setFormData({ ...formData, theme_primary: e.target.value })}
                placeholder="#C69B56"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Secondary Color</label>
              <input
                type="text"
                value={formData.theme_secondary || ''}
                onChange={(e) => setFormData({ ...formData, theme_secondary: e.target.value })}
                placeholder="#1A1A2E"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
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
              onClick={() => { setEditing(false); setFormData({}); }}
              className="px-6 py-2 text-white/60 text-sm hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Catalogue Settings */}
      {page && !editing && (
        <div className="p-6 bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-white text-lg font-medium">Catalogue Settings</h3>
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Catalogue Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={catalogueName}
                onChange={(e) => setCatalogueName(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[#C69B56]/50 focus:outline-none"
              />
              <button
                onClick={handleCatalogueSave}
                className="px-4 py-2 bg-[#C69B56] text-black text-sm font-medium hover:bg-[#d4aa65] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
          {catalogue && (
            <div className="text-white/40 text-sm">Catalogue ID: {catalogue.id}</div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => { setEditing(true); setFormData(page); }}
              className="px-6 py-2 text-white/60 text-sm hover:text-white transition-colors border border-white/10"
            >
              Edit Page Settings
            </button>
            <a
              href={`/admin/landing-catalogue/${page.id}`}
              className="px-6 py-2 bg-[#C69B56] text-black text-sm font-medium hover:bg-[#d4aa65] transition-colors"
            >
              Manage Products
            </a>
          </div>
        </div>
      )}
    </div>
  );
}