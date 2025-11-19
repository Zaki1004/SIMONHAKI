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
            <div className="text-md">Menu</div>
            <div
              className={`text-md ${
                pathname === "/" ? "bg-white text-[#064263]" : "bg-[#00425A]"
              } rounded-md p-2`}
            >
              <Link href="/">Dashboard</Link>
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
          <div className="w-50 h-60 rounded-md bg-[#01314C] mx-4 py-4 absolute bottom-5">
            <div className="z-10 absolute bottom-52 left-17">
              <Image
                src="icon/Question.svg"
                alt="Logo Manual Book"
                width={52}
                height={52}
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
            <p className="text-white text-md font-bold text-wrap px-10 text-center">
              Manual Book SIMON HAKI Bisa Diakses disini !
            </p>
            <div className="flex justify-center text-primary-900">
              <Buttons
                variant="outline"
                size="sm"
                className="text-sm mt-6"
                // onClick={() => setShowTambahData(true)}
              >
                Buku Manual Book
              </Buttons>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
