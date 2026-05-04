import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import {
  CategoryGrid,
  FeaturedProducts,
  NewArrivals,
  About,
} from "@/components/HomeSections";

export default function Index() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProducts />
        <NewArrivals />
        <About />
      </main>
      <Footer />
    </div>
  );
}