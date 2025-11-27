import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "../ui/button";
import Labels from "../atoms/labels";
import { Input } from "../ui/input";
import { BellDot, XIcon } from "lucide-react";

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

        <div className="flex justify-between w-full p-5 relative z-10 items-center">
          <div>
            <h1 className="text-white text-2xl">DASHBOARD</h1>
            <h2 className="text-white text-xs">Menu / Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="font-semibold text-white text-md">
                Selamat Datang
              </div>
              <div className="font-semibold place-self-end text-white text-md">
                Officer
              </div>
            </div>
            <div className="bg-[#A4A9AE40] w-[47px] h-[47px] text-white rounded-full p-2 flex justify-center items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <BellDot />
                </DialogTrigger>
                <DialogContent className="fixed top-[25%] left-[84%] md:left-[77%] w-[565px] h-auto p-2">
                  <DialogHeader>
                    <div className="flex justify-between m-4">
                      <DialogTitle className="p-0 h-auto">
                        Notifikasi
                      </DialogTitle>
                      <DialogClose asChild>
                        <XIcon className="text-gray-700 p-0" />
                      </DialogClose>
                    </div>
                    <div className="border-b border-gray-300 w-full"></div>
                  </DialogHeader>
                  <div className="rounded-md hover:bg-gray-200 text-wrap m-1 p-2 flex flex-row gap-2">
                    <div>
                      <Image
                        src="/icon/Question.svg"
                        alt="Logo Isi Notifikasi"
                        width={150}
                        height={150}
                      ></Image>
                    </div>
                    <div className="text-md font-bold"></div>
                    <p>
                      <span className="font-bold text-md">
                        [REMINDER] H-1 Bulan Sisa Waktu Perlindungan Habis
                      </span>
                      <span className="block text-sm font-normal">
                        Dear tim legal, sisa waktu perlindungan untuk{" "}
                        <span className="text-lime-500">Merk </span>dengan Nomor
                        Permohonan{" "}
                        <span className="text-lime-500">ID1251262161 </span>akan
                        segera habis. Jika Anda telah melakukan pengajuan
                        pembaruan masa berlaku di luar sistem, silakan update
                        status pembaruan atau bisa abaikan notifikasi ini jika
                        telah mengupdate status pembaruan.
                      </span>
                    </p>
                  </div>
                  <DialogFooter className="sm:justify-start"></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
