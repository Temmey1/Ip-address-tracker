import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [ip, setIp] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);

  // Auto-detect user's IP on initial load
  useEffect(() => {
    const getUserIp = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        setIp(data.ip);
        handleTrackIp(data.ip);  // Automatically track detected IP
      } catch (err) {
        console.error('Error fetching IP:', err);
      }
    };
    getUserIp();
  }, []);

  const handleTrackIp = async (ipAddress) => {
    try {
      const res = await fetch(`http://ip-api.com/json/${ipAddress}`);
      const data = await res.json();
      if (data.status === 'fail') throw new Error(data.message);
      setLocationData(data);
      setError(null);
    } catch (err) {
      setLocationData(null);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head><title>IP Tracker</title></Head>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">IP Address Tracker</h1>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter IP address"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="flex-1 border p-2 rounded-md"
          />
          <button
            onClick={() => handleTrackIp(ip)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Track
          </button>
        </div>
        {error && <p className="text-red-500">Error: {error}</p>}
        {locationData && (
          <div>
            <ul className="mb-4">
              <li><strong>IP:</strong> {locationData.query}</li>
              <li><strong>Country:</strong> {locationData.country}</li>
              <li><strong>City:</strong> {locationData.city}</li>
              <li><strong>ISP:</strong> {locationData.isp}</li>
              <li><strong>Timezone:</strong> {locationData.timezone}</li>
            </ul>
            <Map lat={locationData.lat} lon={locationData.lon} />
          </div>
        )}
      </div>
    </div>
  );
}
