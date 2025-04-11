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
import { ForwardRefExoticComponent, RefAttributes, useRef } from 'react';

import CreateGroupForm from './form-create-group';

import { MyButton } from '@/components/atoms/Button';
import { FormType, ModalType, useCommonStore } from '@/stores/common';

interface FormConfig {
  title: string;
  component: ForwardRefExoticComponent<RefAttributes<any>>;
}

export default function UpsertGroupModal() {
  const t = useTranslations();
  const { modalUpsertGroup, closeModal } = useCommonStore();

  const formRef = useRef<HTMLFormElement>(null);

  const formRegistry: Record<string, FormConfig> = {
    [FormType.CREATE_GROUP]: {
      title: t('common.modal_title.create_group'),
      component: CreateGroupForm,
    },
  };

  const box = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  };

  const CurrentForm = formRegistry[modalUpsertGroup.selectedForm].component;

  const onSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  return (
    <Modal
      isOpen={modalUpsertGroup.isOpen}
      size="2xl"
      onClose={() => closeModal(ModalType.CREATE_GROUP)}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h3 className="text-lg font-semibold">
            {formRegistry[modalUpsertGroup.selectedForm].title?.toUpperCase()}
          </h3>
        </ModalHeader>
        <ModalBody className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={modalUpsertGroup.selectedForm}
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
          <MyButton
            variant="light"
            onPress={() => closeModal(ModalType.CREATE_GROUP)}
          >
            {t('button.close')}
          </MyButton>
          <MyButton
            isLoading={modalUpsertGroup.isLoadingConfirm}
            onPress={onSubmit}
          >
            {t('button.confirm')}
          </MyButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
