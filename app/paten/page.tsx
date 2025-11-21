"use client";

import Buttons from "@/components/atoms/buttons";
import Inputs from "@/components/atoms/inputs";
import Labels from "@/components/atoms/labels";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
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
import { PopoverContent } from "@radix-ui/react-popover";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";

type DataPatenProps = {
  judulPaten: string;
  noPermohonan: string;
  linkPDKI: string;
  tglBerakhirPerlindungan: Date | undefined;
  sisaWaktuPerlindungan: string;
  statusPembaruan: string;
  pemegangHAKI: string;
};

interface UpdateStatusPembaruanProps {
  value: string;
  label: string;
  code: string;
}

interface Nama {
  value: string;
  code: string;
}

const PatenPage = () => {
  const [showEditPaten, setShowEditPaten] = useState(false);
  const [showUpdatePembaruan, setShowUpdatePembaruan] = useState(false);
  const [showHapusPaten, setShowHapusPaten] = useState(false);
  const [showTambahData, setShowTambahData] = useState(false);
  const [showKadaluarsa, setShowKadaluarsa] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  const [judulPaten, setJudulPaten] = useState("");
  const [nomorPermohonan, setNomorPermohonan] = useState("");
  const [tglBerakhirPerlindungan, setTglBerakhirPerlindungan] = useState<
    Date | undefined
  >(undefined);
  const [linkPdki, setLinkPdki] = useState("");
  const [namaPemegangHaki, setNamaPemegangHaki] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const isFormValid =
    judulPaten &&
    nomorPermohonan &&
    tglBerakhirPerlindungan &&
    linkPdki &&
    namaPemegangHaki;

  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const handleSimpanTambahData = () => {
    const newData: DataPatenProps = {
      judulPaten: "SISTERMONIKA",
      noPermohonan: nomorPermohonan || `J${Date.now()}`,
      linkPDKI: linkPdki || "Buka Link",
      tglBerakhirPerlindungan: tglBerakhirPerlindungan,
      sisaWaktuPerlindungan: tglBerakhirPerlindungan
        ? isKadaluarsa(tglBerakhirPerlindungan)
          ? "Sisa Waktu Perlindungan Habis"
          : "Sisa Waktu Perlindungan Tersedia"
        : "-",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: namaPemegangHaki || "",
    };

    setDataTablePaten((prev) => [...prev, newData]);

    setShowTambahData(false);

    setNomorPermohonan("");
    setTglBerakhirPerlindungan(undefined);
    setLinkPdki("");
    setNamaPemegangHaki("");
  };

  const handleCancelTambahData = () => {
    router.push("/paten");
  };

  const handleCancelEditPaten = () => {
    router.push("/paten");
  };

  const handleSimpanEditPaten = () => {
    setShowEditPaten(false);
    router.push("/paten");
  };

  const handleCancelUpdatePaten = () => {
    router.push("/paten");
  };

  const handleSimpanUpdatePaten = () => {
    setShowUpdatePembaruan(false);
    router.push("/paten");
  };

  const handleCancelHapusPaten = () => {
    router.push("/paten");
  };

  const handleSimpanHapusPaten = () => {
    setShowHapusPaten(false);
    router.push("/paten");
  };

  const UpdatestatusPembaruan: UpdateStatusPembaruanProps[] = [
    {
      value: "none",
      label: "-",
      code: "-",
    },
    { value: "tidak-diperpanjgan", label: "Tidak Diperpanjang", code: "TDP" },
    { value: "dalam-proses", label: "Dalam Proses", code: "DPS" },
    { value: "selesai", label: "Selesai", code: "SLS" },
  ];

  const pemegangHaki: Nama[] = [
    { value: "Atiqa Zaviera", code: "AZA" },
    { value: "Zaviera Atiqa", code: "ZAA" },
  ];

  const isKadaluarsa = (tanggal: Date | undefined) => {
    if (!tanggal) return false;
    const expDate = new Date(tanggal);
    expDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expDate < today;
  };

  const parseDMY = (str: string): Date => {
    const [d, m, y] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const formatToDMY = (tanggal: Date | undefined) => {
    if (!tanggal) return "-";
    const day = String(tanggal.getDate()).padStart(2, "0");
    const month = String(tanggal.getMonth() + 1).padStart(2, "0");
    const year = tanggal.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [dataTablePaten, setDataTablePaten] = useState<DataPatenProps[]>([
    {
      judulPaten: "SISTERMONIKA",
      noPermohonan: "J002014046345",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: parseDMY("10-12-2027"),
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Habis",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
    {
      judulPaten: "SIMONHAKI",
      noPermohonan: "J00201404634555",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: parseDMY("10-12-2022"),
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Habis",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
    {
      judulPaten: "SIROP ULAM",
      noPermohonan: "J00201404634567",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: parseDMY("10-12-2029"),
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Habis",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
  ]);

  // Hitung total halaman
  const totalPages = Math.ceil(dataTablePaten.length / perPage);
  // Disable prev/next
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;
  // Data yang ditampilkan sesuai halaman
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return dataTablePaten.slice(start, start + perPage);
  }, [currentPage, perPage, dataTablePaten]);

  return (
    <>
      <div className="bg-white p-4 flex justify-between">
        <div className="font-semibold">Tabel Paten</div>
        <div>
          <Inputs
            type="search"
            placeholder="Cari Paten"
            className="rounded-md w-[287px] px-2"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Buttons
            variant="default"
            size="sm"
            className="ml-2"
            onClick={() => setShowTambahData(true)}
          >
            <Plus />
            Tambah Data
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
        <Labels htmlFor="toggle" className="text-sm font-semibold leading-none">
          Tampilkan Status Kadaluarsa
        </Labels>
      </div>

      <Table className="bg-white m-5 rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead>Judul Paten</TableHead>
            <TableHead>No Permohonan</TableHead>
            <TableHead>Link PDKI</TableHead>
            <TableHead>Tgl Berakhir Perlindungan</TableHead>
            <TableHead>Sisa Waktu Perlindungan</TableHead>
            <TableHead>Status Pembaruan</TableHead>
            <TableHead>Pemegang HAKI</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                Tidak ada data
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((item) => {
              const {
                judulPaten,
                noPermohonan,
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
                  <TableCell>{judulPaten}</TableCell>
                  <TableCell>{noPermohonan}</TableCell>
                  <TableCell>
                    <Link
                      href="/indikasi-geografis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      aria-label={`Buka PDKI untuk ${judulPaten}`}
                    >
                      {linkPDKI}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {tglBerakhirPerlindungan
                      ? formatToDMY(tglBerakhirPerlindungan)
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
                            onSelect={() => setShowEditPaten(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold">
                              Edit Paten
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setShowUpdatePembaruan(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold">
                              Update Pembaruan
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setShowHapusPaten(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div
                              className="text-sm hover:font-semibold"
                              onClick={() => setShowHapusPaten(true)}
                            >
                              Hapus Paten
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dialog Edit Paten */}
                    <Dialog
                      open={showEditPaten}
                      onOpenChange={setShowEditPaten}
                    >
                      <DialogContent className="sm:max-w-[788px] h-[436px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white rounded-t-lg ">
                            Edit Paten
                          </DialogTitle>
                          <div className="grid grid-cols-2 grid-rows-3 gap-4 p-4">
                            <div className="col-span-2">
                              <Labels
                                htmlFor="judul-paten"
                                className="block text-sm font-medium mb-1"
                              >
                                Judul Paten
                                <span className="text-red-500 ml-1">*</span>
                              </Labels>
                              <Inputs
                                type="text"
                                placeholder="Hak Paten atas Aplikasi"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>

                            <div>
                              <Labels
                                htmlFor="no-permohonan"
                                className="block text-sm font-medium mb-1"
                              >
                                Nomor Permohonan
                                <span className="text-red-500 ml-1">*</span>
                              </Labels>
                              <Inputs
                                type="text"
                                placeholder="J002014046345"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                            <div>
                              <Labels
                                htmlFor="tanggal-berakhir-perlindungan"
                                className="block text-sm font-medium mb-1"
                              >
                                Tanggal Berakhir Perlindungan
                                <span className="text-red-500 ml-1">*</span>
                              </Labels>
                              <Popover
                                open={openDatePicker}
                                onOpenChange={setOpenDatePicker}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-between font-normal"
                                  >
                                    {tglBerakhirPerlindungan
                                      ? tglBerakhirPerlindungan.toLocaleDateString()
                                      : "Masukkan tanggal berakhir perlindungan"}
                                    <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={tglBerakhirPerlindungan}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                      setTglBerakhirPerlindungan(date);
                                      setOpenDatePicker(false);
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <Labels
                                htmlFor="link-pdki"
                                className="block text-sm font-medium mb-1"
                              >
                                Link PDKI
                                <span className="text-red-500 ml-1">*</span>
                              </Labels>
                              <Inputs
                                type="text"
                                placeholder="https://simonhaki.pnm.co.id"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                            <div>
                              <Labels
                                htmlFor="nama-pemegang-haki"
                                className="block text-sm font-medium mb-1"
                              >
                                Nama Pemegang HAKI
                                <span className="text-red-500 ml-1">*</span>
                              </Labels>
                              <Inputs
                                type="text"
                                placeholder="Atiqa Zaviera"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                          </div>
                        </DialogHeader>
                        <DialogFooter className="px-4">
                          <DialogClose asChild>
                            <Buttons
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelEditPaten()}
                              className="w-20 p-2"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            variant="default"
                            size="sm"
                            onClick={() => handleSimpanEditPaten()}
                            className="w-40 ml-2 p-2"
                          >
                            Simpan Perubahan
                          </Buttons>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Dialog Update Pembaruan */}
                    <Dialog
                      open={showUpdatePembaruan}
                      onOpenChange={setShowUpdatePembaruan}
                    >
                      <DialogContent className="sm:max-w-[788px] h-[282px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
                            Update Pembaruan
                          </DialogTitle>
                          <div className="m-4">
                            <Labels
                              htmlFor="status"
                              className="block text-sm font-medium mb-1"
                            >
                              Status<span className="text-red-500 ml-1">*</span>
                            </Labels>
                            <Select
                              onValueChange={(val) => setValue(val)}
                              value={value}
                            >
                              <SelectTrigger className="w-full border rounded px-2 py-1">
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                              <SelectContent>
                                {UpdatestatusPembaruan.map((update) => (
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
                            <Buttons
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelUpdatePaten()}
                              className="w-20 p-2"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            variant="default"
                            size="sm"
                            onClick={() => handleSimpanUpdatePaten()}
                            className="w-40 ml-2 p-2"
                          >
                            Simpan Perubahan
                          </Buttons>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Dialog Hapus Paten */}
                    <Dialog
                      open={showHapusPaten}
                      onOpenChange={setShowHapusPaten}
                    >
                      <DialogContent className="sm:max-w-[372px] h-[331px] p-0 rounded-2xl">
                        <VisuallyHidden>
                          <DialogTitle>Konfirmasi Hapus Paten</DialogTitle>
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
                              Hapus Paten
                            </p>
                            <p className="tex-xs text-[#888888]">
                              Apakah Kamu yakin ingin menghapus paten ini?
                            </p>
                          </div>
                        </div>

                        <DialogFooterHapus className="p-4">
                          <DialogClose asChild>
                            <Buttons
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelHapusPaten()}
                              className="w-20 p-2 bg-[#DC35451A]  text-[#DC3545] px-4 py-2 mr-3 rounded-md cursor-pointer"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            variant="default"
                            size="sm"
                            onClick={() => handleSimpanHapusPaten()}
                            className="w-40 p-2 ml-2 bg-[#DC3545] text-white px-4 py-2 rounded-md cursor-pointer "
                          >
                            <Trash2 />
                            Hapus Data
                          </Buttons>
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
      <Dialog open={showTambahData} onOpenChange={setShowTambahData}>
        <DialogContent className="sm:max-w-[788px] p-0">
          <DialogHeader>
            <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
              Tambah Data Paten
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="col-span-2">
                <Labels
                  htmlFor="judul-paten"
                  className="block text-sm font-medium mb-1"
                >
                  Judul Paten<span className="text-red-500 ml-1">*</span>
                </Labels>
                <Inputs
                  type="text"
                  placeholder="Masukan judul paten"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setJudulPaten(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  htmlFor="no-permohonan"
                  className="block text-sm font-medium mb-1"
                >
                  Nomor Permohonan<span className="text-red-500 ml-1">*</span>
                </Labels>
                <Inputs
                  type="text"
                  placeholder="Masukan nomor permohonan"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setNomorPermohonan(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  htmlFor="tanggal-berakhir-perlindungan"
                  className="block text-sm font-medium mb-1"
                >
                  Tanggal Berakhir Perlindungan
                  <span className="text-red-500 ml-1">*</span>
                </Labels>
                <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal"
                    >
                      {tglBerakhirPerlindungan
                        ? tglBerakhirPerlindungan.toLocaleDateString()
                        : "Masukkan tanggal berakhir perlindungan"}
                      <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tglBerakhirPerlindungan}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setTglBerakhirPerlindungan(date);
                        setOpenDatePicker(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Labels
                  htmlFor="link-pdki"
                  className="block text-sm font-medium mb-1"
                >
                  Link PDKI<span className="text-red-500 ml-1">*</span>
                </Labels>
                <Inputs
                  type="text"
                  placeholder="Masukan link PDKI"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setLinkPdki(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  htmlFor="nama-pemegang-haki"
                  className="block text-sm font-medium mb-1"
                >
                  Nama Pemegang HAKI<span className="text-red-500 ml-1">*</span>
                </Labels>
                <Select
                  onValueChange={(val) => setNamaPemegangHaki(val)}
                  value={namaPemegangHaki}
                >
                  <SelectTrigger className="w-full border rounded px-2 py-1">
                    <SelectValue placeholder="Pilih nama pemegang HAKI" />
                  </SelectTrigger>
                  <SelectContent>
                    {pemegangHaki.map((nama) => (
                      <SelectItem key={nama.value} value={nama.value}>
                        {nama.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="p-4">
            <DialogClose asChild>
              <Buttons
                variant="defaultSecond"
                size="sm"
                onClick={() => handleCancelTambahData()}
                className="w-20 p-2"
              >
                Batal
              </Buttons>
            </DialogClose>
            <Buttons
              variant="default"
              size="sm"
              disabled={!isFormValid}
              onClick={() => handleSimpanTambahData()}
              className="w-40 ml-2 p-2"
            >
              Simpan Perubahan
            </Buttons>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DROPDOWN SHOW ENTRIES */}
      <div className="w-full flex justify-between px-8">
        <div className="flex items-center gap-2 px-4 py-3">
          <span>Show</span>

          <select
            className="border rounded-md px-2 py-1 bg-white"
            value={perPage}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              const value = Number(e.target.value);
              setPerPage(value);
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <span>entries</span>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              {/* PREVIOUS */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => !isFirstPage && setCurrentPage((p) => p - 1)}
                  className={
                    isFirstPage ? "pointer-events-none opacity-40" : ""
                  }
                />
              </PaginationItem>

              {/* NOMOR HALAMAN - HANYA TAMPIL HALAMAN SAAT INI */}
              <PaginationItem className="rounded-lg text-white text-sm bg-[#006694] text-center px-3 py-2">
                {currentPage}
              </PaginationItem>

              {/* NEXT */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => !isLastPage && setCurrentPage((p) => p + 1)}
                  className={isLastPage ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default PatenPage;
