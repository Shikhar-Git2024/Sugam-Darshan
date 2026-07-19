import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import VirtualTourModal from "./VirtualTourModal";
import {
    Play,
    Building2,
    Landmark,
    MapPinned,
    Columns3,
    Mountain,
    MapPin,
} from "lucide-react";

import templeOverview from "../../assets/SpiritualGuide/temple-overview.png";
import virtualTourData from "../../data/SpiritualGuide/virtualTourData";

export default function ImmersiveVirtualTour() {
    const [openTour, setOpenTour] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(virtualTourData[0]);

    return (
    <>
        <section className="mt-10 px-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-[32px] shadow-lg border border-orange-100 overflow-hidden"
            >
                {/* Heading */}

                <div className="px-8 pt-8">
                    <h2 className="text-[2.2rem] font-extrabold tracking-tight text-slate-900">
                        Immersive Virtual Tour
                    </h2>

                    <p className="mt-2 max-w-xl text-[15px] leading-7 text-slate-500">
                        Explore the temple with a guided interactive experience.
                    </p>
                </div>

                {/* Main Grid */}

                <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-6 p-6 items-start">

                    {/* LEFT */}

                    <div className="flex flex-col gap-5">

                        <div className=" group relative overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl transition-all duration-500 hover:shadow-2xl">

                            <motion.img
                                src={templeOverview}
                                alt="Temple"
                                animate={{scale: selectedPlace.id === 1 ? 1.02 : 1.05,}}
                                whileHover={{scale: 1.08,}}
                                transition={{ duration: 0.4 }}
                                className="w-full h-[400px] object-fill object-center transition-all duration-700"
                            />

                            {virtualTourData.map((place) => (
                                <motion.button
                                    key={place.id}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedPlace(place)}
                                    style={{
                                        top: place.position.top,
                                        left: place.position.left,
                                    }}
                                    className=" group absolute cursor-pointer -translate-x-1/2 -translate-y-1/2"
                                >
                                    
                                    <div className="relative">  
                                        <span
                                            className={`absolute inset-0 rounded-full ${
                                                selectedPlace.id===place.id
                                                    ?"animate-ping bg-red-500 opacity-300"
                                                    :"animate-pulse bg-orange-500 opacity-30"
                                            }`}
                                        />

                                        <span 
                                            className={`absolute -inset-3 rounded-full blur-xl ${
                                                selectedPlace.id===place.id
                                                    ?"bg-red-400/50"
                                                    :"bg-orange-400/40"
                                            }`}
                                        />

                                        {/* Marker */}

                                        <motion.div
                                            animate={{
                                                scale:selectedPlace.id===place.id?1.15:1,
                                                y:selectedPlace.id===place.id?-6:0,
                                                rotate:selectedPlace.id===place.id?[0,-5,5,-5,0]:0,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                type: "spring",
                                                stiffness: 300,
                                            }}
                                            className={`relative flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl ${
                                                selectedPlace.id === place.id
                                                    ? "bg-red-600 ring-4 ring-red-200"
                                                    : "bg-orange-500"
                                            }`}
                                        >
                                            <MapPin size={17} />
                                        </motion.div>

                                        {/* Tooltip */}

                                        <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-3 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-center opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100">

                                            <p className="text-sm font-semibold text-white">
                                                {place.title}
                                            </p>

                                            <p className="text-[11px] text-slate-300">
                                                Click to Explore
                                            </p>
                                    
                                        </div>

                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Statistics */}

                        <div className="grid grid-cols-5 overflow-hidden rounded-2xl border border-orange-100 bg-white">

                            <StatCard
                                icon={<Landmark size={22} />}
                                value="5"
                                label="Mandaps"
                            />

                            <StatCard
                                icon={<Columns3 size={22} />}
                                value="392"
                                label="Pillars"
                            />

                            <StatCard
                                icon={<Building2 size={22} />}
                                value="3"
                                label="Floors"
                            />

                            <StatCard
                                icon={<Mountain size={22} />}
                                value="70"
                                label="Acres"
                            />

                            <StatCard
                                icon={<Landmark size={22} />}
                                value="Nagara"
                                label="Architecture"
                            />

                        </div>

                    </div>

                    {/* RIGHT PANEL */}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedPlace.id}
                            initial={{ opacity: 0, x: 25, scale:.97 }}
                            animate={{ opacity: 1, x: 0, scale:1 }}
                            exit={{ opacity: 0, x: -20, scale:.97 }}
                            transition={{ duration: 0.35 }}
                            className="rounded-3xl border border-orange-100 bg-white p-3 shadow-md flex flex-col justify-between h-full"
                        >
                            <div className="flex items-start gap-4">

                                <div className="mt-1 h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-2">

                                    <MapPin size={22} />

                                </div>
                                <div>

                                    <h3 className="text-3xl font-bold text-slate-800">
                                        {selectedPlace.title}
                                    </h3>

                                    <p className="inline-flex mt-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                        Sacred Temple Location
                                    </p>
                                </div>  
                            </div>  
                            <p className="mt-6 text-[15px] leading-8 text-slate-600">
                                {selectedPlace.description}
                            </p>

                            <div className="space-y-2 mt-5">

                                <FeatureItem
                                    icon={<Landmark size={18} />}
                                    title="Garbh Griha"
                                    subtitle="Ram Lalla Sanctum"
                                    place={virtualTourData.find(
                                        (p) => p.title === "Garbh Griha"
                                    )}
                                    badge="CURRENT"
                                    active={selectedPlace.title === "Garbh Griha"}
                                    onClick={setSelectedPlace}
                                />

                                <FeatureItem
                                    icon={<MapPinned size={18} />}
                                    title="Parikrama Path"
                                    subtitle="Sacred Walking Route"
                                    place={virtualTourData.find(
                                        (p) => p.title === "Parikrama Path"
                                    )}
                                    badge="MUST VISIT"
                                    active={selectedPlace.title === "Parikrama Path"}
                                    onClick={setSelectedPlace}
                                />

                                <FeatureItem
                                    icon={<Building2 size={18} />}
                                    title="Nritya Mandap"
                                    subtitle="Prayer & Cultural Hall"
                                    place={virtualTourData.find(
                                        (p) => p.title === "Nritya Mandap"
                                    )}
                                    badge="OPEN"
                                    active={selectedPlace.title === "Nritya Mandap"}
                                    onClick={setSelectedPlace}
                                />

                                <FeatureItem
                                    icon={<Columns3 size={18} />}
                                    title="Rang Mandap"
                                    subtitle="Cultural & Devotional Hall"
                                    place={virtualTourData.find(
                                        (p) => p.title === "Rang Mandap"
                                    )}
                                    badge="EXPLORE"
                                    active={selectedPlace.title === "Rang Mandap"}
                                    onClick={setSelectedPlace}
                                />
                            </div>

                            <motion.button
                                onClick={() => setOpenTour(true)}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0 15px 40px rgba(249,115,22,.35)",
                                }}
                                whileTap={{
                                    scale: 0.97,
                                }}
                                className="group mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 py-4 font-bold text-white shadow-lg"
                            >
                                <Play
                                    size={18}
                                    className="transition group-hover:translate-x-1"
                                />

                                BEGIN VIRTUAL TOUR
                            </motion.button>

                        </motion.div>

                    </AnimatePresence>

                </div>

            </motion.div>

        </section>

        <VirtualTourModal
            isOpen={openTour}
            onClose={() => setOpenTour(false)}
        />

    </>
    );
}

