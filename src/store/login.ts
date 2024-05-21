import { create } from "zustand";

export const useLogin = create((set) => ({
  login: false,
  showLogin: () => set(() => ({ login: true })),
  hideLogin: () => set(() => ({ login: false })),
}));
