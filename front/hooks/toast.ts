'use client';

import { addToast } from '@heroui/react';
import { useTranslations } from 'next-intl';

export const useSystemToast = () => {
  const tSystemMessage = useTranslations('system_message');
  const baseSettings = {
    variant: 'flat' as const,
    timeout: 3000,
    shouldShowTimeoutProgress: true,
  };

  const showError = (message: string, title?: string) => {
    addToast({
      ...baseSettings,
      title: title || tSystemMessage('error.auth_failed'),
      description: message,
      severity: 'danger',
      color: 'danger',
    });
  };

  const showSuccess = (title: string, description?: string) => {
    addToast({
      ...baseSettings,
      title: title,
      description: description,
      severity: 'success',
      color: 'success',
    });
  };

  return {
    showError,
    showSuccess,
  };
};
