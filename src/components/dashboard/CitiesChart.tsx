"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function CitiesChart({
  data,
}: {
  data: { city: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" barSize={20}>
        <XAxis
          type="number"
          tick={{ fill: "#666", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          dataKey="city"
          type="category"
          tick={{ fill: "#999", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111",
            border: "1px solid #2a2a2a",
            borderRadius: 6,
          }}
          itemStyle={{ color: "#C9A84C" }}
        />
        <Bar
          dataKey="count"
          fill="#C9A84C"
          radius={[0, 4, 4, 0]}
          opacity={0.7}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
