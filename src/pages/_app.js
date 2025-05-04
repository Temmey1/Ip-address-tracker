import "leaflet/dist/leaflet.css";
import "@/styles/globals.css"; // You can add global styles if needed
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </>
  );
}
