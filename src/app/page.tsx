"use client";

import { Bar, BarChart } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import WidgetBot from "@widgetbot/react-embed";
import Head from "next/head";
import MainPie from "@/components/container/MainPie";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function Home() {
  return (
    <main className="w-full min-h-screen relative">
      <div className="hidden !max-w-[500px]">
        <WidgetBot
          server="1156659327147442346"
          className="absolute w-[20%] right-0 bottom-0 min-h-[700px]"
          channel="1156659327147442349"
          height={700}
          // width={"20%"}
        />
      </div>
      <MainPie />
    </main>
  );
}
