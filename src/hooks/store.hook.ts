import { create } from 'zustand';

interface ZIndexState {
  zIndex: number;
  increase: (by: number) => void;
}

export const usezIndexStore = create<ZIndexState>()((set) => ({
  zIndex: 0,
  increase: (by) => set((state) => ({ zIndex: state.zIndex + by })),
}));
