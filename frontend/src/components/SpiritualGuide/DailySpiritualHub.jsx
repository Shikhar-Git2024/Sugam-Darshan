import featuredVideo from "../../assets/SpiritualGuide/dailyHub/featured-video.png";
import shriRamMantra from "../../assets/SpiritualGuide/audio/shri-ram-mantra.mp3";
import hanumanChalisa from "../../assets/SpiritualGuide/audio/shree-hanuman-chalisa.mp3";
import ramRaksha from "../../assets/SpiritualGuide/audio/ram-raksha.mp3";
import shriRamBhajan from "../../assets/SpiritualGuide/audio/shri-ram-bhajan.mp3";
import StoriesCard from "./StoriesCard";
import NearbyPlacesCard from "./NearbyPlacesCard";
import SpiritualTipsCard from "./SpiritualTipsCard";
import DailyWisdomFooter from "./DailyWisdomFooter";
import { useState, useRef, useEffect } from "react";
import LiveDarshanModal from "./LiveDarshanModal";
import StoryModal from "./StoryModal";

import {
    aartiTimings,
    mantraData
} from "../../data/SpiritualGuide/dailyHubData";

import {
    CalendarDays,
    Bell,
    Flame,
    Play,
    Music4,
    Heart,
    Sparkles,
    Eye,
    PlayCircle,
    Radio,
    Pause,
} from "lucide-react";

