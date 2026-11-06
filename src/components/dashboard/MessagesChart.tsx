"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function MessagesChart({
  data,
}: {
  data: { ad: string; messages: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={32}>
        <XAxis
          dataKey="ad"
          tick={{ fill: "#666", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#666", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
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
          dataKey="messages"
          fill="#C9A84C"
          radius={[4, 4, 0, 0]}
          opacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
