import { create } from 'zustand';

const useUIStore = create((set) => ({
  showInsight: true,
  toggleInsight: () => set((s) => ({ showInsight: !s.showInsight })),
}));

export default useUIStore;
