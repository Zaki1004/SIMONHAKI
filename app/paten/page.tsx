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
import Api from "@/services/api";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { PopoverContent } from "@radix-ui/react-popover";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

type DataPatenProps = {
  id: string;
  judulPaten: string;
  nomorPermohonan: string;
  tanggalBerakhirPerlindungan: string;
  linkPDKI: string;
  sisaWaktuPerlindungan: string;
  idPemegangHaki: string;
  namaPemegangHaki: string;
  idStatus: string;
  status: string;
};

interface StatusPembaruan {
  idStatus: string;
  namaStatus: string;
}

interface PemegangHAKIProps {
  nama: string;
  id: string;
}

type SortField = keyof DataPatenProps | null;

const PatenPage = () => {
  const [showEditPaten, setShowEditPaten] = useState(false);
  const [showUpdatePembaruan, setShowUpdatePembaruan] = useState(false);
  const [showHapusPaten, setShowHapusPaten] = useState(false);
  const [showDialogPaten, setShowDialogPaten] = useState(false);
  const [showKadaluarsa, setShowKadaluarsa] = useState(false);
  const router = useRouter();
  const [judulPaten, setJudulPaten] = useState("");
  const [nomorPermohonan, setNomorPermohonan] = useState("");
  const [tanggalBerakhirPerlindungan, setTanggalBerakhirPerlindungan] =
    useState("");
  const [linkPdki, setLinkPdki] = useState("");
  const [namaPemegangHaki, setNamaPemegangHaki] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedRow, setSelectedRow] = useState<DataPatenProps | null>(null);
  const [dataTablePaten, setDataTablePaten] = useState<DataPatenProps[]>([]);
  const [loadingPemegangHaki, setLoadingPemegangHaki] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusPembaruan | null>(
    null
  );
  const [listStatus, setListStatus] = useState<StatusPembaruan[]>([]);
  const [selectedPemegangHaki, setSelectedPemegangHaki] =
    useState<PemegangHAKIProps | null>(null);
  const [pemegangHakiList, setPemegangHakiList] = useState<PemegangHAKIProps[]>(
    []
  );
  const [updateStatusPembaruan, setUpdateStatusPembaruan] = useState("");

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

  const isFormValid =
    judulPaten &&
    nomorPermohonan &&
    tanggalBerakhirPerlindungan &&
    linkPdki &&
    selectedPemegangHaki;

  const resetForm = () => {
    setSelectedRow(null);
    setJudulPaten("");
    setNomorPermohonan("");
    setTanggalBerakhirPerlindungan("");
    setLinkPdki("");
    setNamaPemegangHaki("");
  };

  const hitungSisaWaktu = (tanggal: string) => {
    if (!tanggal) return "-";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(tanggal);
    expDate.setHours(0, 0, 0, 0);
    // 2. Jika sudah kadaluarsa
    if (expDate < today) {
      return "Sisa waktu perlindungan habis";
    }
    // 3. Hitung selisih tahun, bulan, hari
    let years = expDate.getFullYear() - today.getFullYear();
    let months = expDate.getMonth() - today.getMonth();
    let days = expDate.getDate() - today.getDate();
    // Koreksi jika hari negatif
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      days += lastMonth.getDate();
    }
    // Koreksi jika bulan negatif
    if (months < 0) {
      years--;
      months += 12;
    }
    // Format output
    const parts = [];
    if (years > 0) parts.push(`${years} tahun`);
    if (months > 0) parts.push(`${months} bulan`);
    if (days > 0) parts.push(`${days} hari`);

    return parts.length > 0 ? parts.join(" ") : "Sisa waktu perlindungan habis";
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

  const fetchDataPaten = async () => {
    try {
      const [resPaten, resStatusPembaruan] = await Promise.all([
        Api.get(
          `/paten?search=${encodeURIComponent(
            search
          )}&page=${currentPage}&limit=${perPage}`
        ),
        Api.get(`/status-pembaruan`),
      ]);

      const result = resPaten.data?.data?.data;
      const totalData = resPaten.data?.data?.totalData || 0;
      const totalPage =
        totalData && perPage ? Math.ceil(totalData / perPage) : 1;

      const mappedData = Array.isArray(result)
        ? result.map((item: DataPatenProps) => ({
            ...item,
            sisaWaktuPerlindungan: item.tanggalBerakhirPerlindungan
              ? hitungSisaWaktu(item.tanggalBerakhirPerlindungan)
              : "-",
          }))
        : [];
      const isStatusPembaruan = resStatusPembaruan.data?.data || [];

      setDataTablePaten(mappedData);
      setTotalData(totalData);
      setTotalPage(totalPage);
      setListStatus(isStatusPembaruan);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data Paten",
      });
    }
  };

  useEffect(() => {
    fetchDataPaten();
    fetchPemegangHaki();
  }, [search, currentPage, perPage]);

  const handleCancelDialogPaten = () => {
    resetForm();
    setShowEditPaten(false);
  };

  const handleSimpanDialogPaten = async () => {
    setShowDialogPaten(false);
    if (
      !judulPaten ||
      !nomorPermohonan ||
      !tanggalBerakhirPerlindungan ||
      !linkPdki ||
      !selectedPemegangHaki
    ) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Lengkapi semua form terlebih dahulu.",
      });
      return;
    } else {
      setShowDialogPaten(true);
    }

    try {
      setShowDialogPaten(false);
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah data sudah benar?",
        text: `Pastikan semua informasi sudah benar sebelum ${
          selectedRow?.id ? "mengedit" : "menambahkan"
        } data.`,
        showCancelButton: true,
        confirmButtonText: "Ya, simpan data",
        cancelButtonText: "Batal",
      });

      if (result.isDismissed) {
        setShowDialogPaten(true);
        return;
      }

      if (result.isConfirmed) {
        const body = {
          judulPaten,
          nomorPermohonan,
          tanggalBerakhirPerlindungan: formatToYMD(tanggalBerakhirPerlindungan),
          linkPDKI: linkPdki,
          namaPemegangHaki: selectedPemegangHaki.nama,
          idPemegangHaki: selectedPemegangHaki.id,
        };

        try {
          if (!selectedRow?.id) {
            await Api.post("/paten", body);

            resetForm();
            await fetchDataPaten();

            await Swal.fire({
              icon: "success",
              title: "Berhasil Ditambahkan!",
              text: `Data Paten berhasil ditambahkan.`,
              timer: 1500,
            }).then(() => setShowDialogPaten(false));
          } else {
            await Api.put(`/paten/${selectedRow.id}`, body);

            resetForm();
            await fetchDataPaten();

            await Swal.fire({
              icon: "success",
              title: "Berhasil Diubah!",
              text: `Data Paten berhasil diubah`,
              timer: 1500,
            }).then(() => setShowDialogPaten(false));
          }
        } catch (err) {
          await Swal.fire({
            icon: "error",
            title: "Gagal",
            text: `Terjadi kesalahan saat ${
              selectedRow?.id ? "mengedit" : "menambahkan"
            } data Paten.`,
          });

          setShowDialogPaten(true);
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

      setShowDialogPaten(true);
    }
  };

  const handleEditPaten = (row: DataPatenProps) => {
    setShowDialogPaten(true);
    setSelectedRow(row);
    setJudulPaten(row.judulPaten);
    setNomorPermohonan(row.nomorPermohonan);
    setLinkPdki(row.linkPDKI);
    setSelectedPemegangHaki(
      row.namaPemegangHaki && row.idPemegangHaki
        ? {
            id: row.idPemegangHaki,
            nama: row.namaPemegangHaki,
          }
        : null
    );
    setTanggalBerakhirPerlindungan(
      formatToYMD(row.tanggalBerakhirPerlindungan)
    );
    setShowEditPaten(true);
  };

  const handleCancelUpdatePaten = () => {
    router.push("/paten");
  };

  const handleSimpanUpdatePaten = async () => {
    setShowUpdatePembaruan(false);
    if (!selectedRow || !selectedStatus) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih status pembaruan terlebih dahulu.",
      }).then(() => {
        setShowUpdatePembaruan(true);
      });
      return;
    }
    const payload = {
      judulPaten: selectedRow.judulPaten,
      nomorPermohonan: selectedRow.nomorPermohonan,
      idStatus: selectedStatus.idStatus,
      status: selectedStatus.namaStatus,
      tanggalBerakhirPerlindungan: formatToYMD(
        selectedRow.tanggalBerakhirPerlindungan
      ),
      linkPDKI: selectedRow.linkPDKI,
      idPemegangHaki: selectedRow.idPemegangHaki,
      namaPemegangHaki: selectedRow.namaPemegangHaki,
    };

    try {
      const response = await Api.put(
        `/paten/pembaruan/${selectedRow.id}`,
        payload
      );

      if (response.data?.responseCode === 200) {
        setDataTablePaten((prevData) =>
          prevData.map((item) =>
            item.id === selectedRow.id
              ? { ...item, statusPembaruan: updateStatusPembaruan }
              : item
          )
        );

        await fetchDataPaten();
        setSelectedRow(null);
        setSelectedStatus(null);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Status pembaruan berhasil diperbarui.",
          timer: 1500,
          showConfirmButton: false,
        });

        setUpdateStatusPembaruan("");
      } else {
        throw new Error("Update gagal");
      }
    } catch (error) {
      console.error("Error saat mengupdate pembaruan:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "gagal mengupdate status pembaruan. Silakan coba lagi.",
      });

      setShowUpdatePembaruan(true);
    }
  };

  const handleCancelHapusPaten = () => {
    router.push("/paten");
  };

  const handleSimpanHapusPaten = async () => {
    setShowHapusPaten(false);

    if (!selectedRow) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih data Paten yang ingin dihapus terlebih dahulu.",
      }).then(() => {});
      return;
    }
    console.log(!selectedRow);

    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Konfirmasi Hapus",
        text: `Apakah Anda yakin ingin menghapus Paten dengan nomor permohonan ${selectedRow.nomorPermohonan}?`,
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#DC3545",
        cancelButtonColor: "#6c757d",
      });

      if (result.isDismissed) {
        setShowHapusPaten(true);
        return;
      }

      if (result.isConfirmed) {
        const response = await Api.delete(`/paten/${selectedRow.id}`);

        if (response.data?.responseCode === 200) {
          setDataTablePaten((prevData) =>
            prevData.filter((item) => item.id !== selectedRow.id)
          );

          await fetchDataPaten();
          setSelectedRow(null);

          Swal.fire({
            icon: "success",
            title: "Berhasil Dihapus!",
            text: `Data Paten ${selectedRow.nomorPermohonan} berhasil dihapus dari tabel.`,
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
        text: "Gagal menghapus data Paten. Silakan coba lagi.",
      });

      setShowHapusPaten(true);
    }
  };

  const isKadaluarsa = (tanggal: string) => {
    if (!tanggal) return false;
    const expDate = new Date(tanggal);
    expDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expDate < today;
  };

  const formatToDMY = (tanggal: string) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatToYMD = (tanggal: string) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return dataTablePaten;

    return [...dataTablePaten].sort((a, b) => {
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
      // handle tanggal
      if (sortConfig.key === "tanggalBerakhirPerlindungan") {
        const dateX = x ? new Date(x as string).getTime() : 0;
        const dateY = y ? new Date(y as string).getTime() : 0;

        return sortConfig.direction === "asc" ? dateX - dateY : dateY - dateX;
      }
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
  }, [sortConfig, dataTablePaten]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPage || totalPage === 0;

  return (
    <>
      <div className="bg-white p-4 flex justify-between">
        <div className="font-semibold text-xl">Tabel Paten</div>
        <div>
          <Inputs
            qa-input="input-search"
            type="search"
            placeholder="Cari Paten"
            className="rounded-md w-[287px] px-2"
            value={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchDataPaten();
              }
            }}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Buttons
            qa-btn="tambah-data-paten"
            variant="default"
            size="sm"
            className="ml-2"
            onClick={() => setShowDialogPaten(true)}
          >
            <Plus />
            Tambah Data
          </Buttons>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2 mx-4 mt-4">
        <Checkbox
          qa-btn="checkbox-tampilkan-kadaluarsa"
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

      <Table qa-table="paten" className="bg-white m-5 rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Buttons
                qa-btn="sorting-judul-paten"
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("judulPaten");
                }}
                className="flex items-center"
              >
                Judul Paten
                <span>
                  {sortConfig.key !== "judulPaten" ? (
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
                qa-btn="sorting-nomor-permohonan"
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("nomorPermohonan");
                }}
                className="flex items-center"
              >
                No Permohonan
                <span>
                  {sortConfig.key !== "nomorPermohonan" ? (
                    <ArrowUpDown />
                  ) : sortConfig.direction === "asc" ? (
                    <ArrowUpWideNarrow />
                  ) : (
                    <ArrowDownWideNarrow />
                  )}
                </span>
              </Buttons>
            </TableHead>
            <TableHead>Link PDKI</TableHead>
            <TableHead>
              <Buttons
                qa-btn="sorting-tanggal-berakhir-perlindungan"
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("tanggalBerakhirPerlindungan");
                }}
                className="flex items-center"
              >
                Tgl Berakhir Perlindungan
                <span>
                  {sortConfig.key !== "tanggalBerakhirPerlindungan" ? (
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
                qa-btn="sorting-sisa-waktu-perlindungan"
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("sisaWaktuPerlindungan");
                }}
                className="flex items-center"
              >
                Sisa Waktu Perlindungan
                <span>
                  {sortConfig.key !== "sisaWaktuPerlindungan" ? (
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
                qa-btn="sorting-status-pembaruan"
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("status");
                }}
                className="flex items-center"
              >
                Status Pembaruan
                <span>
                  {sortConfig.key !== "status" ? (
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
                  handleSort("namaPemegangHaki");
                }}
                className="flex items-center"
              >
                Pemegang HAKI
                <span>
                  {sortConfig.key !== "namaPemegangHaki" ? (
                    <ArrowUpDown />
                  ) : sortConfig.direction === "asc" ? (
                    <ArrowUpWideNarrow />
                  ) : (
                    <ArrowDownWideNarrow />
                  )}
                </span>
              </Buttons>
            </TableHead>

            <TableHead>Action</TableHead>
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
              const {
                judulPaten,
                nomorPermohonan,
                linkPDKI,
                tanggalBerakhirPerlindungan,
                sisaWaktuPerlindungan,
                status,
                namaPemegangHaki,
              } = item;

              return (
                <TableRow
                  key={nomorPermohonan}
                  className={
                    showKadaluarsa && isKadaluarsa(tanggalBerakhirPerlindungan)
                      ? "border-l-4 border-l-[#DC3545] bg-[#DC35451A]"
                      : ""
                  }
                >
                  <TableCell
                    qa-table={`cell.${rowIndex}.0.table-paten`}
                    className={`  ${
                      showKadaluarsa &&
                      isKadaluarsa(tanggalBerakhirPerlindungan)
                        ? "border-l-4 border-l-[#DC3545]"
                        : ""
                    }`}
                  >
                    {judulPaten}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.1.table-paten`}>
                    {nomorPermohonan}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.2.table-paten`}>
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
                  <TableCell qa-table={`cell.${rowIndex}.3.table-paten`}>
                    {tanggalBerakhirPerlindungan
                      ? formatToDMY(tanggalBerakhirPerlindungan)
                      : "-"}
                  </TableCell>
                  <TableCell
                    qa-table={`cell.${rowIndex}.4.table-paten`}
                    className="max-w-xs truncate"
                  >
                    {sisaWaktuPerlindungan}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.5.table-paten`}>
                    {status}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.6.table-paten`}>
                    {namaPemegangHaki}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.7.table-paten`}>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          qa-select-trigger="select-action"
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
                            qa-select-option="edit-paten"
                            onSelect={() => handleEditPaten(item)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold">
                              Edit Paten
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            qa-select-option="update-pembaruan-paten"
                            onSelect={() => {
                              setShowUpdatePembaruan(true);
                              setSelectedRow(item);
                            }}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold">
                              Update Pembaruan
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            qa-select-option="hapus-paten"
                            onSelect={() => {
                              setShowHapusPaten(true);
                              setSelectedRow(item);
                            }}
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
                              Status Pembaruan
                              <span className="text-red-500 ml-1">*</span>
                            </Labels>
                            <Select
                              onValueChange={(val) =>
                                setSelectedStatus(JSON.parse(val))
                              }
                              qa-select="update-status-pembaruan"
                            >
                              <SelectTrigger
                                className="w-full border rounded px-2 py-1"
                                qa-select-trigger="select-update-status-pembaruan"
                              >
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>

                              <SelectContent>
                                {listStatus?.map((status: StatusPembaruan) => (
                                  <SelectItem
                                    key={status.idStatus}
                                    value={JSON.stringify(status)}
                                    qa-select-option={`select-update-status-pembaruan-${status.namaStatus}`}
                                  >
                                    {status.namaStatus}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </DialogHeader>
                        <DialogFooter className="p-4">
                          <DialogClose asChild>
                            <Buttons
                              qa-btn="batal-update-paten"
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelUpdatePaten()}
                              className="w-20 p-2"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            qa-btn="simpan-update-paten"
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
                              qa-btn="batal-hapus-paten"
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelHapusPaten()}
                              className="w-20 p-2 bg-[#DC35451A]  text-[#DC3545] px-4 py-2 mr-3 rounded-md cursor-pointer"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            qa-btn="simpan-hapus-paten"
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
      <Dialog open={showDialogPaten} onOpenChange={setShowDialogPaten}>
        <DialogContent className="sm:max-w-[788px] p-0">
          <DialogHeader>
            <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
              {selectedRow ? "Edit Paten" : "Tambah Data"}
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
                  qa-inpu="input-judul-paten"
                  type="text"
                  placeholder="Masukan judul paten"
                  className="w-full border rounded px-2 py-1"
                  value={judulPaten}
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
                  qa-input="input-nomor-permohonan"
                  type="text"
                  placeholder="Masukan nomor permohonan"
                  className="w-full border rounded px-2 py-1"
                  value={nomorPermohonan}
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
                      qa-btn="select-tanggal-berakhir-perlindungan"
                      variant="outline"
                      className="w-full justify-between font-normal"
                    >
                      {tanggalBerakhirPerlindungan ||
                        "Masukkan tanggal berakhir perlindungan"}

                      <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        tanggalBerakhirPerlindungan
                          ? new Date(tanggalBerakhirPerlindungan)
                          : undefined
                      }
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const day = String(date.getDate()).padStart(2, "0");
                          setTanggalBerakhirPerlindungan(
                            `${year}-${month}-${day}`
                          );
                        }
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
                  qa-input="input-link-pdki"
                  type="text"
                  placeholder="Masukan link PDKI"
                  className="w-full border rounded px-2 py-1"
                  value={linkPdki}
                  onChange={(e) => setLinkPdki(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  htmlFor="nama-pemegang-haki"
                  className="block text-sm font-medium mb-1"
                >
                  Nama Pemegang Haki<span className="text-red-500 ml-1">*</span>
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
                qa-btn="batal-tambah-data-paten-edit-paten"
                variant="defaultSecond"
                size="sm"
                onClick={() => handleCancelDialogPaten()}
                className="w-20 p-2"
              >
                Batal
              </Buttons>
            </DialogClose>
            <Buttons
              qa-btn="simpan-tambah-data-paten-edit-paten"
              variant="default"
              size="sm"
              disabled={!isFormValid}
              onClick={() => handleSimpanDialogPaten()}
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

export default PatenPage;
