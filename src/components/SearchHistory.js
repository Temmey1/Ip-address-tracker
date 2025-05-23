import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// 🔧 Utility to get emoji flag from country code
function getFlagEmoji(countryCode) {
  if (!countryCode) return "🏳️"; // fallback to white flag
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map(char => 127397 + char.charCodeAt())
  );
}

export default function SearchHistory({ searchHistory, handleTrackIp, handleDeleteIp, activeIp }) {
  if (searchHistory.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-md font-medium text-gray-700 mb-2 dark:text-gray-300">
        Recent Searches
      </h3>
      <div className="flex flex-col gap-2">
        {searchHistory.map(({ ip, timestamp, countryCode }, index) => (
          <div
            key={index}
            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm border transition-all duration-200
              ${ip === activeIp
                ? "bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-white font-semibold border-blue-300"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300"}
            `}
          >
            <button
              onClick={() => handleTrackIp(ip)}
              className="text-left w-full flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2"
            >
              <span className="font-medium">
                {getFlagEmoji(countryCode)} {ip}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 sm:ml-auto">
                {dayjs(timestamp).fromNow()}
              </span>
            </button>
            <button
              onClick={() => handleDeleteIp(ip)}
              className="ml-3 text-red-500 hover:text-red-700 text-xs"
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
