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

interface DashboardJangkaWaktuProps {
  key: string;
  label: string;
  value: number;
  fill: string;
}

const DashboardJangkaWaktu = () => {
  const [chartData, setChartData] = useState<DashboardJangkaWaktuProps[]>([]);

  // const fetchData = async () => {
  //   try {
  //     const res = await Api.get("dashboard/jangka-waktu");
  //     const data = res.data?.data;

  //     const result: DashboardJangkaWaktuProps[] = [
  //       {
  //         key: "range5yTo10y",
  //         label: "5 - 10 Tahun",
  //         value: data.range5yTo10y,
  //         fill: "var(--chart-3)",
  //       },
  //       {
  //         key: "range1yTo5y",
  //         label: "1 - 5 Tahun",
  //         value: data.range1yTo5y,
  //         fill: "var(--chart-2)",
  //       },
  //       {
  //         key: "range6mTo1y",
  //         label: "6 Bulan - 1 Tahun",
  //         value: data.range6mTo1y,
  //         fill: "var(--chart-1)",
  //       },
  //     ];

  //     setChartData(result);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  /** =====================
   *  DUMMY DATA
   *  ===================== */
  const dummyChartData: DashboardJangkaWaktuProps[] = [
    {
      key: "range5yTo10y",
      label: "5 - 10 Tahun",
      value: 86,
      fill: "var(--chart-3)",
    },
    {
      key: "range1yTo5y",
      label: "1 - 5 Tahun",
      value: 142,
      fill: "var(--chart-2)",
    },
    {
      key: "range6mTo1y",
      label: "6 Bulan - 1 Tahun",
      value: 57,
      fill: "var(--chart-1)",
    },
  ];

  useEffect(() => {
    // simulasi fetch data
    setChartData(dummyChartData);
  }, []);

  const chartConfig = {
    value: {
      label: "Total",
    },
    range5yTo10y: {
      label: "5 - 10 Tahun",
      color: "var(--chart-3)",
    },
    range1yTo5y: {
      label: "1 - 5 Tahun",
      color: "var(--chart-2)",
    },
    range6mTo1y: {
      label: "6 Bulan < 1 Tahun",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce(
      (acc: number, curr: DashboardJangkaWaktuProps) => acc + curr.value,
      0
    );
  }, [chartData]);

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="font-bold text-xl">Jangka Waktu</CardTitle>
        </CardHeader>
        <div className="flex items-center gap-6 px-6 justify-start">
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
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
                        const cx = viewBox.cx;
                        const cy = viewBox.cy;

                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={cx}
                              y={(cy || 0) + 24}
                              dy="-3.2em"
                              className="fill-muted-foreground"
                            >
                              Total
                            </tspan>
                            <tspan
                              x={cx}
                              y={cy}
                              dy="0.4em"
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalVisitors.toLocaleString()}
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
          <div className="flex flex-col gap-4 min-w-[250px]">
            {chartData.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between text-sm mr-4"
              >
                <div className="flex items-center gap-2">
                  <div className="relative h-5 w-5 shrink-0">
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: item.fill,
                        opacity: 0.25,
                      }}
                    />
                    <span
                      className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        backgroundColor: item.fill,
                      }}
                    />
                  </div>

                  <span className="text-muted-foreground text-lg">
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

export default DashboardJangkaWaktu;
