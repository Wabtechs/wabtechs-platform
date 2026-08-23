import { create } from "zustand";

interface UIState {
  isMobileMenuOpen: boolean;
  isCommandPaletteOpen: boolean;
  isSidebarOpen: boolean;
  toggleMobileMenu: () => void;
  toggleCommandPalette: () => void;
  toggleSidebar: () => void;
  closeMobileMenu: () => void;
  closeCommandPalette: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCommandPaletteOpen: false,
  isSidebarOpen: true,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
}));
