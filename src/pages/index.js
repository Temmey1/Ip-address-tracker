import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Header from "@/components/Header";
import IPForm from "@/components/ipForm";
import SearchHistory from "@/components/SearchHistory";
import LocationDetails from "@/components/LocationDetails";
import toast from "react-hot-toast";
import ThemeToggle from "@/components/ThemeToggle";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// Dynamic import for Map
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [ip, setIp] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [activeIp, setActiveIp] = useState("");

  useEffect(() => {
    setMounted(true);
    const storedRaw = JSON.parse(localStorage.getItem("ipHistory")) || [];

    // Normalize old string-based history
    const normalized = storedRaw.map((item) =>
      typeof item === "string"
        ? { ip: item, timestamp: new Date().toISOString() }
        : item
    );
    setSearchHistory(normalized);
    localStorage.setItem("ipHistory", JSON.stringify(normalized));

    const getUserIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
        handleTrackIp(data.ip, normalized);
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
      setActiveIp(ipAddress);
      const currentHistory = historyOverride || searchHistory;

      // move IP to top with updated timestamp
      const newEntry = {
        ip: ipAddress,
        timestamp: new Date().toISOString(),
        countryCode: data.countryCode,
      };

      // Remove reoccurrence of the IP
      const filteredHistory = currentHistory.filter(
        (entry) => entry.ip !== ipAddress
      );

      // Add to top and keep only latest 5
      const updatedHistory = [newEntry, ...filteredHistory.slice(0, 4)];
      setSearchHistory(updatedHistory);
      localStorage.setItem("ipHistory", JSON.stringify(updatedHistory));

      toast.success("Location data retrieved!");
    } catch (err) {
      setLocationData(null);
      setError(err.message);
      toast.error(`❌ ${err.message}`);
    }
    setLoading(false);
  };

  const handleDeleteIp = (ipToDelete) => {
    const updated = searchHistory.filter((entry) => entry.ip !== ipToDelete);
    setSearchHistory(updated);
    localStorage.setItem("ipHistory", JSON.stringify(updated));
    toast.success("Deleted from history.");
  };

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
            handleDeleteIp={handleDeleteIp}
            activeIp={activeIp}
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
            <Map
              key={`${locationData.lat}-${locationData.lon}`} // forces remount when coords change
              lat={locationData.lat}
              lon={locationData.lon}
            />
          )}
        </div>
      </div>
    </>
  );
}
