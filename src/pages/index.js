import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Header from "@/components/Header";
import IPForm from "@/components/ipForm";
import SearchHistory from "@/components/SearchHistory";
import LocationDetails from "@/components/LocationDetails";
import toast from "react-hot-toast";
import ThemeToggle from "@/components/ThemeToggle";

// Dynamically load the map (SSR disabled)
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [ip, setIp] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [mounted, setMounted] = useState(false); // New: mount check

  useEffect(() => {
    setMounted(true); // Indicates client-side mount
    const storedHistory = JSON.parse(localStorage.getItem("ipHistory")) || [];
    setSearchHistory(storedHistory);

    const getUserIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
        handleTrackIp(data.ip, storedHistory); // Use stored history on mount
      } catch (err) {
        console.error("Error fetching IP:", err);
      }
    };
    getUserIp();
  }, []);

  const handleTrackIp = async (ipAddress, historyOverride = null) => {
    setLoading(true);
    try {
      const res = await fetch(`http://ip-api.com/json/${ipAddress}`);
      const data = await res.json();
      if (data.status === "fail") throw new Error(data.message);

      setLocationData(data);
      setError(null);

      const currentHistory = historyOverride || searchHistory;
      if (ipAddress && !currentHistory.includes(ipAddress)) {
        const updatedHistory = [ipAddress, ...currentHistory.slice(0, 4)];
        setSearchHistory(updatedHistory);
        localStorage.setItem("ipHistory", JSON.stringify(updatedHistory));
      }

      toast.success("Location data retrieved!");
    } catch (err) {
      setLocationData(null);
      setError(err.message);
      toast.error(`❌ ${err.message}`);
    }
    setLoading(false);
  };

  // Prevent SSR mismatch before hydration
  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>IP Address Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 p-4 flex items-center justify-center dark:from-gray-900 dark:to-gray-800">
        <ThemeToggle />
        <div className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 space-y-6">
          <Header />
          <IPForm ip={ip} setIp={setIp} handleTrackIp={handleTrackIp} />
          <SearchHistory
            searchHistory={searchHistory}
            handleTrackIp={handleTrackIp}
          />

          {loading && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              🔍 Fetching location...
            </p>
          )}

          {error && (
            <p className="text-center text-red-500 font-medium">
              ❌ Error: {error}
            </p>
          )}

          <LocationDetails locationData={locationData} />

          {locationData?.lat && locationData?.lon && (
            <Map lat={locationData.lat} lon={locationData.lon} />
          )}
        </div>
      </div>
    </>
  );
}
