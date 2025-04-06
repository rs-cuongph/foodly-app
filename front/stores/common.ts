import { create } from 'zustand';

export enum FormType {
  SIGN_IN = 'signIn',
  SIGN_UP = 'signUp',
}

interface CommonStore {
  isOpen: boolean;
  selectedForm: FormType;
  setIsOpen: (isOpen: boolean, form?: FormType) => void;
  setSelectedForm: (form: FormType) => void;
  openForm: (form: FormType) => void;
  closeModal: () => void;
}

export const useCommonStore = create<CommonStore>((set) => ({
  isOpen: false,
  selectedForm: FormType.SIGN_IN,
  setIsOpen: (isOpen, form) => set({ isOpen, selectedForm: form }),
  setSelectedForm: (form) => set({ selectedForm: form }),
  openForm: (form) => set({ isOpen: true, selectedForm: form }),
  closeModal: () => set({ isOpen: false, selectedForm: FormType.SIGN_IN }),
}));
