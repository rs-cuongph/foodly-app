'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
} from 'react';

import ForgotPasswordModalForm from './form-forgot';
import RequestSignInByCodeForm from './form-request-signin-by-code';
import ResetPasswordModalForm from './form-reset';
import SignInModalForm from './form-signin';
import SignUpModalForm from './form-signup';
import VerifySignInByCodeForm from './form-verify-signin-by-code';

import { MyButton } from '@/components/atoms/Button';
import { STORAGE_KEYS } from '@/config/constant';
import { FormType, ModalType, useCommonStore } from '@/stores/common';

interface FormConfig {
  title: string;
  component: ForwardRefExoticComponent<RefAttributes<any>>;
  showInNav?: boolean;
}

export default function SignInUpModal() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { modalAuth, closeModal, setIsOpen, setIsLoadingConfirm } =
    useCommonStore();

  const formRef = useRef<HTMLFormElement>(null);

  const formRegistry: Record<string, FormConfig> = {
    [FormType.SIGN_IN]: {
      title: t('common.modal_title.sign_in'),
      component: SignInModalForm,
      showInNav: true,
    },
    [FormType.SIGN_UP]: {
      title: t('common.modal_title.sign_up'),
      component: SignUpModalForm,
      showInNav: true,
    },
    [FormType.FORGOT_PASSWORD]: {
      title: t('common.modal_title.forgot_password'),
      component: ForgotPasswordModalForm,
      showInNav: true,
    },
    [FormType.RESET_PASSWORD]: {
      title: t('common.modal_title.reset_password'),
      component: ResetPasswordModalForm,
      showInNav: true,
    },
    [FormType.REQUEST_SIGN_IN_BY_CODE]: {
      title: t('common.modal_title.request_sign_in_by_code'),
      component: RequestSignInByCodeForm,
      showInNav: true,
    },
    [FormType.VERIFY_SIGN_IN_BY_CODE]: {
      title: t('common.modal_title.verify_sign_in_by_code'),
      component: VerifySignInByCodeForm,
      showInNav: true,
    },
  };

  const box = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  };

  const CurrentForm = formRegistry[modalAuth.selectedForm].component;

  const onSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  useEffect(() => {
    const modal = searchParams.get('modal') as FormType;
    const token = searchParams.get('token');

    const organizationCode = searchParams.get('organization_code');

    if (modal && [FormType.SIGN_IN, FormType.SIGN_UP].includes(modal)) {
      setIsOpen(true, ModalType.AUTH, modal);
    }

    if (token) {
      setIsOpen(true, ModalType.AUTH, FormType.RESET_PASSWORD);
    }

    if (organizationCode) {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION_CODE, organizationCode);
    } else {
      // init set organization
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION_CODE, 'GMODN');
    }

    return () => {
      setIsLoadingConfirm(false, ModalType.AUTH);
    };
  }, []);

  return (
    <Modal
      isDismissable={false}
      isOpen={modalAuth.isOpen}
      onClose={() => closeModal(ModalType.AUTH)}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h3 className="text-lg font-semibold">
            {formRegistry[modalAuth.selectedForm].title?.toUpperCase()}
          </h3>
        </ModalHeader>
        <ModalBody className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={modalAuth.selectedForm}
              animate="animate"
              exit="exit"
              initial="initial"
              variants={box}
            >
              <CurrentForm ref={formRef} />
            </motion.div>
          </AnimatePresence>
        </ModalBody>
        <ModalFooter>
          <MyButton variant="light" onPress={() => closeModal(ModalType.AUTH)}>
            {t('button.close')}
          </MyButton>
          <MyButton isLoading={modalAuth.isLoadingConfirm} onPress={onSubmit}>
            {t('button.confirm')}
          </MyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
