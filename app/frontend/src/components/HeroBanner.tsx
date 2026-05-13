import { useSiteContent } from "@/data/siteContent";

export default function HeroBanner() {
  const content = useSiteContent();
  const { hero } = content;

  return (
    <section className="relative h-[70vh] sm:h-[80vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={hero.backgroundImage}
          alt="Luxury perfumes"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="/logo.jpg"
              alt="1000 Ароматов"
              className="h-20 sm:h-24 lg:h-28 w-auto object-contain rounded-lg"
            />
          </div>
          <p className="text-[#C69B56] text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            {hero.subtitle}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
            {hero.headingLine1}
            <br />
            <span className="text-[#C69B56]">{hero.headingLine2}</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
            {hero.description}
          </p>
          <a
            href={hero.buttonLink}
            className="inline-block bg-[#C69B56] text-black px-8 py-3 text-sm tracking-[0.15em] uppercase font-medium hover:bg-[#d4aa65] transition-colors duration-300"
          >
            {hero.buttonText}
          </a>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C69B56]/30 to-transparent" />
    </section>
  );
}