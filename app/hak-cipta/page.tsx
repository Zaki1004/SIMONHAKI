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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  ChevronDownIcon,
  MoreHorizontalIcon,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";

type DataHakCiptaProps = {
  judulHakCipta: string;
  namaPencipta: string;
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

const HakCiptaPage = () => {
  const [showEditHakCipta, setShowEditHakCipta] = useState(false);
  const [showUpdatePembaruan, setShowUpdatePembaruan] = useState(false);
  const [showHapusHakCipta, setShowHapusHakCipta] = useState(false);
  const [showTambahData, setShowTambahData] = useState(false);
  const [showKadaluarsa, setShowKadaluarsa] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  const [judulHakCipta, setJudulHakCipta] = useState("");
  const [namaPencipta, setNamaPencipta] = useState("");
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
    judulHakCipta &&
    namaPencipta &&
    tglBerakhirPerlindungan &&
    linkPdki &&
    namaPemegangHaki;

  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const handleSimpanTambahData = () => {
    const newData: DataHakCiptaProps = {
      judulHakCipta: "Aplikasi SISTERMONIKA",
      namaPencipta: namaPencipta,
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

    setDataTableHakCipta((prev) => [...prev, newData]);

    setShowTambahData(false);

    setJudulHakCipta("");
    setNamaPencipta("");
    setLinkPdki("");
    setTglBerakhirPerlindungan(undefined);
    setNamaPemegangHaki("");
  };

  const handleCancelTambahData = () => {
    router.push("/hak-cipta");
  };

  const handleCancelEditHakCipta = () => {
    router.push("/hak-cipta");
  };

  const handleSimpanEditHakCipta = () => {
    setShowEditHakCipta(false);
    router.push("/hak-cipta");
  };

  const handleCancelUpdateHakCipta = () => {
    router.push("/hak-cipta");
  };

  const handleSimpanUpdateHakCipta = () => {
    setShowUpdatePembaruan(false);
    router.push("/hak-cipta");
  };

  const handleCancelHapusHakCipta = () => {
    router.push("/hak-cipta");
  };

  const handleSimpanHapusHakCipta = () => {
    setShowHapusHakCipta(false);
    router.push("/hak-cipta");
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

  const [dataTableHakCipta, setDataTableHakCipta] = useState<
    DataHakCiptaProps[]
  >([
    {
      judulHakCipta:
        "Aplikasi SISTEMONIKA (Sistem Terintegrasi Monitoring Notaris & Perkara)",
      namaPencipta: "PT. Permodalan Nasional Madani",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: parseDMY("10-12-2027"),
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Habis",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
    {
      judulHakCipta: "SOTK Digi",
      namaPencipta: "PT. Permodalan Nasional Madani",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: parseDMY("10-12-2022"),
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Habis",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
    {
      judulHakCipta:
        "SIMONHAKI (Sistem Informasi Manajemen Hak Kekayaan Intelektual)",
      namaPencipta: "PT. Permodalan Nasional Madani",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: parseDMY("10-12-2027"),
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Habis",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
  ]);

  // Hitung total halaman
  const totalPages = Math.ceil(dataTableHakCipta.length / perPage);
  // Disable prev/next
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;
  // Data yang ditampilkan sesuai halaman
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return dataTableHakCipta.slice(start, start + perPage);
  }, [currentPage, perPage, dataTableHakCipta]);

  return (
    <>
      <div className="bg-white p-4 flex justify-between">
        <div className="font-semibold">Tabel Hak Cipta</div>
        <div>
          <Inputs
            type="search"
            value={search}
            placeholder="Cari Hak Cipta"
            className="rounded-md w-[287px] px-2"
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
            <TableHead>Judul Hak Cipta</TableHead>
            <TableHead>Nama Pencipta</TableHead>
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
                judulHakCipta,
                namaPencipta,
                linkPDKI,
                tglBerakhirPerlindungan,
                sisaWaktuPerlindungan,
                statusPembaruan,
                pemegangHAKI,
              } = item;

              return (
                <TableRow
                  key={judulHakCipta}
                  className={
                    showKadaluarsa && isKadaluarsa(tglBerakhirPerlindungan)
                      ? "border-l-4 border-l-[#DC3545] bg-[#DC35451A]"
                      : ""
                  }
                >
                  <TableCell>{judulHakCipta}</TableCell>
                  <TableCell>{namaPencipta}</TableCell>
                  <TableCell>
                    <Link
                      href="/indikasi-geografis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      aria-label={`Buka PDKI untuk ${judulHakCipta}`}
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
                            onSelect={() => setShowEditHakCipta(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold">
                              Edit Hak Cipta
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
                            onSelect={() => setShowHapusHakCipta(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div
                              className="text-sm hover:font-semibold"
                              onClick={() => setShowHapusHakCipta(true)}
                            >
                              Hapus Hak Cipta
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dialog Edit Hak Cipta */}
                    <Dialog
                      open={showEditHakCipta}
                      onOpenChange={setShowEditHakCipta}
                    >
                      <DialogContent className="sm:max-w-[788px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
                            Edit Hak Cipta
                          </DialogTitle>
                          <div className="grid grid-cols-2 grid-rows-3 gap-4 p-4">
                            <div className="col-span-2">
                              <Labels
                                htmlFor="judul-hak-cipta"
                                className="block text-sm font-medium mb-1"
                              >
                                Judul Hak Cipta{" "}
                                <span className="text-red-500 ml-1">*</span>
                              </Labels>
                              <Inputs
                                type="text"
                                placeholder="Aplikasi SISTEMONIKA (Sistem Terintegrasi Monitoring Notaris & Perkara)"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>

                            <div>
                              <Labels
                                htmlFor="nama-pencipta"
                                className="block text-sm font-medium mb-1"
                              >
                                Nama Pencipta{" "}
                                <span className="text-red-500 ml-1">*</span>
                              </Labels>
                              <Inputs
                                type="text"
                                placeholder="PT. Permodalan Nasional Madani"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                            <div>
                              <Labels
                                htmlFor="tanggal-berakhir-perlindungan"
                                className="block text-sm font-medium mb-1"
                              >
                                Tanggal Berakhir Perlindungan{" "}
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
                                Link PDKI{" "}
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
                                Nama Pemegang HAKI{" "}
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
                        <DialogFooter className="p-4">
                          <DialogClose asChild>
                            <Buttons
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelEditHakCipta()}
                              className="w-20 p-2"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            variant="default"
                            size="sm"
                            onClick={() => handleSimpanEditHakCipta()}
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
                              Status
                              <span className="text-red-500 ml-1">*</span>
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
                              onClick={() => handleCancelUpdateHakCipta()}
                              className="w-20 p-2"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            variant="default"
                            size="sm"
                            onClick={() => handleSimpanUpdateHakCipta()}
                            className="w-40 ml-2 p-2"
                          >
                            Simpan Perubahan
                          </Buttons>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Dialog Hapus HakCipta */}
                    <Dialog
                      open={showHapusHakCipta}
                      onOpenChange={setShowHapusHakCipta}
                    >
                      <DialogContent className="sm:max-w-[372px] h-[331px] p-0 rounded-2xl">
                        <VisuallyHidden>
                          <DialogTitle>Konfirmasi Hapus Hak Cipta</DialogTitle>
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
                              Hapus Hak Cipta
                            </p>
                            <p className="tex-xs text-[#888888]">
                              Apakah Kamu yakin ingin menghapus Hak Cipta ini?
                            </p>
                          </div>
                        </div>

                        <DialogFooterHapus className="p-4">
                          <DialogClose asChild>
                            <Buttons
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelHapusHakCipta()}
                              className="w-20 p-2 bg-[#DC35451A]  text-[#DC3545] px-4 py-2 mr-3 rounded-md cursor-pointer"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            variant="default"
                            size="sm"
                            onClick={() => handleSimpanHapusHakCipta()}
                            className="w-40 p-2 bg-[#DC3545] ml-2 px-4 py-2 rounded-md cursor-pointer "
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
              Tambah Hak Cipta
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="col-span-2">
                <Labels
                  htmlFor="judul-hak-cipta"
                  className="block text-sm font-medium mb-1"
                >
                  Judul Hak Cipta <span className="text-red-500 ml-1">*</span>
                </Labels>
                <Inputs
                  type="text"
                  placeholder="Masukan judul hak cipta"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setJudulHakCipta(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  htmlFor="nama-pencipta"
                  className="block text-sm font-medium mb-1"
                >
                  Nama Pencipta <span className="text-red-500 ml-1">*</span>
                </Labels>
                <Inputs
                  type="text"
                  placeholder="Masukan nama pencipta"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setNamaPencipta(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  htmlFor="tanggal-berakhir-perlindungan"
                  className="block text-sm font-medium mb-1"
                >
                  Tanggal Berakhir Perlindungan{" "}
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
                  Link PDKI <span className="text-red-500 ml-1">*</span>
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
                  Nama Pemegang HAKI{" "}
                  <span className="text-red-500 ml-1">*</span>
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

export default HakCiptaPage;
