"use client";

import React from "react";
import HakAtasKekayaanIntelektual from "../molucules/(dashboard)/dashboard-grafik-hak-atas-kekayaan-intelektual";
import DashboardJangkaWaktu from "../molucules/(dashboard)/dashboard-jangka-waktu";
import DashboardPemegangMerk from "../molucules/(dashboard)/dashboard-pemegang-merk";

const MenuDashboard = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 m-5 font-semibold">
        <div className="col-span-3 rounded-xl p-4 bg-white">
          <HakAtasKekayaanIntelektual />
        </div>
        <div className="rounded-xl bg-white p-4">
          <DashboardJangkaWaktu />
        </div>
        <div className="col-span-2 rounded-xl bg-white p-4">
          <DashboardPemegangMerk />
        </div>
      </div>
    </>
  );
};

export default MenuDashboard;
