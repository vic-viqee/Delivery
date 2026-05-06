import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Address } from "@/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
}

interface LocationStore {
  currentAddress: Address | null;
  addresses: Address[];
  syncQueue: any[];
  setCurrentAddress: (address: Address | null) => void;
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  addToSyncQueue: (address: any) => void;
  removeFromSyncQueue: (tempId: string) => void;
  clearSyncQueue: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user, token) => {
        set({
          user,
          token: token || null,
          isAuthenticated: !!user,
        });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "delivery-auth",
    }
  )
);

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      currentAddress: null,
      addresses: [],
      syncQueue: [],

      setCurrentAddress: (address) => set({ currentAddress: address }),

      setAddresses: (addresses) => set({ addresses }),

      addAddress: (address) => {
        set((state) => ({
          addresses: [...state.addresses, address],
        }));
      },

      updateAddress: (id, updates) => {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? { ...addr, ...updates } : addr
          ),
        }));
      },

      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr.id !== id),
          currentAddress:
            state.currentAddress?.id === id ? null : state.currentAddress,
        }));
      },

      addToSyncQueue: (address) => {
        set((state) => ({
          syncQueue: [...state.syncQueue, { ...address, tempId: Date.now().toString() }],
        }));
      },

      removeFromSyncQueue: (tempId) => {
        set((state) => ({
          syncQueue: state.syncQueue.filter((item) => item.tempId !== tempId),
        }));
      },

      clearSyncQueue: () => set({ syncQueue: [] }),
    }),
    {
      name: "delivery-location",
    }
  )
);