"use client";

import Buttons from "@/components/atoms/buttons";
import Inputs from "@/components/atoms/inputs";
import Labels from "@/components/atoms/labels";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogFooterHapus,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontalIcon,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type DataMerksProps = {
  etiketMerk: string;
  status: string;
  noPermohonan: string;
  noPendaftaran: string;
  linkPDKI: string;
  tglBerakhirPerlindungan: string;
  sisaWaktuPerlindungan: string;
  statusPembaruan: string;
  pemegangHAKI: string;
};

interface Status {
  value: string;
  label: string;
}

const MerkPage = () => {
  const [showEditMerk, setShowEditMerk] = useState(false);
  const [showUpdatePembaruan, setShowUpdatePembaruan] = useState(false);
  const [showHapusMerk, setShowHapusMerk] = useState(false);
  const [showTambahData, setShowTambahData] = useState(false);
  const [showKadaluarsa, setShowKadaluarsa] = useState(false);
  const [value, setValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [progress, setProgress] = useState(13);
  const [page, setPage] = useState<number>(1);

  // nomor permohonan
  // nomor pendaftaran
  // status (-, tdk diperpanjga, dalam promises, selesai)
  // tgl berakhir perlindungan
  // link pdki
  // nama pemegang haki
  // e-tiket merk

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  const validateAndSetFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // hanya satu file

    setLoadingUpload(true); // ⬅️ loading dulu

    // Optional: kasih delay dikit agar loading terlihat
    await new Promise((r) => setTimeout(r, 300));
    // 1. Validasi ukuran maksimal 200KB
    const MAX_SIZE = 200 * 1024;
    if (file.size > MAX_SIZE) {
      setLoadingUpload(false);
      alert("Ukuran Maksimal Hanya 200KB");
      return;
    }

    // 2. Validasi format PNG
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "png") {
      setLoadingUpload(false);
      alert("Format file tidak valid, Hanya PNG");
      return;
    }

    // 3. Simulasi upload (API belum ada)
    // setLoadingUpload(true);

    setTimeout(() => {
      setSelectedFile(file); // hanya dipanggil sekali
      setLoadingUpload(false);
    }, 2000);

    console.log("Selected file:", file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetFiles(event.target.files);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const router = useRouter();

  const handleHapusImages = () => {
    setSelectedFile(null);
  };

  const handleCancel = () => {
    router.push("/merk");
  };

  const handleSimpan = () => {
    router.push("/merk");
  };
  const handleCancelHapusMerk = () => {
    router.push("/merk");
  };

  const handleSimpanHapusMerk = () => {
    router.push("/merk");
  };

  const statusUpdatePembaruan: Status[] = [
    {
      value: "setujui",
      label: "Setujui",
    },
    { value: "ditunda", label: "Ditunda" },
    { value: "ditolak", label: "Ditolak" },
  ];

  const DataTableMerk: DataMerksProps[] = [
    {
      etiketMerk: "PNM",
      status: "Didaftar",
      noPermohonan: "J002014046345",
      noPendaftaran: "IDM000550171",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: "2024-10-10",
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Habis",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
    {
      etiketMerk: "PNM",
      status: "Selesai",
      noPermohonan: "J0020140463456789",
      noPendaftaran: "IDM000550171",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: "2025-11-18",
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Tersedia",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
    {
      etiketMerk: "PNM",
      status: "Selesai",
      noPermohonan: "J00201404634567777",
      noPendaftaran: "IDM000550171",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: "2025-07-18",
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Habis",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
    {
      etiketMerk: "PNM",
      status: "Selesai",
      noPermohonan: "J00201404634568889",
      noPendaftaran: "IDM000550171",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: "2025-11-18",
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Tersedia",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
  ];

  const isKadaluarsa = (tanggal: string) => {
    if (!tanggal) return false;

    const [year, month, day] = tanggal.split("-").map(Number);

    const expDate = new Date(year, month - 1, day); // LOCAL date, aman
    const today = new Date();

    // Set jam jadi 00:00 biar fair comparison
    today.setHours(0, 0, 0, 0);

    return expDate < today;
  };

  const formatToYMD = (tanggal: string) => {
    if (!tanggal) return "-";
    const [y, m, d] = tanggal.split("-");
    return `${y}-${m}-${d}`;
  };

  return (
    <>
      <div className="bg-white p-4 flex justify-between">
        <div className="font-semibold">Tabel Merk</div>
        <div className=" flex items-center">
          <Inputs
            type="search"
            placeholder="Cari Merk"
            className="w-[287px] rounded-md px-2 py-1"
            onChange={(e) => setValue(e.target.value)}
          />

          <Buttons
            variant="default"
            size="sm"
            className="ml-2 "
            onClick={() => setShowTambahData(true)}
          >
            <Plus /> Tambah Data
          </Buttons>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2 mx-4 mt-4">
        <Checkbox
          id="terms"
          onCheckedChange={(showKadaluarsa) =>
            setShowKadaluarsa(!!showKadaluarsa)
          }
          className="h-5 w-5"
        />
        <Labels
          htmlFor="toggle"
          text="Tampilkan Status Kadaluarsa"
          className="text-sm font-semibold leading-none"
        />
      </div>
      <Table className="bg-white m-5 rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead>Etiket Merk</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>No Permohonan</TableHead>
            <TableHead>No Pendaftaran</TableHead>
            <TableHead>Link PDKI</TableHead>
            <TableHead>Tgl Berakhir Perlindungan</TableHead>
            <TableHead>Sisa Waktu Perlindungan</TableHead>
            <TableHead>Status Pembaruan</TableHead>
            <TableHead>Pemegang HAKI</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {DataTableMerk.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                Tidak ada data
              </TableCell>
            </TableRow>
          ) : (
            DataTableMerk.map((item) => {
              const {
                etiketMerk,
                status,
                noPermohonan,
                noPendaftaran,
                linkPDKI,
                tglBerakhirPerlindungan,
                sisaWaktuPerlindungan,
                statusPembaruan,
                pemegangHAKI,
              } = item;

              return (
                <TableRow
                  key={noPermohonan}
                  className={
                    showKadaluarsa && isKadaluarsa(tglBerakhirPerlindungan)
                      ? "border-l-4 border-l-[#DC3545] bg-[#DC35451A]"
                      : ""
                  }
                >
                  <TableCell>{etiketMerk}</TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell>{noPermohonan}</TableCell>
                  <TableCell>{noPendaftaran}</TableCell>
                  <TableCell>
                    <Link
                      href="/indikasi-geografis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      aria-label={`Buka PDKI untuk ${etiketMerk}`}
                    >
                      {linkPDKI}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {tglBerakhirPerlindungan
                      ? formatToYMD(tglBerakhirPerlindungan)
                      : "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {sisaWaktuPerlindungan}
                  </TableCell>
                  <TableCell>{statusPembaruan}</TableCell>
                  <TableCell>{pemegangHAKI}</TableCell>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          aria-label="Open menu"
                          size="icon-sm"
                        >
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40" align="end">
                        <DropdownMenuGroup className="space-y-1">
                          <DropdownMenuItem
                            onSelect={() => setShowEditMerk(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold flex items-center justify-start">
                              <Image
                                src="/icon/edit-svgrepo-com 2.svg"
                                alt="Logo Upload"
                                width={16}
                                height={16}
                                className="mr-2 text-[888888]"
                              />
                              Edit Merk
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setShowUpdatePembaruan(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold flex items-center justify-start">
                              <Image
                                src="/icon/edit-svgrepo-com 2.svg"
                                alt="Logo Upload"
                                width={16}
                                height={16}
                                className="mr-2 hover:text-[#00425A]"
                              />
                              Update Pembaruan
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setShowHapusMerk(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold flex items-center justify-start">
                              <Image
                                src="/icon/Trash.svg"
                                alt="Logo Upload"
                                width={16}
                                height={16}
                                className="mr-2 hover:text-[#00425A]"
                              />
                              Hapus Merk
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dialog Edit Merk */}
                    <Dialog open={showEditMerk} onOpenChange={setShowEditMerk}>
                      <DialogContent className="sm:max-w-[788px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white px-4 py-8 rounded-t-lg">
                            Edit Merk
                          </DialogTitle>
                          <div className="grid grid-cols-2 grid-rows-4 gap-4 p-4">
                            <div>
                              <Labels
                                text="E-Tiket Merk"
                                htmlFor="etiket-merk"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="121"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                            <div>
                              <Labels
                                text="Status"
                                htmlFor="status"
                                className="block text-sm font-medium mb-1"
                              />
                              <Select
                                onValueChange={(val) => setValue(val)}
                                value={value}
                              >
                                <SelectTrigger className="w-full border rounded px-2 py-1">
                                  <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusUpdatePembaruan.map((update) => (
                                    <SelectItem
                                      key={update.value}
                                      value={update.value}
                                    >
                                      {update.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Labels
                                text="Nomor Permohonan"
                                htmlFor="no-permohonan"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="J002014046345"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                            <div>
                              <Labels
                                text="Nomor Pendaftaran"
                                htmlFor="no-pendaftaran"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="IDM000550171"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                            <div>
                              <Labels
                                text="Tanggal Berakhir Perlindungan"
                                htmlFor="tanggal-berakhir-perlindungan"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="2069-03-27"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                            <div>
                              <Labels
                                text="Link PDKI"
                                htmlFor="link-pdki"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="https://simonhaki.pnm.co.id"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                            <div>
                              <Labels
                                text="Nama Pemegang HAKI"
                                htmlFor="nama-pemegang-haki"
                                className="block text-sm font-medium mb-1"
                              />
                              <Select
                                onValueChange={(val) => setValue(val)}
                                value={value}
                              >
                                <SelectTrigger className="w-full border rounded px-2 py-1">
                                  <SelectValue placeholder="Nama pemegang HAKI" />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusUpdatePembaruan.map((update) => (
                                    <SelectItem
                                      key={update.value}
                                      value={update.value}
                                    >
                                      {update.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogHeader>
                        <DialogFooter className="p-4">
                          <DialogClose asChild>
                            <div className="space-x-2">
                              <Buttons
                                variant="defaultSecond"
                                size="sm"
                                onClick={() => handleCancel()}
                                className="w-20 p-2"
                              >
                                Batal
                              </Buttons>
                              <Buttons
                                variant="default"
                                size="sm"
                                onClick={() => handleSimpan()}
                                className="w-40 text-white p-2"
                              >
                                Simpan Perubahan
                              </Buttons>
                            </div>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Dialog Update Pembaruan */}
                    <Dialog
                      open={showUpdatePembaruan}
                      onOpenChange={setShowUpdatePembaruan}
                    >
                      <DialogContent className="sm:max-w-[664px] h-[282px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
                            Update Pembaruan
                          </DialogTitle>
                          <div className="m-4">
                            <Labels
                              text="Status"
                              htmlFor="status"
                              className="block text-sm font-medium mb-1"
                            />
                            <Select
                              onValueChange={(val) => setValue(val)}
                              value={value}
                            >
                              <SelectTrigger className="w-full border rounded px-2 py-1">
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                              <SelectContent>
                                {statusUpdatePembaruan.map((update) => (
                                  <SelectItem
                                    key={update.value}
                                    value={update.value}
                                  >
                                    {update.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </DialogHeader>
                        <DialogFooter className="p-4">
                          <DialogClose asChild>
                            <div className="space-x-2">
                              <Buttons
                                variant="defaultSecond"
                                size="sm"
                                onClick={() => handleCancel()}
                                className="w-20 p-2"
                              >
                                Batal
                              </Buttons>
                              <Buttons
                                variant="default"
                                size="sm"
                                onClick={() => handleSimpan()}
                                className="w-40 text-white p-2"
                              >
                                Simpan Perubahan
                              </Buttons>
                            </div>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={showHapusMerk}
                      onOpenChange={setShowHapusMerk}
                    >
                      <DialogContent className="sm:max-w-[372px] h-[331px] p-0 rounded-2xl">
                        <VisuallyHidden>
                          <DialogTitle>Konfirmasi Hapus Merk</DialogTitle>
                        </VisuallyHidden>
                        <div className="px-8 pt-8">
                          <div className="flex justify-center items-center mt-6">
                            <Image
                              src="/icon/Group 303.svg"
                              alt="Icon Delete"
                              width={70}
                              height={70}
                            />
                          </div>

                          <div className="m-4 text-center space-y-2">
                            <p className="font-semibold text-lg text-black">
                              Hapus Merk
                            </p>
                            <p className="tex-xs text-[#888888]">
                              Apakah Kamu yakin ingin menghapus merk ini?
                            </p>
                          </div>
                        </div>

                        <DialogFooterHapus className="p-4">
                          <DialogClose asChild>
                            <div className="space-x-2">
                              <Buttons
                                variant="defaultSecond"
                                size="sm"
                                onClick={() => handleCancelHapusMerk()}
                                className="w-20 p-2 bg-[#DC35451A]  text-[#DC3545] px-4 py-2 mr-3 rounded-md cursor-pointer"
                              >
                                Batal
                              </Buttons>
                              <Buttons
                                variant="default"
                                size="sm"
                                onClick={() => handleSimpanHapusMerk()}
                                className="w-40 p-2 bg-[#DC3545] text-white px-4 py-2 rounded-md cursor-pointer "
                              >
                                <Trash2 />
                                Hapus Data
                              </Buttons>
                            </div>
                          </DialogClose>
                        </DialogFooterHapus>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between w-full py-3 px-8">
        {/* LEFT: Show entries */}
        <div className="flex items-center gap-2">
          <span>Show</span>

          <select className="border rounded-md px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>

          <span>entries</span>
        </div>

        {/* RIGHT: Pagination */}
        <div className="flex items-center gap-2">
          {/* Prev Button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-md disabled:opacity-40 hover:bg-gray-200 transition"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Number (Blue) */}
          <div className="px-3 py-1 rounded-md bg-[#0A6E94] text-white font-medium">
            {page}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={DataTableMerk.length < 10}
            className="p-2 rounded-md disabled:opacity-40 hover:bg-gray-200 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <Dialog open={showTambahData} onOpenChange={setShowTambahData}>
        <DialogContent className="sm:max-w-[788px] p-0">
          <DialogHeader>
            <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
              Tambah Data Merk
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div>
                <Labels
                  text="Nomor Permohonan"
                  htmlFor="no-permohonan"
                  className="block text-sm font-medium mb-1"
                />
                <Inputs
                  type="text"
                  placeholder="Masukan nomor permohonan"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  text="Nomor Pendaftaran"
                  htmlFor="no-pendaftaran"
                  className="block text-sm font-medium mb-1"
                />
                <Inputs
                  type="text"
                  placeholder="Masukan nomor pendaftaran"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  text="Status"
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                />
                <Select onValueChange={(val) => setValue(val)} value={value}>
                  <SelectTrigger className="w-full border rounded px-2 py-1">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusUpdatePembaruan.map((update) => (
                      <SelectItem key={update.value} value={update.value}>
                        {update.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Labels
                  text="Tanggal Berakhir Perlindungan"
                  htmlFor="tanggal-berakhir-perlindungan"
                  className="block text-sm font-medium mb-1"
                />
                <Inputs
                  type="text"
                  placeholder="Masukan tanggal berakhir perlindungan"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  text="Link PDKI"
                  htmlFor="link-pdki"
                  className="block text-sm font-medium mb-1"
                />
                <Inputs
                  type="text"
                  placeholder="Masukan link PDKI"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  text="Nama Pemegang HAKI"
                  htmlFor="nama-pemegang-haki"
                  className="block text-sm font-medium mb-1"
                />
                <Inputs
                  type="text"
                  placeholder="Pilih nama pemegang HAKI"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div className="w-[748px]">
                <Labels
                  text="E-Tiket Merk"
                  htmlFor="etiket-merk"
                  className="block text-sm font-medium mb-1"
                />

                <div
                  className={`flex flex-col items-center justify-items-stretch border rounded-xl p-5 mb-2 transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    validateAndSetFiles(e.dataTransfer.files);
                  }}
                >
                  {/* --- ICON UPLOAD DI BAGIAN ATAS --- */}
                  <div>
                    {!selectedFile && (
                      <div className="w-full my-4 flex items-center justify-center">
                        <Image
                          src="/icon/png 1.svg"
                          alt="Logo Upload"
                          width={50}
                          height={50}
                          className="flex items-center justify-center"
                        />
                      </div>
                    )}
                  </div>

                  {/* --- SAAT UPLOAD BERLANGSUNG --- */}
                  <div className="w-full">
                    {loadingUpload ? (
                      <div className="w-full flex flex-col items-center gap-2">
                        <Progress
                          value={progress}
                          className="w-[60%] h-2 rounded-full bg-gray-200 [&>div]:bg-green-500 [&>div]:transition-all [&>div]:duration-300"
                        />
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          {progress}%
                        </p>
                      </div>
                    ) : selectedFile ? (
                      <>
                        {/* --- SAAT UPLOAD SELESAI --- */}
                        <div className="flex items-center justify-between w-full gap-4">
                          {/* ICON */}
                          <div className="flex items-center gap-4">
                            <Image
                              src="/icon/png 1.svg"
                              alt="Logo Upload"
                              width={50}
                              height={50}
                            />

                            {/* NAMA FILE + SIZE */}
                            <div>
                              <p className="font-medium">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>

                          {/* HAPUS */}
                          <div>
                            <div className="flex items-center">
                              <Image
                                src="/icon/edit-svgrepo-com 2.svg"
                                alt="Logo Upload"
                                width={16}
                                height={16}
                                // onClick={handleHapusImages}
                                className="text-[#888888]"
                              />
                              <Image
                                src="/icon/Trash.svg"
                                alt="Logo Upload"
                                width={16}
                                height={16}
                                onClick={handleHapusImages}
                                className="cursor-pointer text-[#888888]"
                              />
                            </div>

                            <p className="text-sm text-gray-600 font-medium mt-1">
                              {progress}%
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* --- DEFAULT STATE (BELUM UPLOAD) --- */}
                        <div className="flex flex-col justify-center text-center">
                          <p className="text-gray-600">
                            <a
                              id="browse_file"
                              onClick={handleBrowseClick}
                              className="text-blue-600 underline cursor-pointer mr-1"
                            >
                              Click to Upload File
                            </a>
                            or drag and drop here
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            Max File Size: 200KB (.png)
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* --- INPUT FILE TERSEMBUNYI --- */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="p-4">
            <DialogClose asChild>
              <div className="space-x-2">
                <Buttons
                  variant="defaultSecond"
                  size="sm"
                  onClick={() => handleCancel()}
                  className="w-20 p-2"
                >
                  Batal
                </Buttons>
                <Buttons
                  variant="default"
                  size="sm"
                  onClick={() => handleSimpan()}
                  className="w-40 text-white p-2"
                >
                  Simpan Perubahan
                </Buttons>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MerkPage;
