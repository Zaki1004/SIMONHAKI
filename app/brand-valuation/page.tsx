"use client";

import Buttons from "@/components/atoms/buttons";
import Inputs from "@/components/atoms/inputs";
import Labels from "@/components/atoms/labels";
import { Button } from "@/components/ui/button";
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
  TableCellAction,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { MoreHorizontalIcon, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";

type DataBrandValuationProps = {
  namaBrand: string;
  brandValuation: string;
  pemegangHAKI: string;
};

interface Nama {
  value: string;
  code: string;
}

const BrandValuationPage = () => {
  const [showEditBrandValuation, setShowEditBrandValuation] = useState(false);
  const [showHapusBrandValuation, setShowHapusBrandValuation] = useState(false);
  const [showTambahData, setShowTambahData] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  const [namaBrand, setNamaBrand] = useState("");
  const [brandValuation, setBrandValuation] = useState("");
  const [namaPemegangHaki, setNamaPemegangHaki] = useState("");
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const isFormValid = namaBrand && brandValuation && namaPemegangHaki;

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleSimpanTambahData = () => {
    const newData: DataBrandValuationProps = {
      namaBrand: namaBrand,
      brandValuation: brandValuation,
      pemegangHAKI: namaPemegangHaki,
    };

    setDataTableBrandValuation((prev) => [...prev, newData]);

    setShowTambahData(false);

    setNamaBrand("");
    setBrandValuation("");
    setNamaPemegangHaki("");
  };

  const handleCancelTambahData = () => {
    router.push("/brand-valuation");
  };

  const handleCancelEditBrandValuation = () => {
    router.push("/brand-valuation");
  };

  const handleSimpanEditBrandValuation = () => {
    setShowEditBrandValuation(false);
    router.push("/brand-valuation");
  };

  const handleCancelHapusBrandValuation = () => {
    router.push("/brand-valuation");
  };

  const handleSimpanHapusBrandValuation = () => {
    setShowHapusBrandValuation(false);
    router.push("/brand-valuation");
  };

  const pemegangHaki: Nama[] = [
    { value: "Atiqa Zaviera", code: "AZA" },
    { value: "Zaviera Atiqa", code: "ZAA" },
  ];

  const [dataTableBrandValuation, setDataTableBrandValuation] = useState<
    DataBrandValuationProps[]
  >([
    {
      namaBrand: "Red-Flower",
      brandValuation: "Bunga",
      pemegangHAKI: "Atiqa Zaviera",
    },
  ]);

  // Hitung total halaman
  const totalPages = Math.ceil(dataTableBrandValuation.length / perPage);
  // Disable prev/next
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;
  // Data yang ditampilkan sesuai halaman
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return dataTableBrandValuation.slice(start, start + perPage);
  }, [currentPage, perPage, dataTableBrandValuation]);

  return (
    <>
      <div className="bg-white p-4 flex justify-between">
        <div className="font-semibold">Tabel Brand Valuation</div>
        <div>
          <Inputs
            type="search"
            value={search}
            placeholder="Cari Brand Evaluation"
            className="rounded-md w-[287px] px-2"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Buttons
            variant="default"
            size="sm"
            className="ml-2"
            onClick={() => setShowTambahData(true)}
          >
            <Plus /> Tambah Data
          </Buttons>
        </div>
      </div>
      <Table className="bg-white m-5 rounded-xl w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Nama Brand</TableHead>
            <TableHead>Brand Valuation</TableHead>
            <TableHead>Pemegang HAKI</TableHead>
            <TableHead className="w-[100px] text-center">Action</TableHead>
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
              const { namaBrand, brandValuation, pemegangHAKI } = item;

              return (
                <TableRow key={namaBrand}>
                  <TableCell>{brandValuation}</TableCell>
                  <TableCell>{pemegangHAKI}</TableCell>
                  <TableCell>{pemegangHAKI}</TableCell>
                  <TableCellAction>
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
                      <DropdownMenuContent className="w-45" align="end">
                        <DropdownMenuGroup className="space-y-1">
                          <DropdownMenuItem
                            onSelect={() => setShowEditBrandValuation(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold">
                              Edit Brand Valuation
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setShowHapusBrandValuation(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div
                              className="text-sm hover:font-semibold"
                              onClick={() => setShowHapusBrandValuation(true)}
                            >
                              Hapus Brand Valuation
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dialog Edit Brand Valuation */}
                    <Dialog
                      open={showEditBrandValuation}
                      onOpenChange={setShowEditBrandValuation}
                    >
                      <DialogContent className="sm:max-w-[788px] h-[350px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
                            Edit Brand Valuation
                          </DialogTitle>
                          <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4">
                            <div className="col-span-2">
                              <Labels
                                htmlFor="nama-brand"
                                className="block text-sm font-medium mb-1"
                              >
                                Nama Brand
                                <span className="text-red-500 ml-2">*</span>
                              </Labels>
                              <Inputs
                                type="text"
                                placeholder="Red-Flower"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>

                            <div>
                              <Labels
                                htmlFor="brand-valuation"
                                className="block text-sm font-medium mb-1"
                              >
                                Brand Valuation
                                <span className="text-red-500 ml-2">*</span>
                              </Labels>
                              <Inputs
                                type="text"
                                placeholder="Bunga"
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
                                <span className="text-red-500 ml-2">*</span>
                              </Labels>
                              <Select
                                onValueChange={(val) =>
                                  setNamaPemegangHaki(val)
                                }
                                value={namaPemegangHaki}
                              >
                                <SelectTrigger className="w-full border rounded px-2 py-1">
                                  <SelectValue placeholder="Pilih nama pemegang HAKI" />
                                </SelectTrigger>
                                <SelectContent>
                                  {pemegangHaki.map((nama) => (
                                    <SelectItem
                                      key={nama.value}
                                      value={nama.value}
                                    >
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
                              onClick={() => handleCancelEditBrandValuation()}
                              className="w-20 p-2"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            variant="default"
                            size="sm"
                            onClick={() => handleSimpanEditBrandValuation()}
                            className="w-40 ml-2 p-2"
                          >
                            Simpan Perubahan
                          </Buttons>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={showHapusBrandValuation}
                      onOpenChange={setShowHapusBrandValuation}
                    >
                      <DialogContent className="sm:max-w-[372px] h-[331px] p-0 rounded-2xl">
                        <VisuallyHidden>
                          <DialogTitle>
                            Konfirmasi Hapus Brand Valuation
                          </DialogTitle>
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
                              Hapus Brand Valuation
                            </p>
                            <p className="tex-xs text-[#888888]">
                              Apakah Kamu yakin ingin menghapus Brand Valuation
                              ini?
                            </p>
                          </div>
                        </div>

                        <DialogFooterHapus className="p-4">
                          <DialogClose asChild>
                            <Buttons
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelHapusBrandValuation()}
                              className="w-20 p-2 bg-[#DC35451A] text-[#DC3545] px-4 py-2 mr-3 rounded-md cursor-pointer"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            variant="default"
                            size="sm"
                            onClick={() => handleSimpanHapusBrandValuation()}
                            className="w-50 p-2 bg-[#DC3545] ml-2 px-4 py-2 rounded-md cursor-pointer "
                          >
                            <Trash2 />
                            Hapus Brand Valuation
                          </Buttons>
                        </DialogFooterHapus>
                      </DialogContent>
                    </Dialog>
                  </TableCellAction>
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
              Tambah Brand Valuation
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="col-span-2">
                <Labels
                  htmlFor="nama-brand"
                  className="block text-sm font-medium mb-1"
                >
                  Nama Brand<span className="text-red-500 ml-2">*</span>
                </Labels>
                <Inputs
                  type="text"
                  placeholder="Masukan nama brand"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setNamaBrand(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  htmlFor="brand-valuation"
                  className="block text-sm font-medium mb-1"
                >
                  Brand Valuation<span className="text-red-500 ml-2">*</span>
                </Labels>
                <Inputs
                  type="text"
                  placeholder="Masukan brand valuation"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setBrandValuation(e.target.value)}
                />
              </div>

              <div>
                <Labels
                  htmlFor="nama-pemegang-haki"
                  className="block text-sm font-medium mb-1"
                >
                  Nama Pemegang HAKI<span className="text-red-500 ml-2">*</span>
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

export default BrandValuationPage;