function FeatureItem({
    icon,
    title,
    subtitle,
    badge,
    active,
    onClick,
    place,
}) {
    return (
        <motion.div
            onClick={() => onClick(place)}
            whileHover={{
                x: 6,
                backgroundColor: "#fff7ed",
            }}
            transition={{
                duration: 0.2,
            }}
            className={`group flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 transition-all duration-300 ${
                active
                    ? "border-orange-300 bg-orange-50 shadow-sm"
                    : "border-slate-200"
            }`}
        >
            <div className="flex items-center gap-3">

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        active
                            ? "bg-orange-500 text-white"
                            : "bg-orange-100 text-orange-600"
                    }`}
                >
                    {icon}
                </div>

                <div>

                    <h4 className="text-[15px] font-semibold text-slate-800">
                        {title}
                    </h4>

                    <p className="text-xs text-slate-500">
                        {subtitle}
                    </p>

                </div>

            </div>

            <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${
                    badge === "CURRENT"
                        ? "bg-red-100 text-red-700"
                        : badge === "OPEN"
                            ? "bg-green-100 text-green-700"
                            : badge === "NEARBY"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                }`}
            >
                {badge}
            </span>
        </motion.div>
    );
}

function StatCard({ icon, value, label }) {
    return (
        <motion.div
            whileHover={{
                y: -8,
                scale:1.04,
            }}
            transition={{
                duration: 0.2,
            }}
            className="group flex cursor-pointer flex-col items-center justify-center border-r border-orange-100 py-6 transition-all last:border-r-0 hover:bg-orange-50"
        >
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600 transition-all group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg">
                {icon}
            </div>

            <motion.div
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    delay: 0.1,
                }}
                className="mt-4 text-3xl font-bold text-slate-800"
            >
                {value}
            </motion.div>

            <div className="mt-1 text-sm text-slate-500">
                {label}
            </div>
        </motion.div>
    );
}