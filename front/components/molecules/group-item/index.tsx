import { HashtagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

import { MyButton } from '@/components/atoms/Button';
import {
  GroupOwnerIcon,
  ShoppingBagIcon,
  SquareInformationIcon,
  TimerIcon,
} from '@/components/atoms/icons';
import { commaFormat } from '@/shared/helper/format';

interface GroupCardItemProps {
  id: string;
}

export default function GroupCardItem({ id }: GroupCardItemProps) {
  return (
    <div className="relative w-full rounded-3xl bg-white shadow-md max-w-[398px]">
      {/* Image and Overlay Info */}
      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl">
        <Image
          fill
          alt="Food"
          className="object-cover"
          src={'/images/image_default.webp'}
        />
        <div className="absolute left-4 top-4 flex gap-4">
          <div className="rounded-full bg-white px-3 py-1 text-coral-red">
            <span className="font-bold text-sm text-black mr-1">
              {commaFormat(1000)}
            </span>
            <span className="text-primary text-xs font-bold">vnđ</span>
          </div>
        </div>
      </div>
      <div className="absolute top-[176px] left-4 flex gap-4">
        <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 shadow-primary">
          <HashtagIcon className="h-4 w-4 text-primary" />
          <span className="text-black text-sm font-bold">
            {id.padStart(9, '0')}
          </span>
        </div>
        <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 shadow-primary">
          <UserGroupIcon className="h-4 w-4 text-primary" />
          <span className="text-black text-sm font-bold">10</span>
        </div>
        <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 shadow-primary">
          <TimerIcon className="h-4 w-4 text-primary" />
          <span className="text-black text-sm font-bold">10:00:00</span>
        </div>
      </div>

      <div className="p-4">
        {/* Menu */}
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-bold">Group Name</h3>
          <ul className="list-inside list-disc space-y-1 pl-4">
            <li className="text-primary">Comw Nam</li>
            <li className="text-primary">Comw Nam</li>
            <li className="text-primary">Comw Nam</li>
          </ul>
        </div>
        {/* Owner Group */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <GroupOwnerIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-md">CuongPH</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <MyButton className="group" variant="ghost">
            <SquareInformationIcon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
            <span className="group-hover:text-primary-foreground">
              Chi Tiết
            </span>
          </MyButton>
          <MyButton className="">
            <ShoppingBagIcon className="h-5 w-5 text-white group-hover:text-primary-foreground" />
            <span className="group-hover:text-primary-foreground">Đặt Đơn</span>
          </MyButton>
        </div>
      </div>
    </div>
  );
}
