'use client';

import { Checkbox, CheckboxGroup, Form } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { GROUP_STATUS_ENUM, SHARE_SCOPE_ENUM } from '@/config/constant';

interface FilterGroupFormProps {
  onChange: (status: string[], shareScope: string[]) => void;
}

export default function FilterGroupForm({
  onChange,
  ...props
}: FilterGroupFormProps) {
  const t = useTranslations('home');

  const [shareScope, setShareScope] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);

  const shareScopeOptions: SHARE_SCOPE_ENUM[] = [
    SHARE_SCOPE_ENUM.PUBLIC,
    SHARE_SCOPE_ENUM.PRIVATE,
  ];

  const shareScopeLabels: Record<string, string> = {
    [SHARE_SCOPE_ENUM.PUBLIC]: t('filter.share_scope_label.public'),
    [SHARE_SCOPE_ENUM.PRIVATE]: t('filter.share_scope_label.private'),
  };

  const statusOptions: GROUP_STATUS_ENUM[] = [
    GROUP_STATUS_ENUM.INIT,
    GROUP_STATUS_ENUM.LOCKED,
  ];

  const statusLabels: Record<string, string> = {
    [GROUP_STATUS_ENUM.INIT]: t('filter.status_label.init'),
    [GROUP_STATUS_ENUM.LOCKED]: t('filter.status_label.locked'),
  };

  const onChangeShareScope = (v: string[]) => {
    setShareScope(v);
  };

  const onChangeStatus = (v: string[]) => {
    setStatus(v);
  };

  useEffect(() => {
    onChange(shareScope, status);
  }, [shareScope, status]);

  return (
    <Form className="w-full p-2">
      <CheckboxGroup
        defaultValue={shareScope}
        label={t('filter.share_scope')}
        orientation="horizontal"
        onChange={onChangeShareScope}
      >
        {shareScopeOptions.map((option) => {
          return (
            <Checkbox key={option} value={option}>
              {shareScopeLabels[option]}
            </Checkbox>
          );
        })}
      </CheckboxGroup>
      <CheckboxGroup
        defaultValue={status}
        label={t('filter.status')}
        orientation="horizontal"
        onChange={onChangeStatus}
      >
        {statusOptions.map((option) => {
          return (
            <Checkbox key={option} value={option}>
              {statusLabels[option]}
            </Checkbox>
          );
        })}
      </CheckboxGroup>
    </Form>
  );
}
