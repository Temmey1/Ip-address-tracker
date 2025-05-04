import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") === "dark";
    setDarkMode(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 text-lg bg-gray-200 dark:bg-gray-700 rounded-full p-2 hover:scale-110 transition"
      aria-label="Toggle Theme"
    >
      {darkMode ? "🌞" : "🌙"}
    </button>
  );
}
