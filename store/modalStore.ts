import { create } from "zustand";

export interface IModalButton {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
}

export interface IModalOptions {
  title?: string;
  message: string;
  buttons: IModalButton[];
  visible: boolean;
}

export interface ModalState extends IModalOptions {
  openModal: (options: Omit<IModalOptions, "visible">) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  title: "",
  message: "",
  buttons: [],
  visible: false,
  openModal: (options) => set({ ...options, visible: true }),
  closeModal: () => set({ visible: false }),
}));
