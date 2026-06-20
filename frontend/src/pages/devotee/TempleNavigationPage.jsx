import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, LocateFixed, Route, Search, Cloud, Users, Clock3 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function TempleNavigationPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState("");
  const templePosition = [26.7956, 82.1943];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  const zones = [
    { name: "Ram Mandir", crowd: "Moderate", icon: "🛕" },
    { name: "Parikrama Path", crowd: "Low", icon: "🚶" },
    { name: "Yatri Suvidha Kendra", crowd: "Low", icon: "🏢" },
    { name: "Medical Center", crowd: "Low", icon: "🏥" },
    { name: "Parking Area", crowd: "High", icon: "🚗" },
  ];

  const filteredZones = zones.filter((z) => z.name.toLowerCase().includes(search.toLowerCase()));

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(2);
  }

  const distance = userLocation ? calculateDistance(userLocation[0], userLocation[1], templePosition[0], templePosition[1]) : null;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-slate-900 mb-8">Temple Navigation</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Map Column */}
          <div className="lg:col-span-2 space-y-6">
            <input 
              type="text" 
              placeholder="Search temple facilities..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-200 shadow-sm outline-none focus:border-orange-500 transition-colors"
            />
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-[450px]">
              <MapContainer center={templePosition} zoom={16} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={templePosition}><Popup>Ram Mandir</Popup></Marker>
                {userLocation && <Marker position={userLocation}><Popup>Your Location</Popup></Marker>}
              </MapContainer>
            </div>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-4">Temple Info</h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between"><span>Open:</span> <b>6:00 AM</b></p>
                <p className="flex justify-between"><span>Crowd:</span> <b className="text-amber-600">Moderate</b></p>
                <p className="flex justify-between"><span>Wait Time:</span> <b>18 Min</b></p>
                <p className="flex justify-between"><span>Weather:</span> <b>31°C</b></p>
              </div>
            </div>

            {distance && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold">Distance To Temple</h3>
                <p className="mt-2 text-2xl font-bold text-orange-600">{distance} km away</p>
              </div>
            )}
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10">
          {filteredZones.map((zone) => (
            <div key={zone.name} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="text-3xl mb-3">{zone.icon}</div>
              <h4 className="font-bold text-sm">{zone.name}</h4>
              <p className="text-xs text-slate-500 mt-1">Crowd: {zone.crowd}</p>
            </div>
          ))}
        </div>

        {/* Route Timeline */}
        <div className="mt-10 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><Route /> Suggested Route</h2>
          <div className="space-y-2 ml-2">
            {["Entry Gate", "Security Check", "Ram Mandir", "Parikrama Path", "Exit Gate"].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                  {i < 4 && <div className="w-0.5 h-6 bg-orange-200" />}
                </div>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}