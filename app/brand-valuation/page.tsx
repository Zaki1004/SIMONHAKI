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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

type DataBrandValuationProps = {
  namaBrand: string;
  brandValuation: string;
  pemegangHAKI: string;
};

const BrandValuationPage = () => {
  const [showEditBrandValuation, setShowEditBrandValuation] = useState(false);
  const [showHapusBrandValuation, setShowHapusBrandValuation] = useState(false);
  const [showTambahData, setShowTambahData] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleHapusBrandValuation = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus brand valuation ini?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
    });
  };

  const handleCancel = () => {
    router.push("/brand-valuation");
  };

  const handleSimpan = () => {
    router.push("/brand-valuation");
  };

  const DataTableMerk: DataBrandValuationProps[] = [
    {
      namaBrand: "Red-Flower",
      brandValuation: "Bunga",
      pemegangHAKI: "Atiqa Zaviera",
    },
  ];
  return (
    <>
      <div className="bg-white p-4 flex justify-between">
        <div className="font-semibold">Tabel Brand Valuation</div>
        <div>
          <Inputs
            type="search"
            placeholder="Cari Brand Evaluation"
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
            <TableHead>Nama Brand</TableHead>
            <TableHead>Brand Valuation</TableHead>
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
              const { namaBrand, brandValuation, pemegangHAKI } = item;

              return (
                <TableRow key={namaBrand}>
                  <TableCell>{brandValuation}</TableCell>
                  <TableCell>{pemegangHAKI}</TableCell>
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
                              onClick={() => handleHapusBrandValuation()}
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
                      <DialogContent className="sm:max-w-[788px] p-0">
                        <DialogHeader>
                          <DialogTitle className="bg-[#064263] text-white p-4 rounded-t-lg">
                            Edit Brand Valuation
                          </DialogTitle>
                          <div className="grid grid-cols-2 grid-rows-4 gap-4 p-4">
                            <div className="col-span-2">
                              <Labels
                                text="Nama Brand"
                                htmlFor="nama-brand"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="Red-Flower"
                                className="w-full border rounded px-2 py-1"
                                onChange={(e) => setValue(e.target.value)}
                              />
                            </div>

                            <div>
                              <Labels
                                text="Brand Valuation"
                                htmlFor="brand-valuation"
                                className="block text-sm font-medium mb-1"
                              />
                              <Inputs
                                type="text"
                                placeholder="Bunga"
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
              Tambah Brand Valuation
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="col-span-2">
                <Labels
                  text="Nama Brand"
                  htmlFor="nama-brand"
                  className="block text-sm font-medium mb-1"
                />
                <Inputs
                  type="text"
                  placeholder="Masukan nama brand"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div>
                <Labels
                  text="Brand Valuation"
                  htmlFor="brand-valuation"
                  className="block text-sm font-medium mb-1"
                />
                <Inputs
                  type="text"
                  placeholder="Masukan brand valuation"
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

export default BrandValuationPage;
