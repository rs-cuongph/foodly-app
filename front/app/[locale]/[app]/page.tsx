'use client';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useState } from 'react';

import { MyButton } from '@/components/atoms/Button';
import { CreateGroupIcon } from '@/components/atoms/icons';
import InputSearch from '@/components/atoms/InputSearch';
import FilterGroupForm from '@/components/molecules/foodly-apps/filter-group';
import GroupCardList from '@/components/organisms/group-list';
import { GroupListParams } from '@/hooks/api/apps/foodly/group/type';
import { useWindowSize } from '@/hooks/window-size';
import { useAuthStore } from '@/stores/auth';
import { FormType, ModalType, useCommonStore } from '@/stores/common';

export default function Home() {
  const tButton = useTranslations('button');
  const commonStore = useCommonStore();
  const authStore = useAuthStore();
  const { windowSize } = useWindowSize();

  const [searchForm, setSearchForm] = useState<GroupListParams>({
    keyword: '',
    page: 1,
    size: 999,
    sort: 'created_at:desc',
    is_online: 1,
    is_mine: 0,
  });

  const onChangeFilter = (shareScope: string[], status: string[]) => {
    setSearchForm((prev) => ({ ...prev, share_scope: shareScope, status }));
  };

  const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    setSearchForm((prev) => ({ ...prev, keyword }));
  };

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

  return (
    <section className="">
      <div className="flex items-center justify-between">
        <div className="search-wrapper flex items-center gap-2 w-fit">
          <InputSearch
            classNames={{
              mainWrapper: 'md:min-w-[320px] md:max-w-[440px]',
              input: 'placeholder:text-primary-200',
              inputWrapper: 'rounded-[32px]',
            }}
            size="lg"
            onChange={onChangeKeyword}
          />
          <Popover
            showArrow
            backdrop={'transparent'}
            offset={10}
            placement="right-start"
          >
            <PopoverTrigger>
              <MyButton isIconOnly>
                <AdjustmentsHorizontalIcon className="h-6 w-6 text-white" />
              </MyButton>
            </PopoverTrigger>
            <PopoverContent className="w-[240px]">
              <FilterGroupForm onChange={onChangeFilter} />
            </PopoverContent>
          </Popover>
        </div>
        <MyButton
          className="bottom-[80px] right-5 z-[49] fixed sm:relative sm:top-0 md:right-0"
          isIconOnly={windowSize.width < 575}
          size="lg"
          onPress={openCreateGroupModal}
        >
          <CreateGroupIcon className="h-6 w-6 text-white" />
          <span className="sm:block hidden">{tButton('create_group')}</span>
        </MyButton>
      </div>
      <div className="my-2">
        <GroupCardList searchForm={searchForm} />
      </div>
    </section>
  );
}