export default function DailySpiritualHub() {
    const [openLive, setOpenLive] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [playing, setPlaying] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(new Audio());
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem("favoriteMantras");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const playAudio = (item) => {
        const audioMap = {
            "Shri Ram Mantra": shriRamMantra,
            "Hanuman Chalisa": hanumanChalisa,
            "Ram Raksha Stotra": ramRaksha,
            "Shri Ram Bhajan": shriRamBhajan,
        };

        const audioSource = audioMap[item.title];

        if (!audioSource) return;

        if (playing === item.title) {
            audioRef.current.pause();
            setPlaying(null);
            return;
        }

        audioRef.current.pause();
        audioRef.current.src = audioSource;
        audioRef.current.play();

        setPlaying(item.title);
    };

    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const updateDuration = () => {
            setDuration(audio.duration || 0);
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", () => {
            setPlaying(null);
            setCurrentTime(0);
            setIsPaused(false);
        });

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
        };
    }, []);

    const formatTime = (time) => {
        if (!time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleSeek = (e) => {
        const value = Number(e.target.value);
        audioRef.current.currentTime = value;
        setCurrentTime(value);
    };

    const toggleFavorite = (title) => {
        const updated = favorites.includes(title)
            ? favorites.filter((item) => item !== title)
            : [...favorites, title];

        setFavorites(updated);
        localStorage.setItem("favoriteMantras", JSON.stringify(updated));
    };

    const getNextAarti = () => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const timings = [
            {
                name: "Mangala Aarti",
                time: "4:00 AM",
                minutes: 240,
            },
            {
                name: "Shringar Aarti",
                time: "6:00 AM",
                minutes: 360,
            },
            {
                name: "Shayan Aarti",
                time: "10:00 PM",
                minutes: 1320,
            },
        ];

        const next = timings.find((a) => a.minutes > currentMinutes);

        return next || {
            name: "Mangala Aarti",
            time: "Tomorrow 4:00 AM",
        };
    };

    const nextAarti = getNextAarti();

    return (
        <section className="mt-10 px-6">
            <div className="rounded-[32px] border border-orange-100 bg-white shadow-lg p-6">
                {/* ================= Row 1 ================= */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    {/* Left */}
                    <div id="aarti" className="col-span-1 xl:col-span-3">
                        <div className="relative flex xl:min-h-[460px] flex-col rounded-3xl border border-orange-100 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            {/* Heading */}
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                                        <CalendarDays size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-orange-700">Aarti Timings</h3>
                                        <p className="text-xs text-slate-500">Daily Schedule</p>
                                    </div>
                                </div>
                                <Bell size={18} className="text-orange-600" />
                            </div>

                            {/* List */}
                            <div className="flex-1 divide-y divide-orange-100">
                                {aartiTimings.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between py-4 transition-all duration-300 hover:bg-orange-50 px-2 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-full bg-orange-100 p-1.8 text-orange-600">
                                                <Flame size={16} />
                                            </div>
                                            <span className="font-medium text-slate-700">{item.name}</span>
                                        </div>
                                        <span className="rounded-full bg-orange-100 px-2 py-0 text-xm font-semibold text-orange-700">
                                            {item.time}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Button */}
                            <div className="mt-4 rounded-2xl bg-orange-50 p-4">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[13px] font-semibold uppercase tracking-widest text-orange-500">
                                            Temple Status
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                            <span className="text-sm font-medium text-slate-700">Temple Open</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-orange-200 pt-3">
                                        <p className="text-[13px] font-semibold uppercase tracking-widest text-orange-500">
                                            Next Aarti
                                        </p>
                                        <h4 className="mt-1 font-bold text-orange-700">{nextAarti.name}</h4>
                                        <p className="text-sm text-slate-500">{nextAarti.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Video */}
                    <div id="live-darshan" className="col-span-6">
                        <div
                            onClick={() => setOpenLive(true)}
                            className="group cursor-pointer overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl shadow-orange-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <div className="relative overflow-hidden">
                                {/* Image */}
                                <img
                                    src={featuredVideo}
                                    alt="Featured Video"
                                    className="h-[260px] sm:h-[340px] lg:h-[420px] xl:h-[465px] w-full object-cover transition duration-700 group-hover:scale-110"
                                />

                                {/* HD Badge */}
                                <div className="absolute right-5 top-5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                                    HD
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                                    <div className="rounded-full bg-white/20 p-5 backdrop-blur-md">
                                        <PlayCircle size={64} className="text-white" />
                                    </div>
                                </div>

                                {/* Bottom Overlay */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5">
                                    <h3 className="text-2xl font-bold text-white">Live Darshan</h3>
                                    <p className="mt-1 text-sm text-gray-200">
                                        Watch live from Shri Ram Janmabhoomi Temple
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-white">
                                            <Eye size={16} />
                                            <span>2.3K Watching</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                            <Radio size={10} className="scale-110 text-white shadow-lg" />
                                            LIVE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div id="mantras" className="col-span-1 xl:col-span-3">
                        <div className="flex xl:min-h-[430px] flex-col rounded-3xl border border-purple-200 bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-200/50">
                            {/* Heading */}
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                                        <Music4 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-purple-700">Mantras & Bhajans</h3>
                                        <p className="text-xs text-slate-500">Listen & Chant</p>
                                    </div>
                                </div>
                                <Heart size={18} className="text-purple-600" />
                            </div>

                            {/* List */}
                            <div className="flex-1 divide-y divide-purple-100">
                                {mantraData.map((item) => (
                                    <div
                                        key={item.title}
                                        className={`flex cursor-pointer items-center justify-between rounded-xl px-2 py-3 transition-all duration-300 ${
                                            playing === item.title
                                                ? "bg-purple-50 ring-2 ring-purple-300 shadow-lg shadow-purple-300/40"
                                                : "hover:bg-purple-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    playAudio(item);
                                                }}
                                                className={`rounded-full bg-purple-100 p-2 text-purple-600 transition-all duration-300 hover:scale-110 ${
                                                    playing === item.title
                                                        ? "animate-pulse bg-purple-600 text-white shadow-lg shadow-purple-400/40"
                                                        : ""
                                                }`}
                                            >
                                                {playing === item.title ? (
                                                    <div className="flex gap-[2px]">
                                                        <div className="h-3 w-[2px] rounded bg-white"></div>
                                                        <div className="h-3 w-[2px] rounded bg-white"></div>
                                                    </div>
                                                ) : (
                                                    <Play size={14} />
                                                )}
                                            </button>
                                            <div>
                                                <h4
                                                    className={`transition-all duration-300 ${
                                                        playing === item.title
                                                            ? "font-semibold text-purple-700"
                                                            : "font-medium text-slate-700"
                                                    }`}
                                                >
                                                    {item.title}
                                                </h4>
                                                <div>
                                                    <p
                                                        className={`text-xs transition-colors ${
                                                            playing === item.title
                                                                ? "text-purple-600"
                                                                : "text-slate-500"
                                                        }`}
                                                    >
                                                        {item.subtitle}
                                                    </p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(item.title);
                                            }}
                                            className="relative cursor-pointer"
                                        >
                                            <Heart
                                                size={18}
                                                className={`transition-all duration-300 ${
                                                    favorites.includes(item.title)
                                                        ? "fill-red-500 text-red-500 scale-110"
                                                        : "text-slate-400 hover:text-red-500"
                                                }`}
                                            />
                                            {favorites.includes(item.title) && (
                                                <Sparkles
                                                    size={12}
                                                    className="absolute -right-1 -top-1 animate-pulse text-yellow-400"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 h-[100px] rounded-2xl border border-purple-100 bg-purple-50 p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-purple-500">
                                    {playing ? "NOW PLAYING" : "PLAYER SECTION"}
                                </p>
                                <div className="mt-2 flex h-[60px] flex-col justify-center">
                                    {playing ? (
                                        <div className="mt-1">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        if (isPaused) {
                                                            audioRef.current.play();
                                                            setIsPaused(false);
                                                        } else {
                                                            audioRef.current.pause();
                                                            setIsPaused(true);
                                                        }
                                                    }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white shadow-md transition hover:scale-110"
                                                >
                                                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                                                </button>
                                                <div className="flex-1">
                                                    <div className="mb-1 flex justify-between text-[10px] text-slate-500">
                                                        <span>{formatTime(currentTime)}</span>
                                                        <span>{formatTime(duration)}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max={duration}
                                                        value={currentTime}
                                                        onChange={handleSeek}
                                                        className="h-1 w-full cursor-pointer accent-purple-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                                            <h4 className="font-semibold text-slate-600">No Mantra Playing</h4>
                                            <p className="text-xs font-bold text-slate-400">Select any mantra above.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= Row 2 ================= */}
                <div id="stories" className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <StoriesCard onRead={setSelectedStory} />
                    <NearbyPlacesCard />
                    <SpiritualTipsCard />
                    <LiveDarshanModal isOpen={openLive} onClose={() => setOpenLive(false)} />
                    <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
                </div>

                <DailyWisdomFooter />
            </div>
        </section>
    );
}