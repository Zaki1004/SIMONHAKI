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
import Api from "@/services/api";
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
import Swal from "sweetalert2";

type DataMerksProps = {
  id: string;
  eticket: string;
  nomorPermohonan: string;
  nomorPendaftaran: string;
  idStatus: string;
  status: string;
  statusPendaftaran: string;
  idStatusPendaftaran: string;
  linkPDKI: string;
  tanggalBerakhirPerlindungan: string;
  sisaWaktuPerlindungan: string;
  statusPembaruan: string;
  namaPemegangHaki: string;
  idPemegangHaki: string;
};

interface StatusPembaruan {
  idStatus: string;
  namaStatus: string;
}
interface StatusPendaftaran {
  idStatusPendaftaran: string;
  statusPendaftaran: string;
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
  const [showDialogMerk, setShowDialogMerk] = useState(false);
  const [showKadaluarsa, setShowKadaluarsa] = useState(false);
  const [nomorPermohonan, setNomorPermohonan] = useState("");
  const [nomorPendaftaran, setNomorPendaftaran] = useState("");
  const [tanggalBerakhirPerlindungan, setTanggalBerakhirPerlindungan] =
    useState("");
  const [linkPdki, setLinkPdki] = useState("");
  const [namaPemegangHaki, setNamaPemegangHaki] = useState("");
  const [pemegangHakiList, setPemegangHakiList] = useState<PemegangHAKIProps[]>(
    []
  );
  const [updateStatusPembaruan, setUpdateStatusPembaruan] = useState("");
  const [fileEtiketMerk, setFileEtiketMerk] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [oldFileName, setOldFileName] = useState("");
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
  const [selectedStatus, setSelectedStatus] = useState<StatusPembaruan | null>(
    null
  );
  const [listStatus, setListStatus] = useState<StatusPembaruan[]>([]);
  const [selectedStatusPendaftaran, setSelectedStatusPendaftaran] =
    useState<StatusPendaftaran | null>(null);
  const [listStatusPendaftaran, setListStatusPendaftaran] = useState<
    StatusPendaftaran[]
  >([]);
  const [selectedPemegangHaki, setSelectedPemegangHaki] =
    useState<PemegangHAKIProps | null>(null);

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
    nomorPermohonan &&
    nomorPendaftaran &&
    tanggalBerakhirPerlindungan &&
    linkPdki &&
    selectedPemegangHaki &&
    selectedStatusPendaftaran &&
    (selectedRow ? oldFileName || selectedFile : selectedFile);
  selectedFile;

