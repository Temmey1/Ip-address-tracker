export default function IPForm({ ip, setIp, handleTrackIp }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTrackIp(ip);
    }
  };

  return (
    <div className="flex gap-3 flex-col sm:flex-row relative">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Enter IP address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 border-2 border-indigo-400 dark:border-gray-800 dark:bg-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 pr-10"
        />
        {ip && (
          <button
            onClick={() => setIp("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-red-500"
          >
            ×
          </button>
        )}
      </div>
      <button
        onClick={() => handleTrackIp(ip)}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 dark:bg-gray-500 dark:hover:bg-indigo-500 transition-all"
      >
        Track
      </button>
    </div>
  );
}
