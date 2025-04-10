'use client';

import { Checkbox, CheckboxGroup, Form } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { GROUP_STATUS_ENUM, SHARE_SCOPE_ENUM } from '@/config/constant';

interface FilterGroupFormProps {
  onChange: (params: {
    status: string[];
    shareScope: string[];
    isMine: string[];
  }) => void;
  defaultValue: {
    status: string[];
    shareScope: string[];
    isMine: string[];
  };
}

export default function FilterGroupForm({
  onChange,
  defaultValue,
  ...props
}: FilterGroupFormProps) {
  const t = useTranslations('home');

  const [isMine, setIsMine] = useState<string[]>([]);
  const [shareScope, setShareScope] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);

  const isMineOptions: string[] = ['1'];
  const shareScopeOptions: SHARE_SCOPE_ENUM[] = [
    SHARE_SCOPE_ENUM.PUBLIC,
    SHARE_SCOPE_ENUM.PRIVATE,
  ];
  const statusOptions: GROUP_STATUS_ENUM[] = [
    GROUP_STATUS_ENUM.INIT,
    GROUP_STATUS_ENUM.LOCKED,
    GROUP_STATUS_ENUM.AVAILABLE,
    GROUP_STATUS_ENUM.UNAVAILABLE,
  ];

  const shareScopeLabels: Record<string, string> = {
    [SHARE_SCOPE_ENUM.PUBLIC]: t('filter.share_scope_label.public'),
    [SHARE_SCOPE_ENUM.PRIVATE]: t('filter.share_scope_label.private'),
  };
  const statusLabels: Record<string, string> = {
    [GROUP_STATUS_ENUM.INIT]: t('filter.status_label.init'),
    [GROUP_STATUS_ENUM.LOCKED]: t('filter.status_label.locked'),
    [GROUP_STATUS_ENUM.AVAILABLE]: t('filter.status_label.available'),
    [GROUP_STATUS_ENUM.UNAVAILABLE]: t('filter.status_label.unavailable'),
  };

  const onChangeShareScope = (v: string[]) => {
    setShareScope(v);
    onChange({ shareScope: v, status, isMine });
  };

  const onChangeStatus = (v: string[]) => {
    setStatus(v);
    onChange({ shareScope, status: v, isMine });
  };

  const onChangeIsMine = (v: string[]) => {
    setIsMine(v);
    onChange({ shareScope, status, isMine: v });
  };

  useEffect(() => {
    setIsMine(defaultValue.isMine);
    setShareScope(defaultValue.shareScope);
    setStatus(defaultValue.status);
  }, []);

  return (
    <Form className="w-full p-2">
      <CheckboxGroup
        label={t('filter.my_group')}
        orientation="horizontal"
        value={isMine}
        onChange={onChangeIsMine}
      >
        {isMineOptions.map((option) => {
          return (
            <Checkbox key={option} value={option}>
              {option === '1'
                ? t('filter.my_group_label.mine')
                : t('filter.my_group_label.other')}
            </Checkbox>
          );
        })}
      </CheckboxGroup>

      <CheckboxGroup
        label={t('filter.share_scope')}
        orientation="horizontal"
        value={shareScope}
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
        label={t('filter.status')}
        value={status}
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
