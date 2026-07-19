import heroBanner from "../../assets/spiritualGuide/header-banner.png";

export default function Header() {
  return (
    <section
      className="relative w-full h-[280px] rectangular-3xl overflow-hidden shadow-xl"
      style={{
        backgroundImage: `url(${heroBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-10">
        <h1 className="text-5xl font-bold text-white">
          Spiritual Guide
        </h1>

        <p className="mt-3 text-lg text-gray-200">
          Your digital companion for a meaningful pilgrimage.
        </p>

        <p className="mt-8 text-2xl text-orange-300 font-semibold">
          "श्रीरामचंद्र कृपालु भजु मन, हरण भव भय दारुणम्।"
        </p>

        <p className="mt-3 text-white text-lg">
          — Goswami Tulsidas
        </p>
      </div>
    </section>
  );
}