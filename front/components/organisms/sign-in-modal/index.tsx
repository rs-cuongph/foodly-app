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

import SignInModalForm from './form-signin';
import SignUpModalForm from './form-signup';

import { MyButton } from '@/components/atoms/Button';
import { FormType, useCommonStore } from '@/stores/common';

interface FormConfig {
  title: string;
  component: React.ComponentType;
  showInNav?: boolean;
}

export default function SignInModal() {
  const tButton = useTranslations('button');
  const tCommon = useTranslations('common');
  const { isOpen, selectedForm, setSelectedForm, closeModal } =
    useCommonStore();

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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  };

  const CurrentForm = formRegistry[selectedForm].component;

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h3 className="text-lg font-semibold">
            {formRegistry[selectedForm].title?.toUpperCase()}
          </h3>
        </ModalHeader>
        <ModalBody>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedForm}
              animate="animate"
              exit="exit"
              initial="initial"
              variants={box}
            >
              <CurrentForm />
            </motion.div>
          </AnimatePresence>
        </ModalBody>
        <ModalFooter>
          <MyButton variant="light" onClick={closeModal}>
            {tButton('close')}
          </MyButton>
          <MyButton>{tButton('confirm')}</MyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
