"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddressForm, AddressCard } from "@/components/address/address-form";
import { useLocationStore } from "@/stores/auth";
import { toast } from "sonner";

const DEMO_ADDRESSES = [
  {
    id: "addr-1",
    name: "Home",
    latitude: -0.5389,
    longitude: 37.4586,
    landmark: "Near bus station",
    neighborhood: "Kiamuriuki",
    instructions: "Red gate, ring bell twice",
    is_default: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "addr-2",
    name: "Office",
    latitude: -0.5395,
    longitude: 37.4590,
    landmark: "Near market",
    neighborhood: "Town",
    instructions: "3rd floor, room 302",
    is_default: false,
    created_at: "2024-01-05T00:00:00Z",
  },
];

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setCurrentAddress } = useLocationStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const allAddresses = DEMO_ADDRESSES;

  const handleSaveAddress = (data: any) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, data);
      toast.success("Address updated successfully");
    } else {
      const newAddress = { ...data, id: `addr-${Date.now()}`, created_at: new Date().toISOString() };
      addAddress(newAddress);
      toast.success("Address added successfully");
    }
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    toast.success("Address deleted");
  };

  const handleSelectAddress = (address: any) => {
    setCurrentAddress(address);
    toast.success(`Selected "${address.name}" as delivery address`);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Addresses</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleSaveAddress}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingAddress(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {allAddresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold">No addresses saved</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first address to get started
          </p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {allAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isSelected={address.is_default}
              onSelect={() => handleSelectAddress(address)}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}