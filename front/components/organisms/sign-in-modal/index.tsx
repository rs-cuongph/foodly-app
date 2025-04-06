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

import SignInModalForm from './form-signin';
import SignUpModalForm from './form-signup';

import { MyButton } from '@/components/atoms/Button';
import { LOCAL_STORAGE_KEYS } from '@/config/constant';
import { FormType, useCommonStore } from '@/stores/common';

interface FormConfig {
  title: string;
  component: ForwardRefExoticComponent<RefAttributes<any>>;
  showInNav?: boolean;
}

export default function SignInModal() {
  const tButton = useTranslations('button');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const { isOpen, selectedForm, setSelectedForm, closeModal, setIsOpen } =
    useCommonStore();

  const formRef = useRef<HTMLFormElement>(null);

  const formRegistry: Record<FormType, FormConfig> = {
    [FormType.SIGN_IN]: {
      title: tCommon('modal_title.sign_in'),
      component: SignInModalForm,
      showInNav: true,
    },
    [FormType.SIGN_UP]: {
      title: tCommon('modal_title.sign_up'),
      component: SignUpModalForm,
      showInNav: true,
    },
  };

  const box = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  };

  const CurrentForm = formRegistry[selectedForm].component;

  const onSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  useEffect(() => {
    const modal = searchParams.get('modal') as FormType;
    const organizationCode = searchParams.get('organization_code');

    if (modal && [FormType.SIGN_IN, FormType.SIGN_UP].includes(modal)) {
      setIsOpen(true, modal);
    }

    if (organizationCode) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.ORGANIZATION_CODE,
        organizationCode,
      );
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h3 className="text-lg font-semibold">
            {formRegistry[selectedForm].title?.toUpperCase()}
          </h3>
        </ModalHeader>
        <ModalBody className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedForm}
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
          <MyButton variant="light" onClick={closeModal}>
            {tButton('close')}
          </MyButton>
          <MyButton onClick={onSubmit}>{tButton('confirm')}</MyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
