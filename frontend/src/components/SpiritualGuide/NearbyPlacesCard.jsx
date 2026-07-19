import nearbyMap from "../../assets/SpiritualGuide/dailyHub/nearby-map.png";

import { nearbyPlaces } from "../../data/SpiritualGuide/dailyHubData";

import {
  MapPinned,
  ArrowRight,
  Navigation,
} from "lucide-react";

const placeLinks = {
  "Hanuman Garhi":
    "https://www.google.com/maps/search/?api=1&query=Hanuman+Garhi+Ayodhya",

  "Kanak Bhawan":
    "https://www.google.com/maps/search/?api=1&query=Kanak+Bhawan+Ayodhya",

  "Guptar Ghat":
    "https://www.google.com/maps/search/?api=1&query=Guptar+Ghat+Ayodhya",

  "Nageshwarnath Temple":
    "https://www.google.com/maps/search/?api=1&query=Nageshwarnath+Temple+Ayodhya",

  "Dashrath Mahal":
    "https://www.google.com/maps/search/?api=1&query=Dashrath+Mahal+Ayodhya",
};

export default function NearbyPlacesCard() {

const openRoute = (placeName) => {

  const url = placeLinks[placeName];

  window.open(url, "_blank");

};

  return (

    <div className="flex h-[520px] flex-col rounded-3xl border border-purple-100 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ================= Header ================= */}

      <div className="mb-4 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-purple-100 p-3 text-purple-600">

            <MapPinned size={20} />

          </div>

          <div>

            <h3 className="font-bold text-purple-700">

              Nearby Places

            </h3>

            <p className="text-sm text-slate-500">

              Around Shri Ram Mandir

            </p>

          </div>

        </div>

        <button
  onClick={() =>
    window.open(
      "https://www.google.com/maps/search/?api=1&query=Shri+Ram+Janmabhoomi+Mandir+Ayodhya",
      "_blank"
    )
  }
  className="text-sm font-semibold text-purple-600 transition hover:text-purple-700"
>

  View Map

</button>

      </div>

      {/* ================= Map ================= */}

      <div className="overflow-hidden rounded-2xl">

        <img
          src={nearbyMap}
          alt="Nearby Places"
          className="h-28 w-full cursor-pointer object-cover transition duration-500 hover:scale-105"
          onClick={() =>
  window.open(
    "https://www.google.com/maps/search/?api=1&query=Shri+Ram+Janmabhoomi+Mandir+Ayodhya",
    "_blank"
  )
}
        />

      </div>

      {/* ================= Places ================= */}

      <div className="mt-3 flex-1 space-y-2">

        {nearbyPlaces.map((place) => (

          <div
            key={place.name}
            className="group flex items-center justify-between rounded-xl border border-purple-100 px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-md"
          >

            <div>

              <h4 className="text-base font-semibold text-slate-800">

                {place.name}

              </h4>

              <div className="mt-1 flex items-center gap-1 text-[12px] text-slate-500">

                <Navigation
                  size={15}
                  className="text-purple-500"
                />

                <span>{place.distance}</span>

              </div>

            </div>

            <button
  onClick={() => openRoute(place.name)}
  className="flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 font-bold text-[12px] font-semibold text-purple-700 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white hover:scale-105 active:scale-95"
>

  Navigate

  <ArrowRight size={15} />

</button>

          </div>

        ))}

      </div>

    </div>

  );

}