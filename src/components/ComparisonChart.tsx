import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ComparisonChartProps {
  data: { x: number; y: number }[];
  xLabel: string;
  yLabel: string;
}

export default function ComparisonChart({
  data,
  xLabel,
  yLabel,
}: ComparisonChartProps) {
  return (
    <div
      className="rounded-xl border p-6 mb-10"
      style={{ borderColor: "rgba(62,207,142,0.18)" }}
    >
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(62,207,142,0.12)" vertical={false} />
          <XAxis
            type="number"
            dataKey="x"
            stroke="#5E7A6F"
            tick={{ fill: "#5E7A6F", fontSize: 12 }}
            axisLine={{ stroke: "rgba(62,207,142,0.18)" }}
            tickLine={false}
            label={{
              value: xLabel,
              position: "insideBottomRight",
              offset: -5,
              fill: "#5E7A6F",
              fontSize: 12,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            stroke="#5E7A6F"
            tick={{ fill: "#5E7A6F", fontSize: 12 }}
            axisLine={{ stroke: "rgba(62,207,142,0.18)" }}
            tickLine={false}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              fill: "#5E7A6F",
              fontSize: 12,
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#0A0F0D",
              border: "1px solid rgba(62,207,142,0.3)",
              borderRadius: "8px",
              color: "#DCEAE3",
            }}
            labelStyle={{ color: "#5E7A6F" }}
            formatter={(value) => (value == null ? "No data" : value)}
          />
          <Scatter name="Meetings" data={data} fill="#3ECF8E" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
