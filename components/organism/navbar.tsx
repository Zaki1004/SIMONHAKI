import Image from "next/image";
import React from "react";

const NavigationBar = () => {
  return (
    <>
      <div className=" relative bg-[#00425A] flex items-center gap-10 w-full h-[115px] overflow-hidden">
        {/* <div className="absolute inset-0 bg-white bg-no-repeat flex justify-end bg-right bg-contain opacity-10 pointer-events-none z-0" /> */}

        <Image
          src="/logo/Minimalist SIMON HAKI Logo Design 1.svg"
          alt="Logo Simon Haki"
          width={245}
          height={53}
          priority
          className="rounded-lg p-5 relative z-10"
        ></Image>

        <div className="flex justify-between w-full p-5 relative z-10">
          <div>
            <h1 className="text-white text-2xl">DASHBOARD</h1>
            <h2 className="text-white text-xs">Menu / Dashboard</h2>
          </div>
          <div className="font-semibold text-white text-md">Selamat Datang</div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
