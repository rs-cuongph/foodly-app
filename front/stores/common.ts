import { create } from 'zustand';

import { ConfirmModalKind } from '@/components/organisms/foodly-apps/confirm-modal';

export enum FormType {
  SIGN_IN = 'signIn',
  SIGN_UP = 'signUp',
  CREATE_GROUP = 'createGroup',
  CONFIRM = 'modalConfirm',
  UPDATE_GROUP = 'updateGroup',
}

export enum ModalType {
  AUTH = 'modalAuth',
  CREATE_GROUP = 'modalUpsertGroup',
  CONFIRM = 'modalConfirm',
}

interface CommonStore {
  // Modal
  modalAuth: {
    isOpen: boolean;
    selectedForm: FormType;
    isLoadingConfirm: boolean;
  };
  modalUpsertGroup: {
    isOpen: boolean;
    isLoadingConfirm: boolean;
    selectedForm: FormType;
  };
  modalConfirm: {
    isOpen: boolean;
    isLoadingConfirm: boolean;
    selectedForm: FormType;
    kind: ConfirmModalKind;
  };
  // Actions
  setIsOpen: (isOpen: boolean, modal: ModalType, form?: FormType) => void;
  setSelectedForm: (form: FormType, modal: ModalType) => void;
  openForm: (form: FormType, modal: ModalType) => void;
  closeModal: (modal: ModalType) => void;
  setIsLoadingConfirm: (isLoadingConfirm: boolean, modal: ModalType) => void;
  setModalConfirm: (modalConfirm: Partial<CommonStore['modalConfirm']>) => void;
}

export const useCommonStore = create<CommonStore>((set) => ({
  modalAuth: {
    isOpen: false,
    selectedForm: FormType.SIGN_IN,
    isLoadingConfirm: false,
  },
  modalUpsertGroup: {
    isOpen: false,
    isLoadingConfirm: false,
    selectedForm: FormType.CREATE_GROUP,
  },
  modalConfirm: {
    kind: 'delete',
    isOpen: false,
    isLoadingConfirm: false,
    selectedForm: FormType.CREATE_GROUP,
  },
  // Actions
  setIsOpen: (isOpen, modal, form) =>
    set((state) => {
      if (modal === ModalType.AUTH) {
        return {
          modalAuth: {
            ...state.modalAuth,
            isOpen,
            selectedForm: form || state.modalAuth.selectedForm,
          },
        };
      } else if (modal === ModalType.CREATE_GROUP) {
        return {
          modalUpsertGroup: {
            ...state.modalUpsertGroup,
            isOpen,
            selectedForm: form || state.modalUpsertGroup.selectedForm,
          },
        };
      }

      return state;
    }),
  setSelectedForm: (form, modal) =>
    set((state) => {
      if (modal === ModalType.AUTH) {
        return {
          modalAuth: {
            ...state.modalAuth,
            selectedForm: form,
          },
        };
      } else if (modal === ModalType.CREATE_GROUP) {
        return {
          modalUpsertGroup: {
            ...state.modalUpsertGroup,
            selectedForm: form,
          },
        };
      }

      return state;
    }),
  openForm: (form, modal) =>
    set((state) => {
      if (modal === ModalType.AUTH) {
        return {
          modalAuth: {
            ...state.modalAuth,
            isOpen: true,
            selectedForm: form,
          },
        };
      } else if (modal === ModalType.CREATE_GROUP) {
        return {
          modalUpsertGroup: {
            ...state.modalUpsertGroup,
            isOpen: true,
            selectedForm: form,
          },
        };
      }

      return state;
    }),
  closeModal: (modal) =>
    set((state) => {
      if (modal === ModalType.AUTH) {
        return {
          modalAuth: {
            ...state.modalAuth,
            isOpen: false,
            selectedForm: FormType.SIGN_IN,
          },
        };
      } else if (modal === ModalType.CREATE_GROUP) {
        return {
          modalUpsertGroup: {
            ...state.modalUpsertGroup,
            isOpen: false,
            selectedForm: FormType.CREATE_GROUP,
          },
        };
      }

      return state;
    }),
  setIsLoadingConfirm: (isLoadingConfirm, modal) =>
    set((state) => {
      if (modal === ModalType.AUTH) {
        return {
          modalAuth: {
            ...state.modalAuth,
            isLoadingConfirm,
          },
        };
      } else if (modal === ModalType.CREATE_GROUP) {
        return {
          modalUpsertGroup: {
            ...state.modalUpsertGroup,
            isLoadingConfirm,
          },
        };
      }

      return state;
    }),
  setModalConfirm: (modalConfirm: Partial<CommonStore['modalConfirm']>) =>
    set((state) => ({
      modalConfirm: {
        ...state.modalConfirm,
        ...modalConfirm,
      },
    })),
}));
