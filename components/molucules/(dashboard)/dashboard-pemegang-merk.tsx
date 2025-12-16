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
    "#0A84FF",
    "#00C2A8",
    "#FFC83D",
    "#FF8A3D",
    "#2C3E70",
    "#6B78A6",
    "#EAC6A5",
    "#F4B400",
    "#4CAF50",
    "#9C27B0",
    "#E91E63",
    "#607D8B",
  ];

  // const fetchData = async () => {
  //   try {
  //     const res = await Api.get<{ data: PemegangMerkApiResponse[] }>(
  //       "dashboard/pemegang-merk"
  //     );
  //     const data = res.data?.data ?? [];

  //     const result: DashboardPemegangHakiProps[] = data.map((item, index) => ({
  //       key: item.namaPemegangHaki,
  //       label: item.namaPemegangHaki,
  //       value: item.total,
  //       fill: COLORS[index % COLORS.length],
  //     }));

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
  const dummyPemegangMerk = [
    { namaPemegangHaki: "PT Maju Jaya", total: 48 },
    { namaPemegangHaki: "CV Sukses Mandiri", total: 36 },
    { namaPemegangHaki: "PT Teknologi Nusantara", total: 29 },
    { namaPemegangHaki: "UMKM Sejahtera", total: 21 },
    { namaPemegangHaki: "PT Inovasi Global", total: 17 },
    { namaPemegangHaki: "PT Kreatif Abadi", total: 14 },
  ];

  useEffect(() => {
    // simulasi hasil API dashboard/pemegang-merk
    const result: DashboardPemegangHakiProps[] = dummyPemegangMerk.map(
      (item, index) => ({
        key: item.namaPemegangHaki,
        label: item.namaPemegangHaki,
        value: item.total,
        fill: COLORS[index % COLORS.length],
      })
    );

    setChartData(result);
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
                  innerRadius="60%"
                  outerRadius="95%"
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
                              y={(viewBox.cy || 0) + 24}
                              dy="-3.2em"
                              className="fill-muted-foreground"
                            >
                              Total
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
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
          <div className="grid grid-cols-2 gap-x-20 gap-y-4 min-w-[500px] mr-10 items-center">
            {chartData.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 text-lg">
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
