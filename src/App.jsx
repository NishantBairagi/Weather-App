import { useState } from "react";
import CurrentWeather from "./pages/CurrentWeather";
import Historical from "./pages/Historical";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("");

  return (
    <div className="all flex-col justify-between  min-h-screen">

      {/* 🌐 Sidebar */}
      <div className="flex flex-col items-center justify-center border-1 w-full">
        <h1 className="">🌦 Weather</h1>

        <nav className=" ">
          <button
            onClick={() => setPage("current")}
           className="btn"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setPage("historical")}
            className="btn"
          >
            📅 Historical
          </button>
        </nav>
      </div>

      {/* 📱 Main */}
      <div >

        {/* 🔝 Topbar */}


        {/* 📊 Content */}
        <div className="p-4 md:p-6 ">
          {page === "current" ? <CurrentWeather /> : <Historical />}
        </div>
      </div>
    </div>
  );
}