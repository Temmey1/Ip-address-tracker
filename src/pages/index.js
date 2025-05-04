import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import Header from "@/components/Header";
import IPForm from "@/components/IPForm";
import SearchHistory from "@/components/SearchHistory";
import LocationDetails from "@/components/LocationDetails";

// Dynamically load the map (with SSR disabled)
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [ip, setIp] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const getUserIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
        handleTrackIp(data.ip);
      } catch (err) {
        console.error("Error fetching IP:", err);
      }
    };
    getUserIp();

    const storedHistory = JSON.parse(localStorage.getItem("ipHistory")) || [];
    setSearchHistory(storedHistory);
  }, []);

  const handleTrackIp = async (ipAddress) => {
    setLoading(true);
    try {
      const res = await fetch(`http://ip-api.com/json/${ipAddress}`);
      const data = await res.json();
      if (data.status === "fail") throw new Error(data.message);

      setLocationData(data);
      setError(null);

      // Update search history if new IP
      if (ipAddress && !searchHistory.includes(ipAddress)) {
        const updatedHistory = [ipAddress, ...searchHistory.slice(0, 4)];
        setSearchHistory(updatedHistory);
        localStorage.setItem("ipHistory", JSON.stringify(updatedHistory));
      }
    } catch (err) {
      setLocationData(null);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>IP Address Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 p-4 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
          <Header />

          <IPForm ip={ip} setIp={setIp} handleTrackIp={handleTrackIp} />

          <SearchHistory
            searchHistory={searchHistory}
            handleTrackIp={handleTrackIp}
          />

          {loading && (
            <p className="text-center text-gray-500">🔍 Fetching location...</p>
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