  const resetForm = () => {
    setNomorPermohonan("");
    setNomorPendaftaran("");
    setSelectedStatusPendaftaran(null);
    setLinkPdki("");
    setNamaPemegangHaki("");
    setTanggalBerakhirPerlindungan("");
    setSelectedFile(null);
    setOldFileName("");
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
      const [resMerk, resStatusPembaruan, resStatusPendaftaran] =
        await Promise.all([
          Api.get(
            `/merk?search=${encodeURIComponent(
              search
            )}&page=${currentPage}&limit=${perPage}`
          ),
          Api.get(`/status-pembaruan`),
          Api.get(`/status-pendaftaran`),
        ]);

      const result = resMerk.data?.data?.data;
      const totalData = resMerk.data?.data?.totalData || 0;
      const totalPage =
        totalData && perPage ? Math.ceil(totalData / perPage) : 1;

      const mappedData = Array.isArray(result)
        ? result.map((item: DataMerksProps) => ({
            ...item,
            sisaWaktuPerlindungan: item.tanggalBerakhirPerlindungan
              ? hitungSisaWaktu(item.tanggalBerakhirPerlindungan)
              : "-",
          }))
        : [];
      const isStatusPembaruan = resStatusPembaruan.data?.data || [];
      const isStatusPendaftaran = resStatusPendaftaran.data?.data || [];

      setDataTableMerk(mappedData);
      setTotalData(totalData);
      setTotalPage(totalPage);
      setListStatus(isStatusPembaruan);
      setListStatusPendaftaran(isStatusPendaftaran);
    } catch (error) {
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
    const file = files[0];

    setLoadingUpload(true);
    await new Promise((r) => setTimeout(r, 300));

    const MAX_SIZE = 200 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLoadingUpload(false);
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Max Size 2 MB",
      });
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "png") {
      setLoadingUpload(false);
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "Format file tidak valid, Format file PNG",
      });
      return;
    }
    // 3. Simulasi upload (API belum ada)
    setTimeout(() => {
      setSelectedFile(file);
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

  const handleCancelDialogMerk = () => {
    resetForm();
    setShowEditMerk(false);
  };

  const handleSimpanDialogMerk = async () => {
    setShowDialogMerk(false);
    if (
      !nomorPermohonan ||
      !nomorPendaftaran ||
      !tanggalBerakhirPerlindungan ||
      !linkPdki ||
      !selectedPemegangHaki ||
      !selectedStatusPendaftaran ||
      !(selectedRow ? oldFileName || selectedFile : selectedFile)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Lengkapi semua form terlebih dahulu.",
      });
      return;
    } else {
      setShowDialogMerk(true);
    }

    try {
      setShowDialogMerk(false);
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
        setShowDialogMerk(true);
        return;
      }

      if (result.isConfirmed) {
        setLoadingUpload(true);
        const formData = new FormData();
        formData.append("nomorPermohonan", nomorPermohonan);
        formData.append("nomorPendaftaran", nomorPendaftaran);
        formData.append(
          "statusPendaftaran",
          selectedStatusPendaftaran.statusPendaftaran
        );
        formData.append(
          "idStatusPendaftaran",
          selectedStatusPendaftaran.idStatusPendaftaran
        );
        formData.append(
          "tanggalBerakhirPerlindungan",
          formatToYMD(tanggalBerakhirPerlindungan)
        );
        formData.append("linkPDKI", linkPdki);
        formData.append("namaPemegangHaki", selectedPemegangHaki.nama);
        formData.append("idPemegangHaki", selectedPemegangHaki.id);
        if (selectedFile) {
          formData.append("eticket", selectedFile);
        }

        try {
          if (!selectedRow?.id) {
            const response = await Api.post("/merk", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            resetForm();
            await fetchDataMerk();

            await Swal.fire({
              icon: "success",
              title: "Berhasil Ditambahkan!",
              text: `Data merk berhasil ditambahkan.`,
              timer: 1500,
            }).then(() => setShowDialogMerk(false));
          } else {
            const response = await Api.put(
              `/merk/${selectedRow.id}`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );

            resetForm();
            await fetchDataMerk();

            await Swal.fire({
              icon: "success",
              title: "Berhasil Diubah!",
              text: `Data merk berhasil diubah`,
              timer: 1500,
            }).then(() => setShowDialogMerk(false));
          }
        } catch (err) {
          await Swal.fire({
            icon: "error",
            title: "Gagal",
            text: `Terjadi kesalahan saat ${
              selectedRow?.id ? "mengedit" : "menambahkan"
            } data merk.`,
          });

          setShowDialogMerk(true);
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

      setShowDialogMerk(true);
    }
  };

  const handleHapusImages = () => {
    setSelectedFile(null);
  };

  const handleEditMerk = (row: DataMerksProps) => {
    setShowDialogMerk(true);
    setSelectedRow(row);
    setNomorPermohonan(row.nomorPermohonan);
    setNomorPendaftaran(row.nomorPendaftaran);
    setSelectedStatusPendaftaran(
      row.statusPendaftaran
        ? {
            idStatusPendaftaran: row.idStatusPendaftaran,
            statusPendaftaran: row.statusPendaftaran,
          }
        : null
    );
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

    setOldFileName(row.eticket);
    setProgress(100);

    setShowEditMerk(true);
  };

  const handleCancelUpdateMerk = () => {
    router.push("/merk");
  };

  const handleSimpanUpdateMerk = async () => {
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
      eticket: selectedRow.eticket,
      nomorPermohonan: selectedRow.nomorPermohonan,
      nomorPendaftaran: selectedRow.nomorPendaftaran,
      idStatus: selectedStatus.idStatus,
      status: selectedStatus.namaStatus,
      idStatusPendaftaran: selectedStatusPendaftaran?.idStatusPendaftaran,
      statusPendaftaran: selectedStatusPendaftaran?.statusPendaftaran,
      tanggalBerakhirPerlindungan: formatToYMD(
        selectedRow.tanggalBerakhirPerlindungan
      ),
      linkPDKI: selectedRow.linkPDKI,
      idPemegangHaki: selectedRow.idPemegangHaki,
      namaPemegangHaki: selectedRow.namaPemegangHaki,
    };

    try {
      const response = await Api.put(
        `/merk/pembaruan/${selectedRow.id}`,
        payload
      );

      if (response.data?.responseCode === 200) {
        setDataTableMerk((prevData) =>
          prevData.map((item) =>
            item.id === selectedRow.id
              ? { ...item, statusPembaruan: updateStatusPembaruan }
              : item
          )
        );

        await fetchDataMerk();
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

  const handleCancelHapusMerk = () => {
    router.push("/merk");
  };

  const handleSimpanHapusMerk = async () => {
    setShowHapusMerk(false);

    if (!selectedRow) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih data merk yang ingin dihapus terlebih dahulu.",
      }).then(() => {});
      return;
    }
    console.log(!selectedRow);

    try {
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

      if (result.isDismissed) {
        setShowHapusMerk(true);
        return;
      }

      if (result.isConfirmed) {
        const response = await Api.delete(`/merk/${selectedRow.id}`);

        if (response.data?.responseCode === 200) {
          setDataTableMerk((prevData) =>
            prevData.filter((item) => item.id !== selectedRow.id)
          );

          await fetchDataMerk();
          setSelectedRow(null);

          Swal.fire({
            icon: "success",
            title: "Berhasil Dihapus!",
            text: `Data merk ${selectedRow.nomorPermohonan} berhasil dihapus dari tabel.`,
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
        text: "Gagal menghapus data merk. Silakan coba lagi.",
      });

      setShowHapusMerk(true);
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
    if (!sortConfig.key) return dataTableMerk;

    return [...dataTableMerk].sort((a, b) => {
      const x = a[sortConfig.key!];
      const y = b[sortConfig.key!];

      if (sortConfig.key === "status") {
        const labelX =
          typeof x === "object" && x !== null && "label" in x
            ? (x as StatusPendaftaran).statusPendaftaran ?? ""
            : typeof x === "string"
            ? x
            : "";
        const labelY =
          typeof y === "object" && y !== null && "label" in y
            ? (y as StatusPendaftaran).statusPendaftaran ?? ""
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
      // handle number
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
            qa-input="input-search"
            type="search"
            placeholder="Cari Merk"
            className="w-[287px] rounded-md px-2 py-1"
            value={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchDataMerk();
              }
            }}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Buttons
            qa-btn="tambah-data-merk"
            variant="default"
            size="sm"
            className="ml-2 "
            onClick={() => setShowDialogMerk(true)}
          >
            <Plus /> Tambah Data
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

      <Table qa-table="merk" className="bg-white m-5 rounded-xl">
        {/* border-separate border-spacing-0 */}
        <TableHeader>
          <TableRow>
            <TableHead>Etiket Merk</TableHead>

            <TableHead>
              <Buttons
                qa-btn="sorting-status"
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

            <TableHead>
              <Buttons
                qa-btn="sorting-nomor-pendaftaran"
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
              // const isLastRow = index === paginatedData.length - 1;
              const {
                eticket,
                status,
                statusPendaftaran,
                nomorPermohonan,
                nomorPendaftaran,
                linkPDKI,
                tanggalBerakhirPerlindungan,
                sisaWaktuPerlindungan,
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
                    qa-table={`cell.${rowIndex}.0.table-merk`}
                    className={`  ${
                      showKadaluarsa &&
                      isKadaluarsa(tanggalBerakhirPerlindungan)
                        ? "border-l-4 border-l-[#DC3545]"
                        : ""
                    }`}
                  >
                    <img
                      src={`${Api.defaults.baseURL}merk/eticket/${eticket}`}
                      alt={eticket}
                      width="70px"
                    />
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.1.table-merk`}>
                    {statusPendaftaran}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.2.table-merk`}>
                    {nomorPermohonan}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.3.table-merk`}>
                    {nomorPendaftaran}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.4.table-merk`}>
                    <Link
                      href="/indikasi-geografis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      aria-label={`Buka PDKI untuk ${eticket}`}
                    >
                      {linkPDKI}
                    </Link>
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.5.table-merk`}>
                    {tanggalBerakhirPerlindungan
                      ? formatToDMY(tanggalBerakhirPerlindungan)
                      : "-"}
                  </TableCell>
                  <TableCell
                    className="max-w-xs truncate"
                    qa-table={`cell.${rowIndex}.6.table-merk`}
                  >
                    {sisaWaktuPerlindungan}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.7.table-merk`}>
                    {status}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.8.table-merk`}>
                    {namaPemegangHaki}
                  </TableCell>
                  <TableCell qa-table={`cell.${rowIndex}.9.table-merk`}>
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
                            qa-select-option="edit-merk"
                            onSelect={() => handleEditMerk(item)}
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
                            qa-select-option="update-status-pembaruan"
                            onSelect={() => {
                              setShowUpdatePembaruan(true);
                              setSelectedRow(item);
                            }}
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
                            qa-select-option="hapus-merk"
                            onSelect={() => {
                              setShowHapusMerk(true);
                              setSelectedRow(item);
                            }}
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
                              Status Pembaruan
                              <span className="text-red-500 ml-1">*</span>
                            </Labels>
                            <Select
                              onValueChange={(val) =>
                                setSelectedStatus(JSON.parse(val))
                              }
                              qa-select="update-select-status-pembaruan"
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
                                    value={JSON.stringify(status)} // <- simpan object
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
                            <div className="space-x-2">
                              <Buttons
                                qa-btn="batal-update-pembaruan"
                                variant="defaultSecond"
                                size="sm"
                                onClick={() => handleCancelUpdateMerk()}
                                className="w-20 p-2"
                              >
                                Batal
                              </Buttons>
                              <Buttons
                                qa-btn="simpan-update-pembaruan"
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
                                qa-btn="batal-hapus-merk"
                                variant="defaultSecond"
                                size="sm"
                                onClick={() => handleCancelHapusMerk()}
                                className="w-20 p-2 bg-[#DC35451A]  text-[#DC3545] px-4 py-2 mr-3 rounded-md cursor-pointer"
                              >
                                Batal
                              </Buttons>
                              <Buttons
                                qa-btn="simpan-hapus-merk"
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
      <Dialog open={showDialogMerk} onOpenChange={setShowDialogMerk}>
        <DialogContent className="sm:max-w-[788px] p-0">
          <DialogHeader>
            <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
              {selectedRow ? "Edit Merk" : "Tambah Data Merk"}
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
                  htmlFor="no-pendaftaran"
                  className="block text-sm font-medium mb-1"
                >
                  Nomor Pendaftaran<span className="text-red-500 ml-1">*</span>
                </Labels>
                <Inputs
                  qa-input="input-nomor-pendaftaran"
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
                  qa-select="status-pendaftaran"
                  onValueChange={(val) => {
                    const selected = JSON.parse(val);
                    setSelectedStatusPendaftaran(selected); // Simpan object lengkap
                  }}
                  value={
                    selectedStatusPendaftaran
                      ? JSON.stringify(selectedStatusPendaftaran)
                      : ""
                  }
                >
                  <SelectTrigger
                    className="w-full border rounded px-2 py-1"
                    qa-select-trigger="select-status-pendaftaran"
                  >
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {listStatusPendaftaran?.map((status: StatusPendaftaran) => (
                      <SelectItem
                        key={status.idStatusPendaftaran}
                        value={JSON.stringify(status)}
                        qa-select-option={`select-status-pendaftaran-${status.statusPendaftaran}`}
                      >
                        {status.statusPendaftaran}
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
                  {/* File sudah ada */}
                  {selectedRow && selectedRow.eticket ? (
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="flex items-center gap-4">
                        <Image
                          src="/icon/png 1.svg"
                          width={50}
                          height={50}
                          alt="Uploaded"
                        />

                        <div>
                          <p className="font-medium">{selectedRow.eticket}</p>
                          <p className="text-xs text-gray-500">
                            File already uploaded
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Image
                          src="/icon/edit-svgrepo-com 2.svg"
                          width={16}
                          height={16}
                          alt="Edit"
                          onClick={handleBrowseClick}
                          className="cursor-pointer"
                        />

                        <Image
                          src="/icon/Trash.svg"
                          width={16}
                          height={16}
                          alt="Delete"
                          onClick={handleHapusImages}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Belum ada file*/}
                      {!selectedFile && !loadingUpload && (
                        <div className="w-full my-4 flex items-center justify-center">
                          <Image
                            src="/icon/png 1.svg"
                            alt="Upload"
                            width={50}
                            height={50}
                          />
                        </div>
                      )}

                      {/* On Progres */}
                      {loadingUpload ? (
                        <div className="w-full flex flex-col items-center gap-2">
                          <Progress
                            value={progress}
                            className="w-[60%] h-2 rounded-full bg-gray-200 [&>div]:bg-green-500 transition-all"
                          />
                          <p className="text-sm text-gray-600 font-medium mt-1">
                            {progress}%
                          </p>
                        </div>
                      ) : selectedFile ? (
                        /* File sudah ada */
                        <div className="flex items-center justify-between w-full gap-4">
                          <div className="flex items-center gap-4">
                            <Image
                              src="/icon/png 1.svg"
                              width={50}
                              height={50}
                              alt="Uploaded"
                            />

                            <div>
                              <p className="font-medium">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <Image
                              src="/icon/edit-svgrepo-com 2.svg"
                              width={16}
                              height={16}
                              alt="Edit"
                              onClick={handleBrowseClick}
                              className="cursor-pointer"
                            />
                            <Image
                              src="/icon/Trash.svg"
                              width={16}
                              height={16}
                              alt="Delete"
                              onClick={handleHapusImages}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      ) : (
                        /* default ketika belum upload file */
                        <div className="flex flex-col justify-center text-center">
                          <p className="text-gray-600">
                            <a
                              qa-link="input-file-etiket"
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
                      )}
                    </>
                  )}

                  {/* --- INPUT FILE TERSEMBUNYI --- */}
                  <input
                    qa-input="input-etiket-merk"
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
                qa-btn="batal-tambah-data-merk-edit-merk"
                variant="defaultSecond"
                size="sm"
                onClick={() => handleCancelDialogMerk()}
                className="w-20 p-2 mr-2"
              >
                Batal
              </Buttons>
            </DialogClose>
            <Buttons
              qa-btn="simpan-tambah-data-merk-edit-merk"
              variant="default"
              size="sm"
              disabled={!isFormValid}
              onClick={() => handleSimpanDialogMerk()}
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

export default MerkPage;
