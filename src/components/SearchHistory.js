import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function SearchHistory({ searchHistory, handleTrackIp, handleDeleteIp }) {
  if (searchHistory.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-md font-medium text-gray-700 mb-2 dark:text-gray-300">
        Recent Searches
      </h3>
      <div className="flex flex-col gap-2">
        {searchHistory.map(({ ip, timestamp }, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm border border-gray-300"
          >
            <button onClick={() => handleTrackIp(ip)} className="text-left w-full flex-1">
              <div className="font-medium">{ip}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {dayjs(timestamp).fromNow()}
              </div>
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
