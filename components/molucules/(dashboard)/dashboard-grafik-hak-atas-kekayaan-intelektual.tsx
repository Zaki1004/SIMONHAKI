"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface dashboardHakiProps {
  merk: number;
  paten: number;
  hakCipta: number;
  geografis: number;
  desainIndustri: number;
}

const HakAtasKekayaanIntelektual = () => {
  const [dashboardHaki, setDashboardHaki] = useState<dashboardHakiProps | null>(
    null
  );

  // const fetchData = async () => {
  //   try {
  //     const response = await Api.get("dashboard/total-haki");
  //     const result = response.data?.data;

  //     setDashboardHaki(result);
  //     console.log("dashboard total haki", result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  /** =====================
   *  DUMMY DATA
   *  ===================== */
  const dummyDashboardHaki: dashboardHakiProps = {
    merk: 120,
    paten: 45,
    hakCipta: 210,
    geografis: 18,
    desainIndustri: 67,
  };

  useEffect(() => {
    // simulasi fetch data
    setDashboardHaki(dummyDashboardHaki);
  }, []);

  // const chartData = dashboardHaki
  //   ? [
  //       { title: "Merk", value: dashboardHaki.merk },
  //       { title: "Paten", value: dashboardHaki.paten },
  //       { title: "Hak Cipta", value: dashboardHaki.hakCipta },
  //       { title: "Geografis", value: dashboardHaki.geografis },
  //       { title: "Desain Industri", value: dashboardHaki.desainIndustri },
  //     ]
  //   : [];

  // const maxValue = dashboardHaki
  //   ? Math.max(
  //       dashboardHaki.merk,
  //       dashboardHaki.paten,
  //       dashboardHaki.hakCipta,
  //       dashboardHaki.geografis,
  //       dashboardHaki.desainIndustri
  //     )
  //   : 20;

  // const yAxisMax = Math.ceil(maxValue / 10) * 10 + 10;

  const chartData = dashboardHaki
    ? [
        { title: "Merk", value: dashboardHaki.merk },
        { title: "Paten", value: dashboardHaki.paten },
        { title: "Hak Cipta", value: dashboardHaki.hakCipta },
        { title: "Geografis", value: dashboardHaki.geografis },
        { title: "Desain Industri", value: dashboardHaki.desainIndustri },
      ]
    : [];

  const maxValue = dashboardHaki
    ? Math.max(
        dashboardHaki.merk,
        dashboardHaki.paten,
        dashboardHaki.hakCipta,
        dashboardHaki.geografis,
        dashboardHaki.desainIndustri
      )
    : 20;

  const yAxisMax = Math.ceil(maxValue / 10) * 10 + 10;

  const chartConfig = {
    desktop: {
      label: "Total",
      color: "#75BF44",
    },
  } satisfies ChartConfig;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-xl">
            Grafik Hak Atas Kekayaan Intelektual
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <ChartContainer config={chartConfig} className="h-[372px] w-full">
            <BarChart
              data={chartData}
              barCategoryGap={0}
              barGap={0}
              margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#98e067ff" />
                  <stop offset="100%" stopColor="#6cb03fff" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="title" tickLine={true} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tickMargin={0}
                domain={[0, yAxisMax]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="value"
                fill="url(#greenGradient)"
                barSize={50}
                radius={[14, 14, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default HakAtasKekayaanIntelektual;
