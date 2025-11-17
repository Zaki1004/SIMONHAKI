"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <>
      <aside className="relative h-full">
        <div className="absoulute left-0 w-[245px] flex-shrink-0 bg-[#00425A] h-full text-xs text-white ">
          <div className="flex flex-col gap-2 py-4 px-6">
            <div className="text-md">Menu</div>
            <div
              className={`text-md ${
                pathname === "/dashboard"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <Link href="/dashboard">Dashboard</Link>
            </div>
            <div
              className={`text-md ${
                pathname === "/merk"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <Link href="/merk">Merk</Link>
            </div>
            <div
              className={`text-md ${
                pathname === "/paten"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <Link href="/paten">Paten</Link>
            </div>
            <div
              className={`text-md ${
                pathname === "/hak-cipta"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <Link href="/hak-cipta">Hak Cipta</Link>
            </div>
            <div
              className={`text-md ${
                pathname === "/desain-industri"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <Link href="/desain-industri">Desain Industri</Link>
            </div>
            <div
              className={`text-md ${
                pathname === "/indikasi-geografis"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <Link href="/indikasi-geografis">Indikasi Geografis</Link>
            </div>
            <div
              className={`text-md ${
                pathname === "/brand-valuation"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <Link href="/brand-valuation">Brand Valuation</Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
