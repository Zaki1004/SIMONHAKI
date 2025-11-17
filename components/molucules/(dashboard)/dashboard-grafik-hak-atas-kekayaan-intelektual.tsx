"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const HakAtasKekayaanIntelektual = () => {
  const chartData = [
    { title: "Merk", desktop: 2 },
    { title: "Paten", desktop: 8 },
    { title: "Hak Cipta", desktop: 4 },
    { title: "Geografis", desktop: 3 },
    { title: "Desain Industri", desktop: 7 },
    { ratio: "2" },
    { ratio: "4" },
    { ratio: "6" },
    { ratio: "8" },
    { ratio: "8" },
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
          <ChartContainer config={chartConfig} className="h-[372px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              barCategoryGap="42%"
              barGap={40}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="title"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                dataKey="ratio"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="desktop"
                fill="var(--color-desktop)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default HakAtasKekayaanIntelektual;
