import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

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

      // Save to history ONLY after success
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
          <h1 className="text-3xl font-bold text-center text-indigo-700">
            🌍 IP Address Tracker
          </h1>

          <div className="flex gap-3 flex-col sm:flex-row relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter IP address"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTrackIp(ip);
                  }
                }}
                className="w-full p-3 border-2 border-indigo-400 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 pr-10"
              />
              {ip && (
                <button
                  onClick={() => setIp("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={() => handleTrackIp(ip)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            >
              Track
            </button>
          </div>
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((pastIp) => (
                  <button
                    key={pastIp}
                    onClick={() => handleTrackIp(pastIp)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm border border-gray-300"
                  >
                    {pastIp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <p className="text-center text-gray-500">🔍 Fetching location...</p>
          )}

          {error && (
            <p className="text-center text-red-500 font-medium">
              ❌ Error: {error}
            </p>
          )}

          {locationData && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow-md space-y-2">
              <h2 className="text-xl font-semibold text-indigo-700">
                🌐 Your IP Summary
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>IP:</strong> {locationData.query}
                </div>
                <div>
                  <strong>Country:</strong> {locationData.country}{" "}
                  {locationData.countryCode && `(${locationData.countryCode})`}
                </div>
                <div>
                  <strong>City:</strong> {locationData.city}
                </div>
                <div>
                  <strong>Region:</strong> {locationData.regionName}
                </div>
                <div>
                  <strong>ISP:</strong> {locationData.isp}
                </div>
                <div>
                  <strong>Timezone:</strong> {locationData.timezone}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
