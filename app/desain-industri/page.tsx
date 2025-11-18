"use client";

import Buttons from "@/components/atoms/buttons";
import Inputs from "@/components/atoms/inputs";
import Labels from "@/components/atoms/labels";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
import { MoreHorizontalIcon, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

type DataDesainIndustriProps = {
  judulDesainIndustri: string;
  noPermohonan: string;
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

const DesainIndustriPage = () => {
  const [showEditDesainIndustri, setShowEditDesainIndustri] = useState(false);
  const [showUpdatePembaruan, setShowUpdatePembaruan] = useState(false);
  const [showHapusDesainIndustri, setShowHapusDesainIndustri] = useState(false);
  const [showTambahData, setShowTambahData] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleCancel = () => {
    router.push("/desain-industri");
  };

  const handleSimpan = () => {
    router.push("/desain-industri");
  };

  const handleCancelHapusDesainIndustri = () => {
    router.push("/desain-industri");
  };

  const handleSimpanHapusDesainIndustri = () => {
    router.push("/desain-industri");
  };

  const statusUpdatePembaruan: Status[] = [
    {
      value: "setujui",
      label: "Setujui",
    },
    { value: "ditunda", label: "Ditunda" },
    { value: "ditolak", label: "Ditolak" },
  ];

  const DataTableMerk: DataDesainIndustriProps[] = [
    {
      judulDesainIndustri:
        "Aplikasi SISTEMONIKA (Sistem Terintegrasi Monitoring Notaris & Perkara)",
      noPermohonan: "J002014046345",
      linkPDKI: "Buka Link",
      tglBerakhirPerlindungan: "2024-10-10",
      sisaWaktuPerlindungan: "Sisa Waktu Perlindungan Habis",
      statusPembaruan: "Tidak Diperpanjang",
      pemegangHAKI: "Atiqa Zaviera",
    },
  ];

  return (
    <>
      <div className="bg-white p-4 flex justify-between">
        <div className="font-semibold">Tabel Desain Industri</div>
        <div>
          <Inputs
            type="search"
            placeholder="Cari Desain Industri"
            className="rounded-md w-[287px] px-2"
            onChange={(e) => setValue(e.target.value)}
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
      <Table className="bg-white m-5 rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead>Judul Desain Industri</TableHead>
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
          {DataTableMerk.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                Tidak ada data
              </TableCell>
            </TableRow>
          ) : (
            DataTableMerk.map((item) => {
              const {
                judulDesainIndustri,
                noPermohonan,
                linkPDKI,
                tglBerakhirPerlindungan,
                sisaWaktuPerlindungan,
                statusPembaruan,
                pemegangHAKI,
              } = item;

              return (
                <TableRow key={noPermohonan}>
                  <TableCell>{judulDesainIndustri}</TableCell>
                  <TableCell>{noPermohonan}</TableCell>
                  <TableCell>
                    <Link
                      href="/indikasi-geografis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      aria-label={`Buka PDKI untuk ${judulDesainIndustri}`}
                    >
                      {linkPDKI}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {tglBerakhirPerlindungan
                      ? new Date(tglBerakhirPerlindungan).toLocaleDateString()
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
                            onSelect={() => setShowEditDesainIndustri(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold">
                              Edit Desain Industri
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
                            onSelect={() => setShowHapusDesainIndustri(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div
                              className="text-sm hover:font-semibold"
                              onClick={() => setShowHapusDesainIndustri(true)}
                            >
                              Hapus Desain Industri
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dialog Edit Desain Industri */}
                    <Dialog
                      open={showEditDesainIndustri}
                      onOpenChange={setShowEditDesainIndustri}
                    >
                      <DialogContent className="sm:max-w-[788px] h-[476px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
                            Edit Desain Industri
                          </DialogTitle>
                          <div className="grid grid-cols-2 grid-rows-3 gap-4 px-4 pt-4">
                            <div className="col-span-2">
                              <Labels
                                text="Judul Desain Industri"
                                htmlFor="judul-desain-industri"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="Aplikasi SISTEMONIKA (Sistem Terintegrasi Monitoring Notaris & Perkara)"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
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
                                className="w-40 p-2"
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
                      <DialogContent className="sm:max-w-[788px] p-0">
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
                                className="w-40 p-2"
                              >
                                Simpan Perubahan
                              </Buttons>
                            </div>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={showHapusDesainIndustri}
                      onOpenChange={setShowHapusDesainIndustri}
                    >
                      <DialogContent className="sm:max-w-[372px] h-[331px] p-0 rounded-2xl">
                        <VisuallyHidden>
                          <DialogTitle>
                            Konfirmasi Hapus Desain Industri
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
                              Hapus Desain Industri
                            </p>
                            <p className="tex-xs text-[#888888]">
                              Apakah Kamu yakin ingin menghapus desain industri
                              ini?
                            </p>
                          </div>
                        </div>

                        <DialogFooterHapus className="p-4">
                          <DialogClose asChild>
                            <div className="space-x-2">
                              <Buttons
                                variant="defaultSecond"
                                size="sm"
                                onClick={() =>
                                  handleCancelHapusDesainIndustri()
                                }
                                className="w-20 p-2 bg-[#DC35451A]  text-[#DC3545] px-4 py-2 mr-3 rounded-md cursor-pointer"
                              >
                                Batal
                              </Buttons>
                              <Buttons
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleSimpanHapusDesainIndustri()
                                }
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
      <Dialog open={showTambahData} onOpenChange={setShowTambahData}>
        <DialogContent className="sm:max-w-[788px] p-0">
          <DialogHeader>
            <DialogTitle className="bg-[#064263] text-white rounded-t-lg">
              Tambah Desain Industri
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="col-span-2">
                <Labels
                  text="Judul Desain Industri"
                  htmlFor="judul-desain-industri"
                  className="block text-sm font-medium mb-1"
                />
                <Inputs
                  type="text"
                  placeholder="Masukan judul desain industri"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
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

              {/* <div>
                <Labels
                  text="Status"
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                />
                <Select onValueChange={(value) => setValue(value)}>
                  <SelectTrigger className="w-full border rounded px-2 py-1">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="setujui">Setujui</SelectItem>
                    <SelectItem value="ditunda">Ditunda</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
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

export default DesainIndustriPage;
