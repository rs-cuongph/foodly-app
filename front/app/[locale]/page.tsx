'use client';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useState } from 'react';

import { MyButton } from '@/components/atoms/Button';
import InputSearch from '@/components/atoms/InputSearch';
import FilterGroupForm from '@/components/molecules/filter-group';

export default function Home() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  const [searchForm, setSearchForm] = useState({
    keyword: '',
    page: 1,
    size: 50,
    sort: 'created_at',
    is_online: 0,
    share_scope: [] as string[],
    status: [] as string[],
  });

  const onChangeFilter = (shareScope: string[], status: string[]) => {
    setSearchForm((prev) => ({ ...prev, share_scope: shareScope, status }));
  };

  const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    setSearchForm((prev) => ({ ...prev, keyword }));
  };

  return (
    <section className="">
      <div className="search-wrapper flex items-center gap-2 w-fit">
        <InputSearch size="lg" onChange={onChangeKeyword} />

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
      <div className="mt-2">
        {/* <GroupCardList /> */}
        <div className="bg-white text-center text-primary rounded-lg p-4">
          {/* {tCommon('empty')} */}
          {/* <FoodLoading /> */}
        </div>
      </div>
    </section>
  );
}
