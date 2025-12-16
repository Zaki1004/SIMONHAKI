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
import Api from "@/services/api";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpWideNarrow,
  ChevronDownIcon,
  MoreHorizontalIcon,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

type DataBrandValuationProps = {
  ID: string;
  NamaBrand: string;
  BrandValuation: string;
  IdPemegangHaki: string;
  NamaPemegangHaki: string;
};

interface PemegangHAKIProps {
  nama: string;
  id: string;
}
type SortField = keyof DataBrandValuationProps | null;

const BrandValuationPage = () => {
  const [showEditBrandValuation, setShowEditBrandValuation] = useState(false);
  const [showHapusBrandValuation, setShowHapusBrandValuation] = useState(false);
  const [showDialogBrandValuation, setShowDialogBrandValuation] =
    useState(false);
  const router = useRouter();
  const [namaBrand, setNamaBrand] = useState("");
  const [brandValuation, setBrandValuation] = useState("");
  const [namaPemegangHaki, setNamaPemegangHaki] = useState("");
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedRow, setSelectedRow] =
    useState<DataBrandValuationProps | null>(null);
  const [dataTableBrandValuation, setDataTableBrandValuation] = useState<
    DataBrandValuationProps[]
  >([]);
  const [loadingPemegangHaki, setLoadingPemegangHaki] = useState(false);
  const [selectedPemegangHaki, setSelectedPemegangHaki] =
    useState<PemegangHAKIProps | null>(null);
  const [pemegangHakiList, setPemegangHakiList] = useState<PemegangHAKIProps[]>(
    []
  );

  const [sortConfig, setSortConfig] = useState<{
    key: SortField;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: SortField) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const isFormValid = namaBrand && brandValuation && selectedPemegangHaki;

  const resetForm = () => {
    setSelectedRow(null);
    setNamaBrand("");
    setBrandValuation("");
    setNamaPemegangHaki("");
  };

  const fetchPemegangHaki = async () => {
    setLoadingPemegangHaki(true);
    try {
      const response = await Api.get("/pemegang-haki/getAll");
      const result = response.data?.data;
      setPemegangHakiList(Array.isArray(result) ? result : []);
      console.log("Data yang akan di-set:", result);
    } catch (error) {
      console.error("Error fetching pemegang HAKI:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data pemegang HAKI",
      });
    } finally {
    }
  };

  const fetchDataBrandValuation = async () => {
    try {
      const res = await Api.get(
        `/brand-valuation?search=${encodeURIComponent(
          search
        )}&page=${currentPage}&limit=${perPage}`
      );

      const result = res.data?.data?.data;
      const totalData = res.data?.data?.totalData || 0;
      const totalPage =
        totalData && perPage ? Math.ceil(totalData / perPage) : 1;

      setDataTableBrandValuation(result);
      setTotalData(totalData);
      setTotalPage(totalPage);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data BrandValuation",
      });
    }
  };

  useEffect(() => {
    fetchDataBrandValuation();
    fetchPemegangHaki();
  }, [search, currentPage, perPage]);

  const handleCancelDialogBrandValuation = () => {
    resetForm();
    setShowEditBrandValuation(false);
  };

  const handleSimpanDialogBrandValuation = async () => {
    setShowDialogBrandValuation(false);
    if (!namaBrand || !brandValuation || !selectedPemegangHaki) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Lengkapi semua form terlebih dahulu.",
      });
      return;
    } else {
      setShowDialogBrandValuation(true);
    }

    try {
      setShowDialogBrandValuation(false);
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah data sudah benar?",
        text: `Pastikan semua informasi sudah benar sebelum ${
          selectedRow?.ID ? "mengedit" : "menambahkan"
        } data.`,
        showCancelButton: true,
        confirmButtonText: "Ya, simpan data",
        cancelButtonText: "Batal",
      });

      if (result.isDismissed) {
        setShowDialogBrandValuation(true);
        return;
      }

      if (result.isConfirmed) {
        const body = {
          namaBrand: namaBrand,
          brandValuation: brandValuation,
          namaPemegangHaki: selectedPemegangHaki.nama,
          idPemegangHaki: selectedPemegangHaki.id,
        };

        try {
          if (!selectedRow?.ID) {
            await Api.post("/brand-valuation", body);

            resetForm();
            await fetchDataBrandValuation();

            await Swal.fire({
              icon: "success",
              title: "Berhasil Ditambahkan!",
              text: `Data BrandValuation berhasil ditambahkan.`,
              timer: 1500,
            }).then(() => setShowDialogBrandValuation(false));
          } else {
            await Api.put(`/brand-valuation/${selectedRow.ID}`, body);

            resetForm();
            await fetchDataBrandValuation();

            await Swal.fire({
              icon: "success",
              title: "Berhasil Diubah!",
              text: `Data BrandValuation berhasil diubah`,
              timer: 1500,
            }).then(() => setShowDialogBrandValuation(false));
          }
        } catch (err) {
          await Swal.fire({
            icon: "error",
            title: "Gagal",
            text: `Terjadi kesalahan saat ${
              selectedRow?.ID ? "mengedit" : "menambahkan"
            } data BrandValuation.`,
          });

          setShowDialogBrandValuation(true);
        } finally {
        }
      }
    } catch (error) {
      console.error("Error dalam proses tambah data:", error);

      await Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "Terjadi kesalahan yang tidak terduga.",
        confirmButtonText: "Oke",
      });

      setShowDialogBrandValuation(true);
    }
  };

  const handleEditBrandValuation = (row: DataBrandValuationProps) => {
    setShowDialogBrandValuation(true);
    setSelectedRow(row);
    setNamaBrand(row.NamaBrand);
    setBrandValuation(row.BrandValuation);
    setSelectedPemegangHaki(
      row.NamaPemegangHaki && row.IdPemegangHaki
        ? {
            id: row.IdPemegangHaki,
            nama: row.NamaPemegangHaki,
          }
        : null
    );

    setShowEditBrandValuation(true);
  };

  const handleCancelHapusBrandValuation = () => {
    router.push("/brand-valuation");
  };

  const handleSimpanHapusBrandValuation = async () => {
    setShowHapusBrandValuation(false);

    if (!selectedRow) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih data Brand Valuation yang ingin dihapus terlebih dahulu.",
      }).then(() => {});
      return;
    }
    console.log(!selectedRow);

    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Konfirmasi Hapus",
        text: `Apakah Anda yakin ingin menghapus Brand Valuation dengan nomor permohonan ${selectedRow.NamaBrand}?`,
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#DC3545",
        cancelButtonColor: "#6c757d",
      });

      if (result.isDismissed) {
        setShowHapusBrandValuation(true);
        return;
      }

      if (result.isConfirmed) {
        const response = await Api.delete(`/brand-valuation/${selectedRow.ID}`);

        if (response.data?.responseCode === 200) {
          setDataTableBrandValuation((prevData) =>
            prevData.filter((item) => item.ID !== selectedRow.ID)
          );

          await fetchDataBrandValuation();
          setSelectedRow(null);

          Swal.fire({
            icon: "success",
            title: "Berhasil Dihapus!",
            text: `Data BrandValuation ${selectedRow.NamaBrand} berhasil dihapus dari tabel.`,
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Hapus gagal");
        }
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus data BrandValuation. Silakan coba lagi.",
      });

      setShowHapusBrandValuation(true);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return dataTableBrandValuation;

    return [...dataTableBrandValuation].sort((a, b) => {
      const x = a[sortConfig.key!];
      const y = b[sortConfig.key!];

      // if (sortConfig.key === "status") {
      //   const labelX =
      //     typeof x === "object" && x !== null && "label" in x
      //       ? (x as StatusPendaftaran).statusPendaftaran ?? ""
      //       : typeof x === "string"
      //       ? x
      //       : "";
      //   const labelY =
      //     typeof y === "object" && y !== null && "label" in y
      //       ? (y as StatusPendaftaran).statusPendaftaran ?? ""
      //       : typeof y === "string"
      //       ? y
      //       : "";

      //   return sortConfig.direction === "asc"
      //     ? labelX.localeCompare(labelY)
      //     : labelY.localeCompare(labelX);
      // }
      // handle string
      if (typeof x === "string" && typeof y === "string") {
        return sortConfig.direction === "asc"
          ? x.localeCompare(y)
          : y.localeCompare(x);
      }
      // handle number
      if (typeof x === "number" && typeof y === "number") {
        return sortConfig.direction === "asc" ? x - y : y - x;
      }

      return 0;
    });
  }, [sortConfig, dataTableBrandValuation]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPage || totalPage === 0;

  return (
    <>
      <div className="bg-white p-4 flex justify-between">
        <div className="font-semibold text-xl">Tabel Brand Valuation</div>
        <div>
          <Inputs
            qa-input="input-search"
            type="search"
            value={search}
            placeholder="Cari Brand Evaluation"
            className="rounded-md w-[287px] px-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchDataBrandValuation();
              }
            }}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Buttons
            qa-btn="tambah-data-brand-valuation"
            variant="default"
            size="sm"
            className="ml-2"
            onClick={() => setShowDialogBrandValuation(true)}
          >
            <Plus /> Tambah Data
          </Buttons>
        </div>
      </div>
      <Table className="bg-white m-5 rounded-xl w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Buttons
                qa-btn="sorting-judul-paten"
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("NamaBrand");
                }}
                className="flex items-center"
              >
                Nama Brand
                <span>
                  {sortConfig.key !== "NamaBrand" ? (
                    <ArrowUpDown />
                  ) : sortConfig.direction === "asc" ? (
                    <ArrowUpWideNarrow />
                  ) : (
                    <ArrowDownWideNarrow />
                  )}
                </span>
              </Buttons>
            </TableHead>
            <TableHead>
              <Buttons
                qa-btn="sorting-judul-paten"
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("BrandValuation");
                }}
                className="flex items-center"
              >
                Brand Valuation
                <span>
                  {sortConfig.key !== "BrandValuation" ? (
                    <ArrowUpDown />
                  ) : sortConfig.direction === "asc" ? (
                    <ArrowUpWideNarrow />
                  ) : (
                    <ArrowDownWideNarrow />
                  )}
                </span>
              </Buttons>
            </TableHead>
            <TableHead>
              <Buttons
                qa-btn="sorting-nama-pemegang-haki"
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("NamaPemegangHaki");
                }}
                className="flex items-center"
              >
                Pemegang HAKI
                <span>
                  {sortConfig.key !== "NamaPemegangHaki" ? (
                    <ArrowUpDown />
                  ) : sortConfig.direction === "asc" ? (
                    <ArrowUpWideNarrow />
                  ) : (
                    <ArrowDownWideNarrow />
                  )}
                </span>
              </Buttons>
            </TableHead>
            <TableHead className="w-[100px] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                Tidak ada data
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((item, rowIndex) => {
              const { NamaBrand, BrandValuation, NamaPemegangHaki } = item;

              return (
                <TableRow key={NamaBrand}>
                  <TableCell
                    qa-table={`cell.${rowIndex}.0.table-brand-valuation`}
                  >
                    {NamaBrand}
                  </TableCell>
                  <TableCell
                    qa-table={`cell.${rowIndex}.1.table-brand-valuation`}
                  >
                    {BrandValuation}
                  </TableCell>
                  <TableCell
                    qa-table={`cell.${rowIndex}.2.table-brand-valuation`}
                  >
                    {NamaPemegangHaki}
                  </TableCell>
                  <TableCellAction
                    qa-table={`cell.${rowIndex}.3.table-brand-valuation`}
                  >
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          qa-btn="select-action"
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
                            qa-select-option="edit-brand-valuation"
                            onSelect={() => handleEditBrandValuation(item)}
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
                              Edit Brand Valuation
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            qa-select-option="hapus-brand-valuation"
                            onSelect={() => setShowHapusBrandValuation(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div
                              className="text-sm hover:font-semibold"
                              onClick={() => {
                                setShowHapusBrandValuation(true);
                                setSelectedRow(item);
                              }}
                            >
                              <div className="text-sm hover:font-semibold flex items-center justify-start">
                                <Image
                                  src="/icon/Trash.svg"
                                  alt="Logo Upload"
                                  width={16}
                                  height={16}
                                  className="mr-2 hover:text-[#00425A]"
                                />
                                Hapus Brand Valuation
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

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
                              qa-btn="batal-hapus-brand-valuation"
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelHapusBrandValuation()}
                              className="w-20 p-2 bg-[#DC35451A] text-[#DC3545] px-4 py-2 mr-3 rounded-md cursor-pointer"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            qa-btn="simpan-hapus-brand-valuation"
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
      <Dialog
        open={showDialogBrandValuation}
        onOpenChange={setShowDialogBrandValuation}
      >
        <DialogContent className="sm:max-w-[788px] p-0">
          <DialogHeader>
            <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
              {selectedRow
                ? "Edit Brand Valuation"
                : "Tambah Data Brand Valuation"}
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
                  qa-input="input-nama-brand"
                  type="text"
                  placeholder="Masukan nama brand"
                  className="w-full border rounded px-2 py-1"
                  value={namaBrand}
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
                  qa-input="input-brand-valuation"
                  type="text"
                  placeholder="Masukan brand valuation"
                  className="w-full border rounded px-2 py-1"
                  value={brandValuation}
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
                  qa-select="nama-pemegang-haki"
                  onValueChange={(val) => {
                    const selected = JSON.parse(val);
                    setSelectedPemegangHaki(selected);
                  }}
                  value={
                    selectedPemegangHaki
                      ? JSON.stringify(selectedPemegangHaki)
                      : ""
                  }
                >
                  <SelectTrigger
                    className="w-full border rounded px-2 py-1"
                    qa-select-trigger="select-nama-pemegang-haki"
                  >
                    <SelectValue placeholder="Pilih nama pemegang HAKI" />
                  </SelectTrigger>
                  <SelectContent>
                    {pemegangHakiList && pemegangHakiList.length > 0 ? (
                      pemegangHakiList.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={JSON.stringify(item)}
                          qa-select-option={`select-nama-pemegang-haki-${item.nama}`}
                        >
                          {item.nama}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="p-4">
            <DialogClose asChild>
              <Buttons
                qa-btn="batal-tambah-data-brand-valuation-edit-brand-valuation"
                variant="defaultSecond"
                size="sm"
                onClick={() => handleCancelDialogBrandValuation()}
                className="w-20 p-2"
              >
                Batal
              </Buttons>
            </DialogClose>
            <Buttons
              qa-btn="simpan-tambah-data-brand-valuation-edit-brand-valuation"
              variant="default"
              size="sm"
              disabled={!isFormValid}
              onClick={() => handleSimpanDialogBrandValuation()}
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
            qa-select="per-page"
            className="border rounded-md px-2 py-1 bg-white"
            value={perPage}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              const value = Number(e.target.value);
              setPerPage(value);
              setCurrentPage(1);
            }}
          >
            <option value={10} qa-select-option="10">
              10
            </option>
            <option value={25} qa-select-option="25">
              25
            </option>
            <option value={50} qa-select-option="50">
              50
            </option>
          </select>

          <span>entries</span>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              {/* DOUBLE ARROW LEFT - KE HALAMAN PERTAMA */}
              <PaginationItem>
                <Button
                  qa-btn="first-page"
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={isFirstPage}
                  className={
                    isFirstPage ? "pointer-events-none opacity-40" : ""
                  }
                >
                  <span className="flex">
                    <ChevronDownIcon className="h-4 w-4 rotate-90" />
                    <ChevronDownIcon className="h-4 w-4 rotate-90 -ml-2" />
                  </span>
                </Button>
              </PaginationItem>

              {/* SINGLE ARROW LEFT - PREVIOUS */}
              <PaginationItem>
                <Button
                  qa-btn="prev-table"
                  variant="outline"
                  size="icon"
                  onClick={() => !isFirstPage && setCurrentPage((p) => p - 1)}
                  disabled={isFirstPage}
                  className={
                    isFirstPage ? "pointer-events-none opacity-40" : ""
                  }
                >
                  <ChevronDownIcon className="h-4 w-4 rotate-90" />
                </Button>
              </PaginationItem>

              {/* NOMOR HALAMAN SAAT INI */}
              <PaginationItem className="rounded-lg text-white text-sm bg-[#006694] text-center px-4 py-2 mx-2">
                {currentPage} / {totalPage}
              </PaginationItem>

              {/* SINGLE ARROW RIGHT - NEXT */}
              <PaginationItem>
                <Button
                  qa-btn="next-table"
                  variant="outline"
                  size="icon"
                  onClick={() => !isLastPage && setCurrentPage((p) => p + 1)}
                  disabled={isLastPage}
                  className={isLastPage ? "pointer-events-none opacity-40" : ""}
                >
                  <ChevronDownIcon className="h-4 w-4 -rotate-90" />
                </Button>
              </PaginationItem>

              {/* DOUBLE ARROW RIGHT - KE HALAMAN TERAKHIR */}
              <PaginationItem>
                <Button
                  qa-btn="last-page"
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPage)}
                  disabled={isLastPage}
                  className={isLastPage ? "pointer-events-none opacity-40" : ""}
                >
                  <span className="flex">
                    <ChevronDownIcon className="h-4 w-4 -rotate-90" />
                    <ChevronDownIcon className="h-4 w-4 -rotate-90 -ml-2" />
                  </span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default BrandValuationPage;
