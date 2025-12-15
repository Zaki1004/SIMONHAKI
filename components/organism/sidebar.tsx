"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Buttons from "../atoms/buttons";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <>
      <aside className="relative h-full">
        <div className="absoulute left-0 w-[245px] flex-shrink-0 bg-[#00425A] h-full text-xs text-white ">
          <div className="flex flex-col gap-2 py-4 px-6">
            <div className="text-base">Menu</div>
            <div
              qa-sidebar="Dashboard"
              className={`text-base ${
                pathname === "/" ? "bg-white text-[#064263]" : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <div className="flex justify-start gap-2">
                <Image
                  src={
                    pathname === "/"
                      ? "icon/element-1 (1).svg"
                      : "icon/element-1.svg"
                  }
                  alt="Logo Sidebar Dashboard"
                  height={20}
                  width={20}
                />
                <Link href="/">Dashboard</Link>
              </div>
            </div>
            <div
              qa-sidebar="Merk"
              className={`text-base ${
                pathname === "/merk"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <div className="flex justify-start gap-2">
                <Image
                  src={
                    pathname === "/merk" ? "icon/Vector.svg" : "icon/tag-2.svg"
                  }
                  alt="Logo Sidebar Dashboard"
                  height={20}
                  width={20}
                />
                <Link href="/merk">Merk</Link>
              </div>
            </div>
            <div
              qa-sidebar="Paten"
              className={`text-base ${
                pathname === "/paten"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <div className="flex justify-start gap-2">
                <Image
                  src={
                    pathname === "/paten"
                      ? "icon/diploma 1.svg"
                      : "icon/diploma (1) 1.svg"
                  }
                  alt="Logo Sidebar Dashboard"
                  height={20}
                  width={20}
                />
                <Link href="/paten">Paten</Link>
              </div>
            </div>
            <div
              qa-sidebar="Hak Cipta"
              className={`text-base ${
                pathname === "/hak-cipta"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <div className="flex justify-start gap-2">
                <Image
                  src={
                    pathname === "/hak-cipta"
                      ? "icon/copyright 1.svg"
                      : "icon/copyright-svgrepo-com 1.svg"
                  }
                  alt="Logo Sidebar Dashboard"
                  height={20}
                  width={20}
                />
                <Link href="/hak-cipta">Hak Cipta</Link>
              </div>
            </div>
            <div
              qa-sidebar="Desain Industri"
              className={`text-base ${
                pathname === "/desain-industri"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <div className="flex justify-start gap-2">
                <Image
                  src={
                    pathname === "/desain-industri"
                      ? "icon/building (1).svg"
                      : "icon/building.svg"
                  }
                  alt="Logo Sidebar Dashboard"
                  height={20}
                  width={20}
                />
                <Link href="/desain-industri">Desain Industri</Link>
              </div>
            </div>
            <div
              qa-sidebar="Indikasi Geografis"
              className={`text-base ${
                pathname === "/indikasi-geografis"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <div className="flex justify-start gap-2">
                <Image
                  src={
                    pathname === "/indikasi-geografis"
                      ? "icon/global (1).svg"
                      : "icon/global.svg"
                  }
                  alt="Logo Sidebar Dashboard"
                  height={20}
                  width={20}
                />
                <Link href="/indikasi-geografis">Indikasi Geografis</Link>
              </div>
            </div>
            <div
              qa-sidebar="Brand Valuation"
              className={`text-base ${
                pathname === "/brand-valuation"
                  ? "bg-white text-[#064263]"
                  : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <div className="flex justify-start gap-2">
                <Image
                  src={
                    pathname === "/brand-valuation"
                      ? "icon/presention-chart (1).svg"
                      : "icon/presention-chart.svg"
                  }
                  alt="Logo Sidebar Dashboard"
                  height={20}
                  width={20}
                />
                <Link href="/brand-valuation">Brand Valuation</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-52 h-60 rounded-md bg-[#01314C] mx-4 py-4 absolute bottom-5">
          <div className="z-10 absolute bottom-48 left-13">
            <Image
              src="icon/Question.svg"
              alt="Logo Manual Book"
              width={90}
              height={90}
            />
          </div>
          <div className="flex justify-center my-6">
            <Image
              src="logo/Minimalist SIMON HAKI Logo Design 1.svg"
              alt="Logo Simon HAKI"
              width={152}
              height={152}
            />
          </div>
          <p className="text-white text-sm font-bold text-wrap px-8 text-center">
            Manual Book SIMON HAKI Bisa Diakses disini !
          </p>
          <div className="flex justify-center text-primary-900">
            <Buttons
              qa-btn="btn-manual-book"
              variant="manualBook"
              size="sm"
              className="text-sm mt-6"
            >
              Buku Manual Book
            </Buttons>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
