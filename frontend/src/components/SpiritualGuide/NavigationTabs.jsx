import navigation from "../../data/SpiritualGuide/navigation";
import { scrollToSection } from "../../utils/scrollToSection";

export default function NavigationTabs() {
  return (
    <section className="-mt-6 sticky top-0 z-50 px-6">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100 p-4 shadow-lg shadow-orange-200">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

          {navigation.map((item) => {
            const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.target)}
              className="
                flex items-center justify-center gap-3
                rounded-2xl
                border
                border-slate-200
                bg-white
                py-5
                transition-all
                duration-300
                hover:border-orange-400
                hover:shadow-lg
                hover:-translate-y-1
              "
            >
                <Icon
                  size={24}
                  className="text-orange-600"
                />

                <span className="font-semibold text-slate-700">
                  {item.title}
                </span>

              </button>
            );
          })}

        </div>

      </div>
    </section>
  );
}