import { create } from 'zustand';

import { ConfirmModalKind } from '@/components/organisms/confirm-modal';

export enum FormType {
  SIGN_IN = 'signIn',
  SIGN_UP = 'signUp',
  FORGOT_PASSWORD = 'forgotPassword',
  RESET_PASSWORD = 'resetPassword',
  CREATE_GROUP = 'createGroup',
  CONFIRM = 'modalConfirm',
  UPDATE_GROUP = 'updateGroup',
  SETTING_ORDER = 'settingOrder',
  SETTING_PAYMENT = 'settingPayment',
  QR_CODE = 'qrCode',
}

export enum ModalType {
  AUTH = 'modalAuth',
  CREATE_GROUP = 'modalUpsertGroup',
  CONFIRM = 'modalConfirm',
  UPSERT_ORDER = 'modalUpsertOrder',
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
    data: any | null;
    selectedForm: FormType;
    kind: ConfirmModalKind;
  };
  modalUpsertOrder: {
    data: any | null;
    isOpen: boolean;
    isLoadingConfirm: boolean;
    selectedForm: FormType;
  };
  // Actions
  setIsOpen: (isOpen: boolean, modal: ModalType, form?: FormType) => void;
  setSelectedForm: (form: FormType, modal: ModalType) => void;
  openForm: (form: FormType, modal: ModalType) => void;
  closeModal: (modal: ModalType) => void;
  setIsLoadingConfirm: (isLoadingConfirm: boolean, modal: ModalType) => void;
  setModalConfirm: (modalConfirm: Partial<CommonStore['modalConfirm']>) => void;
  setDataModalUpsertOrder: (data: any) => void;
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
    data: null,
    isLoadingConfirm: false,
    selectedForm: FormType.CREATE_GROUP,
  },
  modalUpsertOrder: {
    isOpen: false,
    isLoadingConfirm: false,
    selectedForm: FormType.SETTING_ORDER,
    data: null,
  },
  // Actions
  setIsOpen: (isOpen, modal, form = undefined) =>
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
      } else if (modal === ModalType.UPSERT_ORDER) {
        return {
          modalUpsertOrder: {
            ...state.modalUpsertOrder,
            isOpen,
            selectedForm: form || state.modalUpsertOrder.selectedForm,
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
      } else if (modal === ModalType.UPSERT_ORDER) {
        return {
          modalUpsertOrder: {
            ...state.modalUpsertOrder,
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
      } else if (modal === ModalType.UPSERT_ORDER) {
        return {
          modalUpsertOrder: {
            ...state.modalUpsertOrder,
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
      } else if (modal === ModalType.UPSERT_ORDER) {
        return {
          modalUpsertOrder: {
            ...state.modalUpsertOrder,
            isOpen: false,
            selectedForm: FormType.SETTING_ORDER,
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
      } else if (modal === ModalType.UPSERT_ORDER) {
        return {
          modalUpsertOrder: {
            ...state.modalUpsertOrder,
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
  setDataModalUpsertOrder: (data: any) =>
    set((state) => ({
      modalUpsertOrder: {
        ...state.modalUpsertOrder,
        data,
      },
    })),
}));
