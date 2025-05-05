import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map({ lat, lon }) {
  if (!lat || !lon) {
    return (
      <div className="w-full mt-4 p-4 bg-white border border-yellow-300 rounded-lg text-center text-yellow-700 shadow-md">
        ⚠️ Location data not available. Enter a valid IP to view the map.
      </div>
    );
  }

  return (
    <div className="w-full mt-6 rounded-xl overflow-hidden border-2 border-indigo-300 shadow-xl">
      <div className="bg-indigo-600 dark:bg-gray-800 text-white text-sm font-semibold px-4 py-2">
        🌍 Location on Map
      </div>
      <div className="h-[300px] sm:h-[400px]">
        <MapContainer
          key={`${lat}-${lon}`} // 🧠 force re-render when coords change
          center={[lat, lon]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          animate={true}
          easeLinearity={0.35}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[lat, lon]}>
            <Popup className="text-sm font-medium">
              📍 IP Location <br />
              <span className="text-xs">Lat: {lat}, Lon: {lon}</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
