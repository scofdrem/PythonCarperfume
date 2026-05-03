import HeroBanner from "@/components/HeroBanner";
import {
  CategoryGrid,
  FeaturedProducts,
  Brands,
  NewArrivals,
  About,
} from "@/components/HomeSections";

export default function Index() {
  return (
    <main>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <Brands />
      <NewArrivals />
      <About />
    </main>
  );
}