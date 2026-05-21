import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchLandingPageBySlug,
  fetchCatalogue,
  fetchLandingProducts,
  LandingPage as LandingPageType,
  LandingCatalogue,
  LandingProduct,
} from '@/stores/landingStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InquiryModal from '@/components/InquiryModal';
import type { Product } from '@/data/products';

const LandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<LandingPageType | null>(null);
  const [catalogue, setCatalogue] = useState<LandingCatalogue | null>(null);
  const [products, setProducts] = useState<LandingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);

  const loadData = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    const pageData = await fetchLandingPageBySlug(slug);
    if (!pageData) {
      setLoading(false);
      navigate('/');
      return;
    }
    setPage(pageData);

    const cat = await fetchCatalogue(pageData.id);
    setCatalogue(cat);

    if (cat) {
      const prods = await fetchLandingProducts(cat.id);
      setProducts(prods);
    }
    setLoading(false);
  }, [slug, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleHomeClick = () => {
    // Navigate to root of current domain (stays on same domain)
    window.location.href = window.location.origin;
  };

  const handleProductClick = (product: LandingProduct) => {
    setInquiryProduct({
      id: product.id,
      name: product.name,
      brand: product.category || 'Landing',
      category: product.category || '',
      price: 0,
      volumes: [],
      image: product.image_url || '',
      description: product.description || '',
      instagramUrl: '',
    });
    setShowInquiry(true);
  };

  // Dynamic SEO
  useEffect(() => {
    if (page) {
      document.title = page.seo_title || page.name;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', page.seo_description || '');

      // Update canonical link
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `${window.location.origin}/landing/${slug}`);

      // Update og:title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', page.seo_title || page.name);

      // Update og:description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', page.seo_description || '');

      // Update og:url
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute('content', `${window.location.origin}/landing/${slug}`);
    }
  }, [page, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ '--primary': page.theme_primary || '#c9a96e', '--secondary': page.theme_secondary || '#1a1a2e' } as React.CSSProperties}>
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-[var(--secondary)] to-black text-white">
        {page.hero_image && (
          <img
            src={page.hero_image}
            alt={page.hero_title || 'Hero'}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{page.hero_title || page.name}</h1>
          <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">{page.hero_subtitle}</p>
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-8 px-8 py-3 bg-[var(--primary)] text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--secondary)' }}>
            Our Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(p => p.is_active).map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group"
                onClick={() => handleProductClick(product)}
              >
                {product.image_url ? (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-6">
                  {product.category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                      {product.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mt-1">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-600 mt-2 text-sm line-clamp-2">{product.description}</p>
                  )}
                  {product.price && (
                    <p className="text-lg font-semibold mt-3" style={{ color: 'var(--primary)' }}>
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Inquiry Modal */}
      {inquiryProduct && (
        <InquiryModal
          product={inquiryProduct}
          selectedVolume={0}
          isOpen={showInquiry}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;