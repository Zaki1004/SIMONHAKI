"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Api from "@/services/api";
import React, { useEffect, useState } from "react";
import { Label, Pie, PieChart } from "recharts";

interface DashboardPemegangHakiProps {
  key: string;
  label: string;
  value: number;
  fill: string;
}

interface PemegangMerkApiResponse {
  namaPemegangHaki: string;
  total: number;
}

const DashboardPemegangMerk = () => {
  const [chartData, setChartData] = useState<DashboardPemegangHakiProps[]>([]);

  const chartConfig = React.useMemo<ChartConfig>(() => {
    const config: ChartConfig = {
      value: { label: "Total" },
    };

    chartData.forEach((item) => {
      config[item.key] = {
        label: item.label,
        color: item.fill,
      };
    });

    return config;
  }, [chartData]);

  const COLORS = [
    "#2563EB",
    "#16A34A",
    "#F59E0B",
    "#DC2626",
    "#7C3AED",
    "#0D9488",
    "#DB2777",
    "#4B5563",
    "#84CC16",
    "#0284C7",
    "#9333EA",
    "#EA580C",
    "#22C55E",
    "#E11D48",
    "#64748B",
    "#F97316",
    "#06B6D4",
    "#A855F7",
    "#10B981",
    "#EF4444",
  ];

  const fetchData = async () => {
    try {
      const res = await Api.get<{ data: PemegangMerkApiResponse[] }>(
        "dashboard/pemegang-merk"
      );
      const data = res.data?.data ?? [];

      const result: DashboardPemegangHakiProps[] = data.map((item, index) => ({
        key: item.namaPemegangHaki,
        label: item.namaPemegangHaki,
        value: item.total,
        fill: COLORS[index % COLORS.length],
      }));

      setChartData(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);
  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="font-bold text-xl">Pemegang Merk</CardTitle>
        </CardHeader>
        <div className="flex flex-row items-center gap-2 px-6">
          <CardContent className="flex justify-start flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius="65%"
                  outerRadius="105%"
                  strokeWidth={10}
                  cornerRadius={10}
                  paddingAngle={3}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalVisitors.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <div className="grid grid-cols-2 gap-x-20 gap-y-4 min-w-[500px] mr-10 items-center">
            {chartData.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 text-lg">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground truncate max-w-[100px]">
                    {item.label}
                  </span>
                </div>
                <span className="font-medium text-lg">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardPemegangMerk;
