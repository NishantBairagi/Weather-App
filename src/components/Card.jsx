export default function Card({ title, value, icon }) {
    return (
      <div className=" backdrop-blur-xl p-5  border  shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#020617]">
  
        {/* Glow effect */}
        <div className="relative inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition" />
  
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-sm text-gray-400">{title}</p>
          {icon && <span className="text-xl text-white">{icon}</span>}
        </div>
  
        <h2 className="relative z-10 text-2xl font-bold mt-3">
          {value}
        </h2>
      </div>
    );
  }