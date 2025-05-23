import { useState } from "react";
import dayjs from "dayjs";

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
    <div className="bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-gray-800 rounded-xl p-4 shadow-md space-y-2">
      <h2 className="text-xl font-semibold text-indigo-700 dark:text-gray-300">
        🌐 Your IP Summary
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-800 dark:text-gray-200">
        {locationData.query && (
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
            <strong>IP:</strong> {locationData.query}
            <button
              onClick={handleCopy}
              className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-xs border border-indigo-300 dark:border-indigo-500 px-2 py-0.5 rounded-md"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        {locationData.country && (
          <div>
            <strong>Country:</strong> {locationData.country}
            {locationData.countryCode && ` (${locationData.countryCode})`}
          </div>
        )}

        {locationData.city && (
          <div>
            <strong>City:</strong> {locationData.city}
          </div>
        )}

        {locationData.regionName && (
          <div>
            <strong>Region:</strong> {locationData.regionName}
          </div>
        )}

        {locationData.isp && (
          <div>
            <strong>ISP:</strong> {locationData.isp}
          </div>
        )}

        {/* If timezone is an object */}
        {locationData.timezone && typeof locationData.timezone === "object" && (
          <>
            {locationData.timezone.id && (
              <div>
                <strong>Timezone:</strong> {locationData.timezone.id}
              </div>
            )}
            {locationData.timezone.abbr && (
              <div>
                <strong>Abbreviation:</strong> {locationData.timezone.abbr}
              </div>
            )}
            {locationData.timezone.current_time && (
              <div>
                <strong>Local Time:</strong>{" "}
                {dayjs(locationData.timezone.current_time).format("MMMM D, YYYY - h:mm A")}
              </div>
            )}
          </>
        )}

        {/* If timezone is just a string */}
        {typeof locationData.timezone === "string" && (
          <div>
            <strong>Timezone:</strong> {locationData.timezone}
          </div>
        )}
      </div>
    </div>
  );
}
