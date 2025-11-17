"use client";

import Buttons from "@/components/atoms/buttons";
import Inputs from "@/components/atoms/inputs";
import Labels from "@/components/atoms/labels";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
import { MoreHorizontalIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DataIndikasiGeografisProps = {
  geografis: number;
  noPermohonan: string;
  linkPDKI: string;
  tglBerakhirPerlindungan: string;
  sisaWaktuPerlindungan: string;
  statusPembaruan: string;
  pemegangHAKI: string;
};

const IndikasiGeografisPage = () => {
  const [showEditIndikasiGeografis, setShowEditIndikasiGeografis] =
    useState(false);
  const [showUpdatePembaruan, setShowUpdatePembaruan] = useState(false);
  const [showHapusIndikasiGeografis, setShowHapusIndikasiGeografis] =
    useState(false);
  const [value, setValue] = useState("");
  const [showTambahData, setShowTambahData] = useState(false);
  const router = useRouter();

  const handleHapusIndikasiGeografis = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus indikasi geografis ini?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
    });
  };

  const handleCancel = () => {
    router.push("/indikasi-geografis");
  };

  const handleSimpan = () => {
    router.push("/indikasi-geografis");
  };

  const DataTableMerk: DataIndikasiGeografisProps[] = [
    {
      geografis: 121,
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
        <div className="font-semibold">Tabel Indikasi Geografis</div>
        <div>
          <Inputs
            type="search"
            placeholder="Cari Indikasi Geografis"
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
            <TableHead>Geografi</TableHead>
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
                geografis,
                noPermohonan,
                linkPDKI,
                tglBerakhirPerlindungan,
                sisaWaktuPerlindungan,
                statusPembaruan,
                pemegangHAKI,
              } = item;

              return (
                <TableRow key={noPermohonan}>
                  <TableCell>{geografis}</TableCell>
                  <TableCell>{noPermohonan}</TableCell>
                  <TableCell>
                    <Link
                      href="/indikasi-geografis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      aria-label={`Buka PDKI untuk ${geografis}`}
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
                      <DropdownMenuContent className="w-45" align="end">
                        <DropdownMenuGroup className="space-y-1">
                          <DropdownMenuItem
                            onSelect={() => setShowEditIndikasiGeografis(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div className="text-sm hover:font-semibold">
                              Edit Indikasi Geografis
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
                            onSelect={() => setShowHapusIndikasiGeografis(true)}
                            className="cursor-pointer hover:bg-[#F5F7FA] hover:text-[#00425A]"
                          >
                            <div
                              className="text-sm hover:font-semibold"
                              onClick={() => handleHapusIndikasiGeografis()}
                            >
                              Hapus Indikasi Geografis
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dialog Edit Indikasi Geografis */}
                    <Dialog
                      open={showEditIndikasiGeografis}
                      onOpenChange={setShowEditIndikasiGeografis}
                    >
                      <DialogContent className="sm:max-w-[788px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white p-4 rounded-t-lg">
                            Edit Indikasi Geografis
                          </DialogTitle>
                          <div className="grid grid-cols-2 grid-rows-4 gap-4 p-4">
                            <div>
                              <Labels
                                text="Geografis"
                                htmlFor="geografis"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="121"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>
                            {/* <div>
                              <Labels
                                text="No Permohonan"
                                htmlFor="no-permohonan"
                                className="block text-sm font-medium mb-1"
                              />
                              <Select
                                onValueChange={(value) => setValue(value)}
                              >
                                <SelectTrigger className="w-full border rounded px-2 py-1">
                                  <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="setujui">
                                    Setujui
                                  </SelectItem>
                                  <SelectItem value="ditunda">
                                    Ditunda
                                  </SelectItem>
                                  <SelectItem value="ditolak">
                                    Ditolak
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div> */}

                            <div>
                              <Labels
                                text="No Permohonan"
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
                            {/* <div>
                              <Labels
                                text="No Pendaftaran"
                                htmlFor="no-pendaftaran"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="IDM000550171"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div> */}
                            <div>
                              <Labels
                                text="Tanggal Berakhir Perlindungan"
                                htmlFor="tanggal-berakhir-perlindungan"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="2025-10-10"
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
                                variant="default"
                                size="sm"
                                onClick={() => handleCancel()}
                                className="w-20 text-white p-2"
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
                      <DialogContent className="sm:max-w-[788px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white p-4 rounded-t-lg">
                            Update Pembaruan
                          </DialogTitle>
                          <div className="m-4">
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
                          </div>
                        </DialogHeader>
                        <DialogFooter className="p-4">
                          <DialogClose asChild>
                            <div className="space-x-2">
                              <Buttons
                                variant="default"
                                size="sm"
                                onClick={() => handleCancel()}
                                className="w-20 text-white p-2"
                              >
                                Batal
                              </Buttons>
                              <Buttons
                                variant="destructive"
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
              Tambah Indikasi Geografis
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="">
                <Labels
                  text="Geografis"
                  htmlFor="geografis"
                  className="block text-sm font-medium mb-1"
                />
                <Inputs
                  type="text"
                  placeholder="Masukan geografis"
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

export default IndikasiGeografisPage;
