"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const HakAtasKekayaanIntelektual = () => {
  const chartData = [
    { title: "Merk", value: 12 },
    { title: "Paten", value: 8 },
    { title: "Hak Cipta", value: 4 },
    { title: "Geografis", value: 13 },
    { title: "Desain Industri", value: 7 },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Grafik Hak Atas Kekayaan Intelektual</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[372px] max-w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              barCategoryGap="42%"
              barGap={40}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="title"
                tickLine={true}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                allowDecimals={false}
                domain={[0, 20]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="value"
                fill="var(--color-desktop)"
                barSize={25}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      {/* <button className="relative overflow-hidden bg-blue-600 text-white px-6 py-2 rounded-md group">
  <span className="relative z-10">Hover Saya</span>
  <span className="absolute inset-0 bg-blue-800 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
</button> */}
    </>
  );
};

export default HakAtasKekayaanIntelektual;
