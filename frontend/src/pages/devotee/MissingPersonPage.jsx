import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Upload, User, Phone, MapPin, Clock3, AlertCircle, CheckCircle2
} from "lucide-react";
import api from "../../services/api";
import { useEffect } from "react";

export default function MissingPersonPage() {
  const [form, setForm] = useState({
    name: "", age: "", gender: "", location: "", time: "", description: "", contact: ""
  });
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(

        (position) => {

            setCoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });

        },

        () => {

            setCoordinates({
                latitude: 0,
                longitude: 0,
            });

        }

    );

  }, []);

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setSending(true);

      // ==============================
      // Upload Missing Person Image
      // ==============================
      let imagePath = null;
      if (image) {
          const formData = new FormData();
          formData.append(
              "image",
              image
          );
          const uploadResponse =
              await api.post(
                  "/upload/image",
                  formData,
                  {
                      headers: {
                          "Content-Type":
                              "multipart/form-data",
                      },
                  }
              );
          imagePath =
              uploadResponse.data.image_path;
      }

      const response = await api.post(
        "/incident/create",
        {
          user_id: user.id,

          type: "MISSING_PERSON",

          category: "Missing Person",

          description: form.description,

          latitude: coordinates
              ? coordinates.latitude.toString()
              : "0",

          longitude: coordinates
              ? coordinates.longitude.toString()
              : "0",

          location_name: form.location,

          missing_person_name: form.name,

          missing_person_age: parseInt(form.age),

          missing_person_gender: form.gender,

          contact_number: form.contact,

          last_seen_time: form.time,

          image_path: imagePath,
        }
      );

      console.log(response.data);
      
      setTrackingId(response.data.incident_id);

      setSubmitted(true);

    } catch (error) {

      console.error(error);

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to submit missing person report.";

      alert(message);

    } finally {

      setSending(false);

    }

  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-10 shadow-xl max-w-lg text-center border border-slate-100">
          <CheckCircle2 size={64} className="mx-auto text-green-600 mb-6" />
          <h2 className="text-3xl font-bold text-slate-900">Case Registered</h2>
          <p className="mt-2 text-slate-600">Your report has been dispatched to temple security and local authorities.</p>
          <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Tracking ID</p>
            <p className="text-3xl font-bold text-orange-800 mt-1">{trackingId}</p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-8 text-orange-800 font-semibold hover:underline">Back to Safety Portal</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Missing Person Assistance</h1>
          <p className="mt-2 text-slate-500">Provide details below to initiate an immediate search protocol.</p>
        </header>

        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4 items-start">
          <AlertCircle className="text-amber-600 shrink-0" size={24} />
          <p className="text-amber-900 font-medium">Please ensure all details are accurate. A photo is highly recommended for faster identification.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input required className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-orange-500" placeholder="e.g. Rahul Sharma" onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
              <input required type="number" className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-orange-500" placeholder="e.g. 12" onChange={e => setForm({...form, age: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Gender
            </label>

            <select
              className="w-full bg-slate-50 rounded-xl p-4"
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value,
                })
              }
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Last Seen Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-slate-400" size={20} />
              <input required className="w-full bg-slate-50 border-none rounded-xl p-4 pl-12" placeholder="e.g. Near Main Temple Entrance" onChange={e => setForm({...form, location: e.target.value})} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Seen Time</label>
              <input required type="datetime-local" className="w-full bg-slate-50 border-none rounded-xl p-4" onChange={e => setForm({...form, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number</label>
              <input required type="tel" className="w-full bg-slate-50 border-none rounded-xl p-4" placeholder="+91 XXX XXX XXXX" onChange={e => setForm({...form, contact: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Physical Description</label>
            <textarea required rows="3" className="w-full bg-slate-50 border-none rounded-xl p-4" placeholder="Describe clothing, height, or distinguishing features..." onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-orange-500 transition-colors">
            <Upload className="mx-auto text-slate-400 mb-2" />
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700" />
          </div>

          <button type="submit"
            disabled={sending}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50"
          >
            {sending
              ? "Submitting..."
              : "Submit Missing Person Report"}
          </button>
        </form>
      </div>
    </div>
  );
}