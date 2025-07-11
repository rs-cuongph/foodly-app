'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { MyButton } from '@/components/atoms/Button';
import { CreateGroupIcon, FilterIcon } from '@/components/atoms/icons';
import InputSearch from '@/components/atoms/InputSearch';
import FilterGroupForm from '@/components/molecules/filter-group';
import GroupCardList from '@/components/organisms/group-list';
import {
  GROUP_STATUS_ENUM,
  SHARE_SCOPE_ENUM,
  STORAGE_KEYS,
} from '@/config/constant';
import { GroupListParams } from '@/hooks/api/group/type';
import { useClickOutside } from '@/hooks/click-outside';
import { useSystemToast } from '@/hooks/toast';
import { useAuthStore } from '@/stores/auth';
import { FormType, ModalType, useCommonStore } from '@/stores/common';

export default function Home() {
  const searchParams = useSearchParams();
  const t = useTranslations();
  const commonStore = useCommonStore();
  const authStore = useAuthStore();
  const { showWarning, showSuccess } = useSystemToast();

  const popoverRef = useRef<HTMLFormElement>(null);
  const [popoverState, setPopoverState] = useState(false);
  const [searchForm, setSearchForm] = useState<GroupListParams>({
    keyword: '',
    page: 1,
    size: 999,
    sort: 'created_at:desc',
    is_online: '1',
    is_mine: 0,
    status: [GROUP_STATUS_ENUM.INIT],
    share_scope: [SHARE_SCOPE_ENUM.PUBLIC],
  });

  const onChangeFilter = (params: {
    shareScope: string[];
    status: string[];
    isMine: string[];
  }) => {
    setSearchForm((prev) => ({
      ...prev,
      share_scope: params.shareScope,
      status: params.status.filter((status) => !['0', '1'].includes(status)),
      is_mine: params.isMine.length > 0 ? 1 : 0,
      is_online: params.status
        .filter((status) => ['0', '1'].includes(status))
        .join(','),
    }));
  };

  const updateSearchForm = useCallback((keyword: string) => {
    setSearchForm((prev) => ({ ...prev, keyword }));
  }, []);

  const openCreateGroupModal = () => {
    if (!authStore.isLoggedIn) {
      commonStore.setIsOpen(true, ModalType.AUTH, FormType.SIGN_IN);
    } else {
      commonStore.setIsOpen(
        true,
        ModalType.CREATE_GROUP,
        FormType.CREATE_GROUP,
      );
    }
  };

  const getGoogleResult = async () => {
    const googleResult = searchParams.get('google_result');

    if (googleResult) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.GROUP_INVITE_CODE);
      showWarning(t('system_message.warning.signing_in'));
      const parsedGoogleResult = JSON.parse(googleResult);

      await signIn('tokenLogin', {
        ...parsedGoogleResult,
        redirect: false,
      });
      showSuccess(t('system_message.success.signin_success'));
      // clear search params has key google_result
      const url = new URL(window.location.href);

      url.searchParams.delete('google_result');
      window.history.replaceState({}, '', url.toString());
    }
  };

  useClickOutside(popoverRef, () => setPopoverState(false));

  useEffect(() => {
    getGoogleResult();
  }, []);

  return (
    <section className="">
      <div className="flex items-center justify-between">
        <div className="search-wrapper flex items-center gap-2 xs:w-full sm:w-fit">
          <InputSearch
            classNames={{
              mainWrapper:
                'md:min-w-[320px] md:max-w-[440px] xss:min-w-full xs:max-w-full sm:min-w-[320px] sm:max-w-full',
              input: 'placeholder:text-primary-200',
              inputWrapper: 'rounded-[32px]',
            }}
            size="lg"
            onChangeDebounce={updateSearchForm}
          />
          <Popover
            backdrop={'transparent'}
            isOpen={popoverState}
            offset={10}
            placement="right-start"
          >
            <PopoverTrigger>
              <MyButton
                isIconOnly
                onPress={() => setPopoverState(!popoverState)}
              >
                <FilterIcon className="h-6 w-6 text-white" />
              </MyButton>
            </PopoverTrigger>
            <PopoverContent className="w-[240px]">
              <FilterGroupForm
                ref={popoverRef}
                defaultValue={{
                  status: [
                    ...searchForm.status,
                    ...searchForm.is_online.split(','),
                  ],
                  shareScope: searchForm.share_scope,
                  isMine: [],
                }}
                onChange={onChangeFilter}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="group">
          <MyButton
            className="bottom-[80px] right-5 z-[49] fixed sm:relative sm:top-0 md:right-0 transition-all duration-1000 ease-in-out min-w-[24px] px-4 gap-0 "
            size="lg"
            onPress={openCreateGroupModal}
          >
            <CreateGroupIcon className="h-6 w-6 text-white" />
            <span className="w-0 opacity-0 group-hover:w-[100px] group-hover:opacity-100 transition-all duration-500 ease-in-out group-hover:ml-2">
              {t('button.create_group')}
            </span>
          </MyButton>
        </div>
      </div>
      <div className="my-2 flex flex-wrap gap-x-4 gap-y-4">
        <GroupCardList searchForm={searchForm} />
      </div>
    </section>
  );
}
