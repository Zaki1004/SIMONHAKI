"use client";

import Buttons from "@/components/atoms/buttons";
import Inputs from "@/components/atoms/inputs";
import Labels from "@/components/atoms/labels";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import Swal from "sweetalert2";
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
import { PopoverContent } from "@/components/ui/popover";
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
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
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
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Api from "@/services/api";

type DataMerksProps = {
  id: string;
  etiket: string;
  nomorPermohonan: string;
  nomorPendaftaran: string;
  idStatus: string;
  status: string;
  linkPDKI: string;
  tanggalBerakhirPerlindungan: string;
  sisaWaktuPerlindungan: string;
  statusPembaruan: string;
  namaPemegangHaki: string;
};

interface Status {
  value: string;
  label: string;
}
interface UpdateStatusPembaruanProps {
  value: string;
  label: string;
  code: string;
}
interface PemegangHAKIProps {
  nama: string;
  id: string;
}

type SortField = keyof DataMerksProps | null;

const MerkPage = () => {
  const [showEditMerk, setShowEditMerk] = useState(false);
  const [showUpdatePembaruan, setShowUpdatePembaruan] = useState(false);
  const [showHapusMerk, setShowHapusMerk] = useState(false);
  const [showTambahData, setShowTambahData] = useState(false);
  const [showKadaluarsa, setShowKadaluarsa] = useState(false);
  const [value, setValue] = useState("");
  const [nomorPermohonan, setNomorPermohonan] = useState("");
  const [nomorPendaftaran, setNomorPendaftaran] = useState("");
  const [tanggalBerakhirPerlindungan, setTanggalBerakhirPerlindungan] =
    useState("");
  const [linkPdki, setLinkPdki] = useState("");
  const [namaPemegangHaki, setNamaPemegangHaki] = useState("");
  const [pemegangHakiList, setPemegangHakiList] = useState<PemegangHAKIProps[]>(
    []
  );
  const [statusTambahData, setStatusTambahData] = useState("");
  const [updateStatusPembaruan, setUpdateStatusPembaruan] = useState("");
  const [fileEtiketMerk, setFileEtiketMerk] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [progress, setProgress] = useState(13);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<DataMerksProps | null>(null);
  const [dataTableMerk, setDataTableMerk] = useState<DataMerksProps[]>([]);
  const [loadingPemegangHaki, setLoadingPemegangHaki] = useState(false);

  const [sortConfig, setSortConfig] = useState<{
    key: SortField;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: any) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (row: DataMerksProps) => {
    // simpan row yang dipilih (opsional)
    setSelectedRow(row);
    // autofill semua input
    setNomorPermohonan(row.nomorPermohonan);
    setNomorPendaftaran(row.nomorPendaftaran);
    setStatusTambahData(row.status);
    setLinkPdki(row.linkPDKI);
    setNamaPemegangHaki(row.namaPemegangHaki);

    // tanggal → ubah ke Date()
    setTanggalBerakhirPerlindungan("");

    // file (biasanya kosong kecuali kamu simpan nama file)
    setFileEtiketMerk(null);

    // buka dialog
    setShowEditMerk(true);
  };

  const isFormValid =
    nomorPermohonan &&
    nomorPendaftaran &&
    tanggalBerakhirPerlindungan &&
    linkPdki &&
    namaPemegangHaki &&
    statusTambahData &&
    selectedFile;

  const resetForm = () => {
    setNomorPermohonan("");
    setNomorPendaftaran("");
    setStatusTambahData("");
    setLinkPdki("");
    setNamaPemegangHaki("");
    setTanggalBerakhirPerlindungan("");
    setSelectedFile(null);
    setFileEtiketMerk(null);
    setSelectedRow(null);
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
      console.log(response, Array.isArray(result), result);
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

  const fetchDataMerk = async () => {
    try {
      const response = await Api.get(
        `/merk?search=${encodeURIComponent(
          search
        )}&page=${currentPage}&limit=${perPage}`
      );
      const result = response.data?.data?.data;
      const totalData = response.data?.data?.totalData || 0;
      const totalPage =
        totalData && perPage ? Math.ceil(totalData / perPage) : 1;

      const mappedData = Array.isArray(result)
        ? result.map((item: any) => ({
            ...item,
            sisaWaktuPerlindungan: item.tanggalBerakhirPerlindungan
              ? hitungSisaWaktu(item.tanggalBerakhirPerlindungan)
              : "-",
          }))
        : [];

      setDataTableMerk(mappedData);
      setTotalData(totalData);
      setTotalPage(totalPage);
    } catch (error) {
      console.error("Error fetching merk data", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data merk",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchDataMerk();
    fetchPemegangHaki();
  }, [search, currentPage, perPage]);

  const validateAndSetFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0]; // hanya satu file
    setLoadingUpload(true); // ⬅️ loading dulu
    // Optional: kasih delay dikit agar loading terlihat
    await new Promise((r) => setTimeout(r, 300));
    // 1. Validasi ukuran maksimal 2MB
    const MAX_SIZE = 200 * 1024 * 1024;
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
    setTimeout(() => {
      setSelectedFile(file); // hanya dipanggil sekali
      setLoadingUpload(false);
    }, 2000);
    console.log("Selected file:", file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    validateAndSetFiles(files);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleCancelTambahData = () => {
    router.push("/merk");
  };

  const handleSimpanTambahData = async () => {
    if (
      !nomorPermohonan ||
      !nomorPendaftaran ||
      !tanggalBerakhirPerlindungan ||
      !linkPdki ||
      !namaPemegangHaki ||
      !statusTambahData ||
      !selectedFile
    ) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Lengkapi semua form terlebih dahulu.",
      });
      return;
    }
    setShowTambahData(false);
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah data sudah benar?",
        text: "Pastikan semua informasi sudah benar sebelum menambahkan data.",
        showCancelButton: true,
        confirmButtonText: "Ya, tambah data",
        cancelButtonText: "Batal",
      });
      // Jika user batal, buka kembali dialog
      if (result.isDismissed) {
        setShowTambahData(true);
        return;
      }
      // Step 3: Jika user konfirmasi, kirim data ke API
      if (result.isConfirmed) {
        setLoadingUpload(true);
        const formData = new FormData();
        formData.append("nomorPermohonan", nomorPermohonan);
        formData.append("nomorPendaftaran", nomorPendaftaran);
        formData.append("status", statusTambahData);
        formData.append(
          "tanggalBerakhirPerlindungan",
          tanggalBerakhirPerlindungan
        );
        formData.append("linkPDKI", linkPdki);
        formData.append("pemegangHAKI", namaPemegangHaki);
        if (selectedFile) {
          formData.append("etiket", selectedFile);
        }

        try {
          const response = await Api.post("/merk", formData, {});

          const newData = response.data?.data;
          resetForm();
          await fetchDataMerk();

          await Swal.fire({
            icon: "success",
            title: "Berhasil Ditambahkan!",
            text: `Data merk dengan ID ${newData?.id} berhasil ditambahkan.`,
            confirmButtonText: "Oke",
          });
        } catch (err: any) {
          let message = "Terjadi kesalahan saat menyimpan data.";
          if (err.response) {
            switch (err.response.status) {
              case 400:
                message =
                  err.response.data?.message ||
                  "Data yang diinputkan tidak valid atau sudah ada";
                break;
              case 401:
                message = "Sesi Anda telah berakhir. Silakan login kembali.";
                break;
              case 403:
                message = "Anda tidak memiliki akses untuk menambahkan data.";
                break;
              case 405:
                message =
                  err.response.data?.message || "Data tidak sesuai format";
                break;
              case 500:
                message = err.response.data?.message || "Server Error (500)";
                break;
              default:
                message = err.response.data?.message || message;
            }
          }

          await Swal.fire({
            icon: "error",
            title: "Gagal",
            text: message,
          });

          // Buka kembali dialog jika gagal
          setShowTambahData(true);
        } finally {
          setLoadingUpload(false);
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

      setShowTambahData(true);
    }
  };

  const handleHapusImages = () => {
    setSelectedFile(null);
  };

  const handleCancelEditMerk = () => {
    router.push("/merk");
  };

  const handleSimpanEditMerk = () => {
    if (!selectedRow) return;

    const updatedData = dataTableMerk.map((item) =>
      item.nomorPermohonan === selectedRow.nomorPermohonan
        ? {
            ...item,
            status: statusTambahData?.trim() || item.status,
            nomorPermohonan: nomorPermohonan?.trim() || item.nomorPermohonan,
            nomorPendaftaran: nomorPendaftaran?.trim() || item.nomorPendaftaran,
            linkPDKI: linkPdki?.trim() || item.linkPDKI,
            tanggalBerakhirPerlindungan:
              tanggalBerakhirPerlindungan || item.tanggalBerakhirPerlindungan,
            pemegangHAKI: namaPemegangHaki.trim() || item.namaPemegangHaki,
          }
        : item
    );

    setDataTableMerk(updatedData);
    setShowEditMerk(false);

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data berhasil diperbarui!",
    });
  };

  const handleCancelUpdateMerk = () => {
    router.push("/merk");
  };

  const handleSimpanUpdateMerk = () => {
    setShowUpdatePembaruan(false);
    router.push("/merk");
  };

  const handleCancelHapusMerk = () => {
    router.push("/merk");
  };

  const handleSimpanHapusMerk = async () => {
    if (!selectedRow) return;

    // Tutup dialog dulu
    setShowHapusMerk(false);

    try {
      // Konfirmasi penghapusan
      const result = await Swal.fire({
        icon: "warning",
        title: "Konfirmasi Hapus",
        text: `Apakah Anda yakin ingin menghapus merk dengan nomor permohonan ${selectedRow.nomorPermohonan}?`,
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#DC3545",
        cancelButtonColor: "#6c757d",
      });

      // Jika user membatalkan
      if (result.isDismissed) {
        setShowHapusMerk(true);
        return;
      }

      // Jika user mengkonfirmasi penghapusan
      if (result.isConfirmed) {
        // Soft delete: filter data yang akan dihapus
        const updatedData = dataTableMerk.filter(
          (item) => item.nomorPermohonan !== selectedRow.nomorPermohonan
        );

        console.log("Data setelah soft delete:", updatedData);

        // Update state table
        setDataTableMerk(updatedData);

        // Reset selected row
        setSelectedRow(null);

        // Tampilkan notifikasi berhasil
        await Swal.fire({
          icon: "success",
          title: "Berhasil Dihapus!",
          text: "Data merk berhasil dihapus dari tabel.",
          confirmButtonText: "Oke",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        confirmButtonText: "Oke",
      });
      setShowHapusMerk(true);
    }
  };

  const statusTambah: Status[] = [
    { value: "didaftar", label: "Didaftar" },
    { value: "ditolak", label: "Ditolak KBM" },
  ];
  const statusUpdatePembaruan: UpdateStatusPembaruanProps[] = [
    { value: "none", label: "-", code: "-" },
    { value: "tidak-diperpanjang", label: "Tidak Diperpanjang", code: "TDP" },
    { value: "dalam-proses", label: "Dalam Proses", code: "DPS" },
    { value: "selesai", label: "Selesai", code: "SLS" },
  ];

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

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return dataTableMerk;

    return [...dataTableMerk].sort((a, b) => {
      const x = a[sortConfig.key!];
      const y = b[sortConfig.key!];

      // 1️⃣ Handle status (tipe Status)
      if (sortConfig.key === "status") {
        const labelX =
          typeof x === "object" && x !== null && "label" in x
            ? (x as any).label ?? ""
            : typeof x === "string"
            ? x
            : "";
        const labelY =
          typeof y === "object" && y !== null && "label" in y
            ? (y as any).label ?? ""
            : typeof y === "string"
            ? y
            : "";

        return sortConfig.direction === "asc"
          ? labelX.localeCompare(labelY)
          : labelY.localeCompare(labelX);
      }

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

      // handle number (kalau ada)
      if (typeof x === "number" && typeof y === "number") {
        return sortConfig.direction === "asc" ? x - y : y - x;
      }

      return 0;
    });
  }, [sortConfig, dataTableMerk]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPage || totalPage === 0;

  return (
    <>
      <div className="bg-white p-4 flex justify-between">
        <div className="font-semibold">Tabel Merk</div>
        <div className=" flex items-center">
          <Inputs
            type="search"
            placeholder="Cari Merk"
            className="w-[287px] rounded-md px-2 py-1"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Buttons
            variant="default"
            size="sm"
            className="ml-2 "
            onClick={() => {
              resetForm();
              setShowTambahData(true);
            }}
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
        <Labels htmlFor="toggle" className="text-sm font-semibold leading-none">
          Tampilkan Status Kadaluarsa
        </Labels>
      </div>

      <Table className="bg-white m-5 rounded-xl">
        {/* border-separate border-spacing-0 */}
        <TableHeader>
          <TableRow>
            <TableHead>Etiket Merk</TableHead>

            <TableHead>
              <Buttons
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("status");
                }}
                className="flex items-center"
              >
                Status
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

            <TableHead>
              <Buttons
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("nomorPendaftaran");
                }}
                className="flex items-center"
              >
                No Pendaftaran
                <span>
                  {sortConfig.key !== "nomorPendaftaran" ? (
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
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("statusPembaruan");
                }}
                className="flex items-center"
              >
                Status Pembaruan
                <span>
                  {sortConfig.key !== "statusPembaruan" ? (
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
                size=""
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort("pemegangHAKI");
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
            sortedData.map((item, index) => {
              // const isLastRow = index === paginatedData.length - 1;
              const {
                etiket,
                status,
                nomorPermohonan,
                nomorPendaftaran,
                linkPDKI,
                tanggalBerakhirPerlindungan,
                sisaWaktuPerlindungan,
                statusPembaruan,
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
                    className={`  ${
                      showKadaluarsa &&
                      isKadaluarsa(tanggalBerakhirPerlindungan)
                        ? "border-l-4 border-l-[#DC3545]"
                        : ""
                    }`}
                    // ${isLastRow ? "rounded-bl-xl" : ""}
                  >
                    <Image
                      src="/logo/image 1.svg"
                      alt="E-Tiket Merk"
                      width={52}
                      height={15}
                    />
                  </TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell>{nomorPermohonan}</TableCell>
                  <TableCell>{nomorPendaftaran}</TableCell>
                  <TableCell>
                    <Link
                      href="/indikasi-geografis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      aria-label={`Buka PDKI untuk ${etiket}`}
                    >
                      {linkPDKI}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {tanggalBerakhirPerlindungan
                      ? formatToDMY(tanggalBerakhirPerlindungan)
                      : "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {sisaWaktuPerlindungan}
                  </TableCell>
                  <TableCell>{statusPembaruan}</TableCell>
                  <TableCell>{namaPemegangHaki}</TableCell>
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
                            onSelect={() => handleEdit(item)}
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
                        </DialogHeader>
                        <div className="grid grid-cols-2 grid-rows-4 gap-4 p-4">
                          <div>
                            <Labels
                              htmlFor="etiket-merk"
                              className="block text-sm font-medium mb-1"
                            >
                              E-Tiket Merk
                              <span className="text-red-500 ml-1">*</span>
                            </Labels>
                            <Inputs
                              type="text"
                              placeholder="121"
                              className="w-full border rounded px-2 py-1"
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                            />
                          </div>
                          <div>
                            <Labels
                              htmlFor="status"
                              className="block text-sm font-medium mb-1"
                            >
                              Status
                              <span className="text-red-500 ml-1">*</span>
                            </Labels>
                            <Select
                              onValueChange={(val) => setStatusTambahData(val)}
                              value={statusTambahData}
                            >
                              <SelectTrigger className="w-full border rounded px-2 py-1">
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                              <SelectContent>
                                {statusTambah.map((update) => (
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
                              value={nomorPermohonan}
                              onChange={(e) =>
                                setNomorPermohonan(e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Labels
                              htmlFor="no-pendaftaran"
                              className="block text-sm font-medium mb-1"
                            >
                              Nomor Pendaftaran
                              <span className="text-red-500 ml-1">*</span>
                            </Labels>
                            <Inputs
                              type="text"
                              placeholder="IDM000550171"
                              className="w-full border rounded px-2 py-1"
                              value={nomorPendaftaran}
                              onChange={(e) =>
                                setNomorPendaftaran(e.target.value)
                              }
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
                                  {tanggalBerakhirPerlindungan ||
                                    "Masukkan tanggal berakhir perlindungan"}

                                  <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
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
                                      setTanggalBerakhirPerlindungan(
                                        date.toISOString().split("T")[0]
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
                              Link PDKI
                              <span className="text-red-500 ml-1">*</span>
                            </Labels>
                            <Inputs
                              type="text"
                              placeholder="https://simonhaki.pnm.co.id"
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
                              Nama Pemegang HAKI
                              <span className="text-red-500 ml-1">*</span>
                            </Labels>
                            <Select
                              onValueChange={(val) => setNamaPemegangHaki(val)}
                              value={namaPemegangHaki}
                            >
                              <SelectTrigger className="w-full border rounded px-2 py-1">
                                <SelectValue placeholder="Nama Pemegang HAKI" />
                              </SelectTrigger>
                              <SelectContent>
                                {pemegangHakiList &&
                                pemegangHakiList.length > 0 ? (
                                  pemegangHakiList.map((item) => (
                                    <SelectItem key={item.id} value={item.nama}>
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

                        <DialogFooter className="p-4">
                          <DialogClose asChild>
                            <Buttons
                              variant="defaultSecond"
                              size="sm"
                              onClick={() => handleCancelEditMerk()}
                              className="w-20 p-2"
                            >
                              Batal
                            </Buttons>
                          </DialogClose>
                          <Buttons
                            variant="default"
                            size="sm"
                            onClick={() => handleSimpanEditMerk()}
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
                      <DialogContent className="sm:max-w-[664px] h-[282px] p-0">
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
                              onValueChange={(val) =>
                                setUpdateStatusPembaruan(val)
                              }
                              value={updateStatusPembaruan}
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
                                onClick={() => handleCancelUpdateMerk()}
                                className="w-20 p-2"
                              >
                                Batal
                              </Buttons>
                              <Buttons
                                variant="default"
                                size="sm"
                                onClick={() => handleSimpanUpdateMerk()}
                                className="w-40 text-white p-2"
                              >
                                Simpan Perubahan
                              </Buttons>
                            </div>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Dialog Hapus Merk */}
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

      {/* Dialog Tambah Data Merk */}
      <Dialog open={showTambahData} onOpenChange={setShowTambahData}>
        <DialogContent className="sm:max-w-[788px] p-0">
          <DialogHeader>
            <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
              Tambah Data Merk
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div>
                <Labels
                  htmlFor="no-permohonan"
                  className="block text-sm font-medium mb-1 "
                >
                  Nomor Permohonan<span className="text-red-500 ml-1">*</span>
                </Labels>
                <Inputs
                  type="text"
                  placeholder="Masukan nomor permohonan"
                  className="w-full border rounded px-2 py-1"
                  value={nomorPermohonan}
                  onChange={(e) => setNomorPermohonan(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  htmlFor="no-pendaftaran"
                  className="block text-sm font-medium mb-1"
                >
                  Nomor Pendaftaran<span className="text-red-500 ml-1">*</span>
                </Labels>
                <Inputs
                  type="text"
                  placeholder="Masukan nomor pendaftaran"
                  className="w-full border rounded px-2 py-1"
                  value={nomorPendaftaran}
                  onChange={(e) => setNomorPendaftaran(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                >
                  Status<span className="text-red-500 ml-1">*</span>
                </Labels>
                <Select
                  onValueChange={(val) => setStatusTambahData(val)}
                  value={statusTambahData}
                >
                  <SelectTrigger className="w-full border rounded px-2 py-1">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTambah.map((update) => (
                      <SelectItem key={update.value} value={update.value}>
                        {update.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                          setTanggalBerakhirPerlindungan(
                            date.toISOString().split("T")[0]
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
                  onValueChange={(val) => setNamaPemegangHaki(val)}
                  value={namaPemegangHaki}
                >
                  <SelectTrigger className="w-full border rounded px-2 py-1">
                    <SelectValue placeholder="Pilih nama pemegang HAKI" />
                  </SelectTrigger>
                  <SelectContent>
                    {pemegangHakiList && pemegangHakiList.length > 0 ? (
                      pemegangHakiList.map((item) => (
                        <SelectItem key={item.id} value={item.nama}>
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
              <div className="w-[748px]">
                <Labels
                  htmlFor="etiket-merk"
                  className="block text-sm font-medium mb-1"
                >
                  E-Tiket Merk<span className="text-red-500 ml-1">*</span>
                </Labels>

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
                    setFileEtiketMerk(e.dataTransfer.files[0]);
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
                            Max File Size: 2MB (.png)
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
                    onChange={(e) => handleFileChange(e)}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="p-4">
            <DialogClose asChild>
              <Buttons
                variant="defaultSecond"
                size="sm"
                onClick={() => handleCancelTambahData()}
                className="w-20 p-2 mr-2"
              >
                Batal
              </Buttons>
            </DialogClose>
            <Buttons
              variant="default"
              size="sm"
              disabled={!isFormValid}
              onClick={() => handleSimpanTambahData()}
              className={`w-40 p-2 text-white ${
                !isFormValid
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLastPage) {
                      setCurrentPage((prev) => prev + 1);
                    }
                  }}
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

export default MerkPage;
