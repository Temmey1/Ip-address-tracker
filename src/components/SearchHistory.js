export default function SearchHistory({ searchHistory, handleTrackIp }) {
    if (searchHistory.length === 0) return null;
  
    return (
      <div className="mt-4">
        <h3 className="text-md font-medium text-gray-700 mb-2 dark:text-gray-300">Recent Searches</h3>
        <div className="flex flex-wrap gap-2">
          {searchHistory.map((pastIp) => (
            <button
              key={pastIp}
              onClick={() => handleTrackIp(pastIp)}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm border border-gray-300"
            >
              {pastIp}
            </button>
          ))}
        </div>
      </div>
    );
  }
  