import { useState } from "react";

export default function LocationDetails({ locationData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (locationData?.query) {
      navigator.clipboard.writeText(locationData.query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!locationData) return null;

  return (
    <div className="bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-indigo-600 rounded-xl p-4 shadow-md space-y-2">
      <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">
        🌐 Your IP Summary
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-800 dark:text-gray-200">
        <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
          <strong>IP:</strong> {locationData.query}
          <button
            onClick={handleCopy}
            className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-xs border border-indigo-300 dark:border-indigo-500 px-2 py-0.5 rounded-md"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
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
  );
}
