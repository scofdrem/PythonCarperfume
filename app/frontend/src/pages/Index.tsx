import HeroBanner from "@/components/HeroBanner";
import {
  CategoryGrid,
  FeaturedProducts,
  NewArrivals,
  About,
} from "@/components/HomeSections";

export default function Index() {
  return (
    <main>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <NewArrivals />
      <About />
    </main>
  );
}