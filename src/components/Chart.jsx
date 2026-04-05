import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./card.css";
export default function Chart({ title, data, lines }) {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#020617] backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white/10">
      
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>

      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="time" stroke="#ccc" />
              <Tooltip />

              {lines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}