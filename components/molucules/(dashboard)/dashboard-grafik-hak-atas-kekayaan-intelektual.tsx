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
    </>
  );
};

export default HakAtasKekayaanIntelektual;
