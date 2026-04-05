import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./card.css";

export default function MultiChart({ title, data }) {
  return (
    <div className="bg-white/20 p-4 shadow-lg rounded-2xl mb-4 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#020617]">
      <h2 className="text-white font-semibold mb-2">{title}</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#ccc" />
          <Tooltip />

          {/* ✅ Correct keys */}
          <Line dataKey="pm10" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line dataKey="pm2_5" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}