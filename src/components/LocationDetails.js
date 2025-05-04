export default function LocationDetails({ locationData }) {
  if (!locationData) return null;

  return (
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
  );
}
