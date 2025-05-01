'use client';

import { useTranslations } from 'next-intl';

import { FoodLoading } from '@/components/atoms/FoodLoading';
import GroupCardItem from '@/components/molecules/group-item';
import { useGetGroupListQuery } from '@/hooks/api/group';
import { GroupListParams } from '@/hooks/api/group/type';
import { useWindowSize } from '@/hooks/window-size';

type GroupCardListProps = {
  searchForm: GroupListParams;
};

export default function GroupCardList(props: GroupCardListProps) {
  const t = useTranslations();
  const { windowSize, isMobile } = useWindowSize();
  const { searchForm } = props;
  const { data, isLoading } = useGetGroupListQuery(searchForm);

  if (isLoading) {
    return (
      <div className="bg-white text-center text-primary rounded-lg p-4">
        <FoodLoading />
      </div>
    );
  }

  if (data?.groups.length === 0) {
    return (
      <div className="bg-white text-center text-primary rounded-lg p-4">
        {t('common.empty')}
      </div>
    );
  }

  return data?.groups.map((group) => {
    const groupItemProps = {
      groupId: group.id,
      groupCode: group.code,
      groupName: group.name,
      createdBy: group.created_by.display_name,
      orderCount: group.order_count,
      totalQuantity: group.total_quantity,
      createdAt: group.created_at,
      expiredAt: group.public_end_time,
      groupPrice: group.price,
      menuItems: group.menu_items.map((item) => ({
        name: item.name,
        price: item.price,
      })),
    };

    return <GroupCardItem key={group.id} {...groupItemProps} />;
  });
}
